import Link from 'next/link';

export const metadata = {
  title: 'Privacy & data handling — Denial Fighter',
  description:
    'Beta-period overview of how Denial Fighter handles pasted text, deterministic scrubbing, AI requests, and saved appeals.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link href="/tool" className="text-lg font-bold tracking-tight text-slate-900">
            Denial Fighter
          </Link>
          <nav className="flex flex-wrap gap-4 text-sm font-semibold text-blue-700">
            <Link href="/tool" className="hover:text-blue-900 hover:underline">
              Tool
            </Link>
            <Link href="/landing" className="hover:text-blue-900 hover:underline">
              Landing
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Beta product notice</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Privacy & data handling</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Denial Fighter helps clinicians draft Medicare Advantage appeals from denial notices and chart notes. This page
          describes how data moves through the current MVP. It is not legal advice and does not claim HIPAA compliance or
          readiness.
        </p>

        <section className="mt-10 space-y-3">
          <h2 className="text-lg font-bold text-slate-950">What you enter</h2>
          <p className="text-sm leading-relaxed text-slate-700">
            You paste denial text and clinical notes into your browser. Until you navigate away, that content exists in the
            page like any other web form. Use{' '}
            <strong className="font-semibold text-slate-900">fake or de-identified examples</strong> during beta unless you
            have made an explicit decision to accept operational risk.
          </p>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="text-lg font-bold text-slate-950">Deterministic scrub (what it does)</h2>
          <p className="text-sm leading-relaxed text-slate-700">
            Before generation, the app applies{' '}
            <strong className="font-semibold text-slate-900">scripted pattern matching</strong> (regex-style rules) to
            replace common identifier shapes with placeholders—for example labeled patient-name lines, many phone and fax
            patterns, emails, URLs, some IDs and referral numbers, and similar artifacts described in code (
            <code className="rounded bg-slate-200 px-1 py-0.5 text-xs">lib/scrubPhiDeterministic.js</code>
            ).
          </p>
          <p className="text-sm leading-relaxed text-slate-700">
            You must <strong className="font-semibold text-slate-900">review the scrubbed preview</strong> and confirm it
            before the tool calls the AI or saves an appeal.
          </p>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="text-lg font-bold text-slate-950">Limits of scripted scrubbing</h2>
          <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-slate-700">
            <li>Unique clinical descriptions can still identify a person even when explicit IDs are removed.</li>
            <li>Unusual formatting, OCR noise, or uncommon identifiers may evade detection.</li>
            <li>
              This workflow is <strong className="font-semibold text-slate-900">not</strong> the same as HIPAA Safe Harbor
              professional de-identification.
            </li>
          </ul>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="text-lg font-bold text-slate-950">AI provider</h2>
          <p className="text-sm leading-relaxed text-slate-700">
            After scrubbing and confirmation, denial and chart-note text is sent to the configured model API (currently a
            DeepSeek-compatible endpoint) to produce structured appeal output. Configure keys only on the server; do not
            expose secrets in the browser.
          </p>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="text-lg font-bold text-slate-950">Saving appeals (Supabase)</h2>
          <p className="text-sm leading-relaxed text-slate-700">
            When persistence is enabled, generated appeals—including{' '}
            <strong className="font-semibold text-slate-900">scrubbed</strong> denial and chart fields used for
            generation—may be stored in your Supabase project. Treat that database as sensitive operational data; lock down
            keys and apply row-level security appropriate to your deployment.
          </p>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="text-lg font-bold text-slate-950">Browser session storage</h2>
          <p className="text-sm leading-relaxed text-slate-700">
            The most recent generation response may be held in <code className="text-xs">sessionStorage</code> so the results
            page can render without another round trip. It clears when the browser tab session ends.
          </p>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="text-lg font-bold text-slate-950">Questions</h2>
          <p className="text-sm leading-relaxed text-slate-700">
            For product or pilot questions, contact the operator listed on the landing page.{' '}
            <strong className="font-semibold text-slate-900">Do not send real PHI</strong> by email unless you have proper
            safeguards and agreements in place.
          </p>
        </section>

        <p className="mt-12 text-xs leading-relaxed text-slate-500">
          This document reflects the MVP behavior in-repo and may change as auth, retention, and vendor agreements are added.
        </p>
      </main>
    </div>
  );
}
