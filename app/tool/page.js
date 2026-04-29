'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [denialText, setDenialText] = useState('');
  const [chartNotes, setChartNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [payerName, setPayerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!denialText.trim() || !chartNotes.trim()) {
      setError('Both denial text and chart notes are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          denialText: denialText.trim(),
          chartNotes: chartNotes.trim(),
          patientDiagnosis: diagnosis.trim(),
          payerName: payerName.trim(),
        }),
      });

      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Generation failed');
      }

      // Store result in session and redirect
      sessionStorage.setItem('lastAppeal', JSON.stringify(data));
      router.push('/tool/results');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const pasteFromClipboard = async (setter) => {
    try {
      const text = await navigator.clipboard.readText();
      setter(text);
    } catch {
      setError('Could not read clipboard. Paste manually.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">⚡ Denial Fighter</h1>
          <p className="text-gray-600 mt-1">Paste a denial notice + chart notes → get your appeal in 3 minutes</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Denial Notice */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                📄 Denial Notice
              </label>
              <button
                type="button"
                onClick={() => pasteFromClipboard(setDenialText)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                📋 Paste from clipboard
              </button>
            </div>
            <textarea
              value={denialText}
              onChange={(e) => setDenialText(e.target.value)}
              placeholder="Paste the denial letter, notice, or explanation of benefits here..."
              className="w-full h-40 p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">Or upload a screenshot/PDF (coming soon)</p>
          </div>

          {/* Patient Info (compact) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                🏥 Diagnosis
              </label>
              <input
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Lumbar radiculopathy"
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                🏢 Payer (optional)
              </label>
              <input
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                placeholder="e.g. UHC, Humana, Aetna"
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Chart Notes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                📋 Clinical Notes / Chart
              </label>
              <button
                type="button"
                onClick={() => pasteFromClipboard(setChartNotes)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                📋 Paste from clipboard
              </button>
            </div>
            <textarea
              value={chartNotes}
              onChange={(e) => setChartNotes(e.target.value)}
              placeholder="Paste the progress note, H&P, or relevant chart snippets that support medical necessity..."
              className="w-full h-48 p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">Include: history, exam findings, diagnostics, treatment plan, relevant ICD-10 codes</p>
          </div>

          {/* Submit */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analyzing & Drafting Appeal...
              </span>
            ) : (
              '🚀 Generate Appeal Letter'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>Built for PAs and NPs fighting Medicare Advantage denials</p>
          <p className="mt-1">Your data stays private. Appeals are stored locally for reference only.</p>
        </div>
      </div>
    </div>
  );
}
