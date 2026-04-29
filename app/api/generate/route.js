import { analyzeWithChartNotes } from '@/lib/ai';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

const isProduction = process.env.NODE_ENV === 'production';
const persistAppeals =
  process.env.SAVE_GENERATED_APPEALS === 'true' ||
  (!isProduction && process.env.SAVE_GENERATED_APPEALS !== 'false');
const maxInputCharacters = 20000;

export async function POST(request) {
  const startTime = Date.now();
  
  try {
    const { denialText, chartNotes, patientDiagnosis, patientAge, payerName } = await request.json();

    if (!denialText || !chartNotes) {
      return NextResponse.json(
        { error: 'Both denial text and chart notes are required' },
        { status: 400 }
      );
    }

    if (denialText.length + chartNotes.length > maxInputCharacters) {
      return NextResponse.json(
        { error: 'Input is too long for this MVP endpoint' },
        { status: 413 }
      );
    }

    // Step 1: AI analysis + appeal generation
    const result = await analyzeWithChartNotes(denialText, chartNotes);

    // Step 2: Save to database
    let data = null;

    if (persistAppeals) {
      const savedAppeal = await supabase
        .from('denial_appeals')
        .insert({
          denial_text: denialText,
          payer_name: result.payer || payerName,
          denial_reason: result.denialReason,
          chart_notes: chartNotes,
          patient_diagnosis: patientDiagnosis,
          patient_age: patientAge,
          appeal_letter: result.appealLetter,
          evidence_gaps: result.evidenceGaps ? [result.evidenceGaps] : null,
          payer_specific_tips: result.evidenceNeeded,
          processing_time_seconds: Math.floor((Date.now() - startTime) / 1000),
          model_used: result.model || 'deepseek-chat',
          status: 'appeal_generated',
        })
        .select()
        .single();

      data = savedAppeal.data;

      if (savedAppeal.error) {
        console.error('Supabase error:', savedAppeal.error);
      }
    }

    return NextResponse.json({
      success: true,
      appeal: result.appealLetter,
      analysis: {
        payer: result.payer,
        denialReason: result.denialReason,
        evidenceNeeded: result.evidenceNeeded,
        evidenceCovered: result.evidenceCovered,
        evidenceGaps: result.evidenceGaps,
      },
      id: data?.id || null,
      saved: Boolean(data?.id),
      processingTime: Math.floor((Date.now() - startTime) / 1000),
    });

  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json(
      { error: 'Failed to generate appeal', details: error.message },
      { status: 500 }
    );
  }
}
