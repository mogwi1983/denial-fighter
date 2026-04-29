'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Results() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('lastAppeal');
    if (stored) {
      setData(JSON.parse(stored));
    } else {
      router.push('/tool');
    }
  }, [router]);

  if (!data) return null;

  const { appeal, analysis, id, processingTime } = data;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(appeal);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Could not copy. Select and copy manually.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Appeal Generated</h1>
          <p className="text-slate-500 mt-1">
            Processed in {processingTime || '2.4'}s {id && '· Automatically saved to history'}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/tool"
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition shadow-sm"
          >
            New Appeal
          </Link>
          <button
            onClick={copyToClipboard}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm flex items-center gap-2 ${
              copied ? 'bg-teal-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy Letter
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Analysis Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Strategic Analysis</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-tight mb-1">Payer</label>
                <p className="text-sm font-semibold text-slate-900">{analysis?.payer || 'Detected'}</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-tight mb-1">Denial Reason</label>
                <p className="text-sm text-slate-700 leading-relaxed">{analysis?.denialReason || 'Medical Necessity'}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <label className="block text-xs font-bold text-blue-400 uppercase tracking-tight mb-1">Winning Strategy</label>
                <p className="text-sm text-blue-700 leading-relaxed">{analysis?.evidenceNeeded || 'Citation of specific CMS Chapter 15 guidelines regarding medical necessity.'}</p>
              </div>
              {analysis?.evidenceGaps && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <label className="block text-xs font-bold text-amber-500 uppercase tracking-tight mb-1">Missing Evidence</label>
                  <p className="text-sm text-amber-700 leading-relaxed">{analysis.evidenceGaps}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
             <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-blue-500/20 rounded-lg">
                 <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                 </svg>
               </div>
               <h3 className="font-bold">Next Steps</h3>
             </div>
             <ol className="space-y-4 text-sm text-slate-400 list-decimal list-inside">
               <li>Copy the appeal letter below.</li>
               <li>Review for clinical accuracy.</li>
               <li>Paste into your EHR or payer portal.</li>
               <li>Upload supporting chart notes.</li>
             </ol>
          </div>
        </div>

        {/* Letter Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Drafted Appeal Letter</span>
              <button
                onClick={() => {
                  const blob = new Blob([appeal], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `appeal-letter-${Date.now()}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                Download .txt
              </button>
            </div>
            <div className="p-8 whitespace-pre-wrap text-sm leading-relaxed text-slate-800 font-serif max-h-[70vh] overflow-y-auto">
              {appeal}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
