'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/lib/apiFetch';

export default function History() {
  const router = useRouter();
  const [appeals, setAppeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    fetchWithAuth('/api/appeals')
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (r.status === 401) {
          setLoadError(
            data.error || 'Sign in to view saved appeals, or enable demo history access for this deployment.'
          );
          setAppeals([]);
          return;
        }
        if (!r.ok || data.success === false) {
          setLoadError(data.error || `Could not load history (${r.status}).`);
          setAppeals([]);
          return;
        }
        setLoadError('');
        setAppeals(Array.isArray(data.appeals) ? data.appeals : []);
      })
      .catch(() => {
        setLoadError('Could not load appeal history. Check your connection and try again.');
        setAppeals([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'won': return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'denied': return 'bg-red-100 text-red-700 border-red-200';
      case 'appeal_generated': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Appeal History</h1>
          <p className="text-slate-500 mt-1">Review and track your previous appeal requests and their outcomes.</p>
        </div>
        <Link
          href="/tool"
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          New Appeal
        </Link>
      </div>

      {loadError && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-900">
          <p>{loadError}</p>
          <Link href="/tool/login" className="mt-2 inline-block font-semibold text-blue-800 underline hover:text-blue-950">
            Go to sign in
          </Link>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
             <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
             </svg>
             <span>Loading records...</span>
          </div>
        ) : appeals.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">No appeals found</h3>
            <p className="text-slate-500 mt-1 mb-8">You haven&apos;t generated any appeal letters yet.</p>
            <Link href="/tool" className="text-blue-600 font-semibold hover:underline">
              Generate your first appeal →
            </Link>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Payer / Diagnosis</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Date</th>
                <th className="w-24 px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-slate-400">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appeals.map((appeal) => (
                <tr
                  key={appeal.id}
                  role="link"
                  tabIndex={0}
                  onClick={() => router.push(`/tool/history/${appeal.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      router.push(`/tool/history/${appeal.id}`);
                    }
                  }}
                  className="cursor-pointer transition-colors hover:bg-slate-50/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 group"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{appeal.payer_name || 'N/A'}</div>
                    <div className="text-sm text-slate-500 mt-0.5">{appeal.patient_diagnosis || 'No diagnosis provided'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(appeal.status)}`}>
                      {appeal.status === 'appeal_generated' ? 'DRAFT' : appeal.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-medium text-slate-900">{new Date(appeal.created_at).toLocaleDateString()}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{new Date(appeal.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-semibold text-blue-600 group-hover:text-blue-800">Open →</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
