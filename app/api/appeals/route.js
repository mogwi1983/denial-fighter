import { supabase } from '@/lib/supabase';
import { appealsRequireAuthenticatedUser } from '@/lib/appealsAccess';
import { getAuthUserFromRequest } from '@/lib/serverSupabaseAuth';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { user } = await getAuthUserFromRequest(request);
  const needUser = appealsRequireAuthenticatedUser();

  if (needUser && !user) {
    return NextResponse.json(
      { success: false, error: 'Sign in required to access appeal history.' },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const status = searchParams.get('status');

  try {
    if (id) {
      let query = supabase.from('denial_appeals').select('*').eq('id', id);
      if (user) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query.single();

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 404 });
      }
      return NextResponse.json({ success: true, appeal: data });
    }

    let query = supabase
      .from('denial_appeals')
      .select('id, created_at, payer_name, denial_reason, status, processing_time_seconds, patient_diagnosis')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status) query = query.eq('status', status);

    if (user) {
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query;

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, appeals: data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  const { user } = await getAuthUserFromRequest(request);
  const needUser = appealsRequireAuthenticatedUser();

  if (needUser && !user) {
    return NextResponse.json(
      { success: false, error: 'Sign in required to update appeals.' },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const { id, status, feedbackScore } = body;

    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    const updates = {};
    if (status) updates.status = status;
    if (feedbackScore) updates.feedback_score = feedbackScore;

    let query = supabase.from('denial_appeals').update(updates).eq('id', id);

    if (user) {
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query.select().single();

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, appeal: data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
