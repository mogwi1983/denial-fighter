'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Results() {
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('lastAppeal');
    if (stored) {
      setData(JSON.parse(stored));
    } else {
      router.push('/');
    }
  }, [router]);

  if (!data) return null;

  const { appeal, analysis, id, processingTime } = data;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(appeal);
      alert('✅ Appeal letter copied to clipboard!');
    } catch {
      alert('Could not copy. Select and copy manually.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-800 mb-2 block">
            ← New Appeal
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">✅ Appeal Generated</h1>
          <p className="text-sm text-gray-500">
            Generated in {processingTime || '< 10'} seconds{id && ' · Saved to history'}
          </p>
        </div>

        {/* Analysis Summary */}
        {analysis && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-3">📊 Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {analysis.payer && (
                <div>
                  <span className="text-gray-500">Payer:</span>
                  <span className="ml-2 font-medium">{analysis.payer}</span>
                </div>
              )}
              {analysis.denialReason && (
                <div className="md:col-span-2">
                  <span className="text-gray-500">Denial Reason:</span>
                  <span className="ml-2 font-medium">{analysis.denialReason}</span>
                </div>
              )}
              {analysis.evidenceNeeded && (
                <div>
                  <span className="text-gray-500">Evidence needed:</span>
                  <p className="mt-1 text-gray-700">{analysis.evidenceNeeded}</p>
                </div>
              )}
              {analysis.evidenceGaps && (
                <div>
                  <span className="text-red-600 font-medium">⚠ Evidence gaps:</span>
                  <p className="mt-1 text-gray-700">{analysis.evidenceGaps}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Appeal Letter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-900">📝 Appeal Letter</h2>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
              >
                📋 Copy
              </button>
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
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition"
              >
                ⬇ Download
              </button>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 whitespace-pre-wrap text-sm leading-relaxed font-mono">
            {appeal}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/"
            className="text-center py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition"
          >
            ← New Appeal
          </Link>
          <Link
            href="/history"
            className="text-center py-3 bg-blue-100 text-blue-700 rounded-xl font-medium hover:bg-blue-200 transition"
          >
            📋 View History
          </Link>
        </div>
      </div>
    </div>
  );
}
