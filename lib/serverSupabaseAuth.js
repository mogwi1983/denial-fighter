import { createClient } from '@supabase/supabase-js';

/**
 * Validate Authorization: Bearer <jwt> using the anon key (JWT verification).
 * Returns auth user or null when missing/invalid.
 */
export async function getAuthUserFromRequest(request) {
  const authHeader = request.headers.get('authorization');
  const token =
    authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

  if (!token) {
    return { user: null };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return { user: null };
  }

  const supabase = createClient(url, anonKey);
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    return { user: null };
  }

  return { user: data.user };
}
