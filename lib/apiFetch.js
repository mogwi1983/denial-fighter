import { getSupabaseBrowserClient } from '@/lib/supabaseBrowser';

/**
 * Browser fetch that attaches Supabase access_token when a session exists.
 */
export async function fetchWithAuth(input, init = {}) {
  const headers = new Headers(init.headers || {});

  try {
    const supabase = getSupabaseBrowserClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      headers.set('Authorization', `Bearer ${session.access_token}`);
    }
  } catch {
    /* Missing env or non-browser — proceed without auth header */
  }

  return fetch(input, {
    ...init,
    headers,
  });
}
