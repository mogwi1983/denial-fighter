'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Results() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('lastAppeal');

    if (!stored) {
      router.push('/tool');
      return;
    }

    try {
      setData(JSON.parse(stored));
    } catch {
      sessionStorage.removeItem('lastAppeal');
      router.push('/tool');
    }
  }, [router]);

  if (!data) return null;

  const { appeal, analysis, id, processingTime } = data;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(appeal);
      setCopied(true);
      setCopyError('');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError('Could not copy. Select and copy manually.');
    }
  };

  const downloadLetter = () => {
    const blob = new Blob([appeal], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `appeal-letter-${Date.now()}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const renderDetails = (value, fallback) => {
    if (Array.isArray(value) && value.length > 0) {
      return (
        <ul className="space-y-2 text-sm leading-relaxed text-slate-700">
          {value.map((item, index) => (
            <li key={`${item}-${index}`} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    if (typeof value === 'string' && value.trim()) {
      return <p className="text-sm leading-relaxed text-slate-700">{value}</p>;
    }

    return <p className="text-sm leading-relaxed text-slate-500">{fallback}</p>;
  };

  const hasEvidenceGaps = Array.isArray(analysis?.evidenceGaps)
    ? analysis.evidenceGaps.length > 0
    : Boolean(analysis?.evidenceGaps);

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Appeal Generated</h1>
          <p className="mt-1 text-slate-500">
            Processed in {processingTime || '0'}s {id && '- automatically saved to history'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/tool"
            className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            New Appeal
          </Link>
          <button
            type="button"
            onClick={copyToClipboard}
            className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold shadow-sm transition ${
              copied ? 'bg-teal-600 text-white' : 'bg-blue-700 text-white hover:bg-blue-800'
            }`}
          >
            {copied ? (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16h8M8 12h8m-7 8h6a2 2 0 0 0 2-2V7.5L13.5 4H9a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z" />
                </svg>
                Copy Letter
              </>
            )}
          </button>
        </div>
      </div>

      {copyError && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
          {copyError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">Strategic Analysis</h2>
            <div className="space-y-6">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-tight text-slate-400">Payer</label>
                <p className="text-sm font-semibold text-slate-950">{analysis?.payer || 'Unknown payer'}</p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-tight text-slate-400">Denial Reason</label>
                <p className="text-sm leading-relaxed text-slate-700">{analysis?.denialReason || 'Not specified'}</p>
              </div>

              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                <label className="mb-2 block text-xs font-bold uppercase tracking-tight text-blue-600">Evidence Needed</label>
                {renderDetails(analysis?.evidenceNeeded, 'No missing payer criteria returned.')}
              </div>

              <div className="rounded-lg border border-teal-100 bg-teal-50 p-4">
                <label className="mb-2 block text-xs font-bold uppercase tracking-tight text-teal-700">Evidence Covered</label>
                {renderDetails(analysis?.evidenceCovered, 'No supporting chart evidence returned.')}
              </div>

              {hasEvidenceGaps && (
                <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-tight text-amber-700">Evidence Gaps</label>
                  {renderDetails(analysis.evidenceGaps, 'No evidence gaps returned.')}
                </div>
              )}
            </div>
          </section>

          <section className="rounded-lg bg-slate-900 p-6 text-white shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/20 p-2">
                <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2Zm10-10V7a4 4 0 0 0-8 0v4h8Z" />
                </svg>
              </div>
              <h3 className="font-bold">Next Steps</h3>
            </div>
            <ol className="list-inside list-decimal space-y-4 text-sm text-slate-300">
              <li>Review the letter for clinical accuracy.</li>
              <li>Add any missing identifiers outside the app if needed.</li>
              <li>Attach supporting chart documentation.</li>
              <li>Submit through the payer process.</li>
            </ol>
          </section>
        </div>

        <div className="lg:col-span-2">
          <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Drafted Appeal Letter</span>
              <button
                type="button"
                onClick={downloadLetter}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900"
              >
                Download .txt
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto whitespace-pre-wrap p-6 font-serif text-sm leading-relaxed text-slate-800 sm:p-8">
              {appeal}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
