import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

const isProduction = process.env.NODE_ENV === 'production';
const allowPublicAppealHistory = process.env.ALLOW_PUBLIC_APPEAL_HISTORY === 'true';

function requireAppealHistoryAccess() {
  if (!isProduction || allowPublicAppealHistory) return null;

  return NextResponse.json(
    {
      success: false,
      error: 'Appeal history is disabled in production until authentication is enabled.',
    },
    { status: 403 }
  );
}

export async function GET(request) {
  const accessError = requireAppealHistoryAccess();
  if (accessError) return accessError;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const limit = parseInt(searchParams.get('limit') || '20');
  const status = searchParams.get('status');

  try {
    if (id) {
      const { data, error } = await supabase
        .from('denial_appeals')
        .select('*')
        .eq('id', id)
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 404 });
      return NextResponse.json({ success: true, appeal: data });
    }

    // List all appeals
    let query = supabase
      .from('denial_appeals')
      .select('id, created_at, payer_name, denial_reason, status, processing_time_seconds, patient_diagnosis')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status) query = query.eq('status', status);

    const { data, error } = await query;

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, appeals: data });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  const accessError = requireAppealHistoryAccess();
  if (accessError) return accessError;

  try {
    const { id, status, feedbackScore } = await request.json();
    
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const updates = {};
    if (status) updates.status = status;
    if (feedbackScore) updates.feedback_score = feedbackScore;

    const { data, error } = await supabase
      .from('denial_appeals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, appeal: data });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
