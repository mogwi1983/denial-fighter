import { analyzeWithChartNotes } from '@/lib/ai';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

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

    // Step 1: AI analysis + appeal generation
    const result = await analyzeWithChartNotes(denialText, chartNotes);

    // Step 2: Save to database
    const { data, error } = await supabase
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

    if (error) {
      console.error('Supabase error:', error);
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
