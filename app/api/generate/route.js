import { analyzeWithChartNotes } from '@/lib/ai';
import { supabase } from '@/lib/supabase';
import { scrubAppealInputs, scrubClinicalText } from '@/lib/scrubPhiDeterministic';
import { getAuthUserFromRequest } from '@/lib/serverSupabaseAuth';
import { NextResponse } from 'next/server';

const isProduction = process.env.NODE_ENV === 'production';
const persistAppeals =
  process.env.SAVE_GENERATED_APPEALS === 'true' ||
  (!isProduction && process.env.SAVE_GENERATED_APPEALS !== 'false');
const maxInputCharacters = 20000;

function errorResponse(error, status = 500, details = {}) {
  return NextResponse.json(
    {
      success: false,
      error,
      ...details,
    },
    { status }
  );
}

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map(String);
  }

  if (typeof value === 'string' && value.trim()) {
    return [value.trim()];
  }

  return null;
}

export async function POST(request) {
  const startTime = Date.now();
  const { user } = await getAuthUserFromRequest(request);

  try {
    let payload;

    try {
      payload = await request.json();
    } catch {
      return errorResponse('Request body must be valid JSON.', 400);
    }

    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      payload = {};
    }

    const denialText = normalizeText(payload.denialText);
    const chartNotes = normalizeText(payload.chartNotes);
    const patientDiagnosis = normalizeText(payload.patientDiagnosis);
    const payerName = normalizeText(payload.payerName);
    const patientAge = normalizeText(payload.patientAge);

    if (!denialText || !chartNotes) {
      return errorResponse('Both denial text and chart notes are required.', 400, {
        fieldErrors: {
          denialText: denialText ? undefined : 'Denial text is required.',
          chartNotes: chartNotes ? undefined : 'Chart notes are required.',
        },
      });
    }

    if (denialText.length + chartNotes.length > maxInputCharacters) {
      return errorResponse(`Input is too long for this MVP endpoint. Keep combined text under ${maxInputCharacters} characters.`, 413);
    }

    const scrubbed = scrubAppealInputs({
      denialText,
      chartNotes,
      patientDiagnosis,
      payerName,
    });

    const patientAgeForDb = scrubClinicalText(patientAge).text.trim();

    if (!scrubbed.denialText || !scrubbed.chartNotes) {
      return errorResponse(
        'After scrubbing, denial text and chart notes must still contain clinical content. Add more detail or reduce placeholder-only input.',
        400,
      );
    }

    const result = await analyzeWithChartNotes(scrubbed.denialText, scrubbed.chartNotes, {
      patientDiagnosis: scrubbed.patientDiagnosis,
      payerName: scrubbed.payerName,
    });

    let data = null;

    if (persistAppeals) {
      const insertRow = {
        denial_text: scrubbed.denialText,
        payer_name: result.payer || scrubbed.payerName,
        denial_reason: result.denialReason,
        chart_notes: scrubbed.chartNotes,
        patient_diagnosis: scrubbed.patientDiagnosis,
        patient_age: patientAgeForDb,
        appeal_letter: result.appealLetter,
        evidence_gaps: normalizeList(result.evidenceGaps),
        payer_specific_tips: Array.isArray(result.evidenceNeeded)
          ? result.evidenceNeeded.join('\n')
          : result.evidenceNeeded,
        processing_time_seconds: Math.floor((Date.now() - startTime) / 1000),
        model_used: result.model || 'deepseek-chat',
        status: 'appeal_generated',
      };

      if (user?.id) {
        insertRow.user_id = user.id;
      }

      const savedAppeal = await supabase.from('denial_appeals').insert(insertRow).select().single();

      data = savedAppeal.data;

      if (savedAppeal.error) {
        console.error('Supabase error:', savedAppeal.error);
      }
    }

    return NextResponse.json({
      success: true,
      appeal: result.appealLetter,
      analysis: {
        payer: result.payer || scrubbed.payerName || 'Unknown payer',
        denialReason: result.denialReason || 'Not specified',
        evidenceNeeded: result.evidenceNeeded || [],
        evidenceCovered: result.evidenceCovered || [],
        evidenceGaps: result.evidenceGaps || [],
      },
      id: data?.id || null,
      saved: Boolean(data?.id),
      processingTime: Math.floor((Date.now() - startTime) / 1000),
      scrubSummary: {
        totalReplacements: scrubbed.stats.totalReplacements,
        byCategory: scrubbed.stats.byCategory,
      },
      generatedFromScrubbedInput: true,
    });

  } catch (error) {
    console.error('Generate error:', error);
    return errorResponse('Failed to generate appeal. Please try again with fake or de-identified text.', 500);
  }
}
