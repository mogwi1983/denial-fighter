'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabaseBrowser';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('Signing you in…');

  useEffect(() => {
    const code = searchParams.get('code');
    const next = searchParams.get('next') || '/tool';

    if (!code) {
      router.replace('/tool/login?error=' + encodeURIComponent('missing_code'));
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (cancelled) return;

        if (error) {
          router.replace(`/tool/login?error=${encodeURIComponent(error.message)}`);
          return;
        }

        router.replace(next.startsWith('/') ? next : '/tool');
      } catch (err) {
        if (!cancelled) {
          setMessage(err.message || 'Sign-in failed.');
          router.replace(`/tool/login?error=${encodeURIComponent(String(err.message || 'exchange_failed'))}`);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium text-slate-700">{message}</p>
      <Link href="/tool/login" className="mt-4 text-sm font-semibold text-blue-700 hover:underline">
        Back to sign-in
      </Link>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Suspense
        fallback={
          <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-600">Loading…</div>
        }
      >
        <CallbackContent />
      </Suspense>
    </div>
  );
}
