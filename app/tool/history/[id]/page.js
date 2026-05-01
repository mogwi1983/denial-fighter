'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fetchWithAuth } from '@/lib/apiFetch';

function renderList(value, emptyLabel) {
  if (Array.isArray(value) && value.length > 0) {
    return (
      <ul className="mt-2 space-y-2 text-sm leading-relaxed text-slate-700">
        {value.map((item, index) => (
          <li key={`${String(item)}-${index}`} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }
  if (typeof value === 'string' && value.trim()) {
    return <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{value}</p>;
  }
  return <p className="mt-2 text-sm text-slate-500">{emptyLabel}</p>;
}

export default function AppealDetailPage() {
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [appeal, setAppeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) {
      setError('Missing appeal id.');
      setLoading(false);
      return;
    }

    let cancelled = false;

    fetchWithAuth(`/api/appeals?id=${encodeURIComponent(id)}`)
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (cancelled) return;
        if (r.status === 401) {
          setError(data.error || 'Sign in to view this appeal.');
          setAppeal(null);
          return;
        }
        if (!r.ok || data.success === false || !data.appeal) {
          setError(data.error || `Could not load appeal (${r.status}).`);
          setAppeal(null);
          return;
        }
        setError('');
        setAppeal(data.appeal);
      })
      .catch(() => {
        if (!cancelled) {
          setError('Could not load this appeal. Check your connection and try again.');
          setAppeal(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const copyLetter = async () => {
    if (!appeal?.appeal_letter) return;
    try {
      await navigator.clipboard.writeText(appeal.appeal_letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard unavailable in this context. */
    }
  };

  const statusLabel = appeal?.status === 'appeal_generated' ? 'Draft' : appeal?.status || '';

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <Link
          href="/tool/history"
          className="text-sm font-semibold text-blue-700 hover:text-blue-900 hover:underline"
        >
          ← Back to history
        </Link>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <svg className="mb-4 h-8 w-8 animate-spin text-blue-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading appeal…
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-900">
          <p>{error}</p>
          <Link href="/tool/login" className="mt-2 inline-block font-semibold text-blue-800 underline hover:text-blue-950">
            Go to sign in
          </Link>
        </div>
      )}

      {!loading && !error && appeal && (
        <>
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Saved appeal</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-950">{appeal.payer_name || 'Unknown payer'}</h1>
              <p className="mt-1 text-slate-600">
                {appeal.created_at ? new Date(appeal.created_at).toLocaleString() : ''}
                {statusLabel ? (
                  <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold uppercase text-slate-700">
                    {statusLabel}
                  </span>
                ) : null}
              </p>
              {appeal.patient_diagnosis ? (
                <p className="mt-2 text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">Diagnosis:</span> {appeal.patient_diagnosis}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/tool"
                className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                New appeal
              </Link>
              <button
                type="button"
                onClick={copyLetter}
                disabled={!appeal.appeal_letter}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  copied ? 'bg-teal-600 text-white' : 'bg-blue-700 text-white hover:bg-blue-800'
                }`}
              >
                {copied ? 'Copied' : 'Copy letter'}
              </button>
            </div>
          </div>

          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950">
            Stored denial and chart fields are the scrubbed versions saved at generation time (or legacy raw rows from earlier builds). Treat as sensitive clinical context.
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-1">
              <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-400">Denial summary</h2>
                <p className="text-sm leading-relaxed text-slate-800">{appeal.denial_reason || 'Not recorded.'}</p>
                {appeal.payer_specific_tips ? (
                  <div className="mt-4">
                    <h3 className="text-xs font-bold uppercase tracking-tight text-blue-600">Payer-specific notes</h3>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                      {appeal.payer_specific_tips}
                    </p>
                  </div>
                ) : null}
                <div className="mt-4">
                  <h3 className="text-xs font-bold uppercase tracking-tight text-amber-700">Evidence gaps (stored)</h3>
                  {renderList(appeal.evidence_gaps, 'None recorded.')}
                </div>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-400">Scrubbed inputs</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-tight text-slate-500">Denial notice</h3>
                    <div className="mt-1 max-h-48 overflow-y-auto whitespace-pre-wrap rounded-md bg-slate-50 p-3 text-xs leading-relaxed text-slate-800">
                      {appeal.denial_text || 'Empty.'}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-tight text-slate-500">Chart notes</h3>
                    <div className="mt-1 max-h-48 overflow-y-auto whitespace-pre-wrap rounded-md bg-slate-50 p-3 text-xs leading-relaxed text-slate-800">
                      {appeal.chart_notes || 'Empty.'}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="lg:col-span-2">
              <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Draft appeal letter</span>
                </div>
                <div className="max-h-[75vh] overflow-y-auto whitespace-pre-wrap p-6 font-serif text-sm leading-relaxed text-slate-800 sm:p-8">
                  {appeal.appeal_letter || 'No letter stored for this record.'}
                </div>
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
