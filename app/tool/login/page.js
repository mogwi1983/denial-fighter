'use client';

import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabaseBrowser';

function ToolLoginInner() {
  const searchParams = useSearchParams();
  const paramError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const configured = useMemo(() => {
    try {
      return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    } catch {
      return false;
    }
  }, []);

  const sendMagicLink = async (event) => {
    event.preventDefault();
    setStatus('');

    const trimmed = email.trim();
    if (!trimmed) {
      setStatus('Enter your email.');
      return;
    }

    setLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=/tool`,
        },
      });

      if (error) {
        setStatus(error.message);
      } else {
        setStatus('Check your email for the sign-in link. Do not close this tab until you have clicked the link.');
      }
    } catch (err) {
      setStatus(err.message || 'Could not start sign-in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Account</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-950">Sign in</h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        Use a magic link (passwordless). Appeal history filters to your account after sign-in when your Supabase project has the{' '}
        <code className="rounded bg-slate-200 px-1 text-xs">user_id</code> column — run{' '}
        <code className="rounded bg-slate-200 px-1 text-xs">docs/002_denial_appeals_user_id.sql</code> once.
      </p>

      {(paramError || !configured) && (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {!configured ? (
            <>Missing public Supabase keys. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.</>
          ) : (
            <>Sign-in redirect issue: {decodeURIComponent(paramError)}</>
          )}
        </div>
      )}

      <form onSubmit={sendMagicLink} className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-500">
            Work email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none ring-blue-500 focus:ring-2"
            placeholder="you@clinic.org"
          />
        </div>

        {status && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">{status}</div>
        )}

        <button
          type="submit"
          disabled={loading || !configured}
          className={`w-full rounded-lg px-4 py-3 text-sm font-bold text-white transition ${
            loading || !configured ? 'cursor-not-allowed bg-blue-400' : 'bg-blue-700 hover:bg-blue-800'
          }`}
        >
          {loading ? 'Sending…' : 'Email magic link'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-600">
        <Link href="/tool" className="font-semibold text-blue-700 hover:underline">
          Back to New Appeal
        </Link>
      </p>
    </div>
  );
}

export default function ToolLoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-12 text-sm text-slate-600">Loading…</div>}>
      <ToolLoginInner />
    </Suspense>
  );
}
