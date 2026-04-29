'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function History() {
  const [appeals, setAppeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/appeals')
      .then(r => r.json())
      .then(data => {
        if (data.success) setAppeals(data.appeals);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <Link href="/" className="text-sm text-blue-600 hover:text-blue-800 mb-2 block">
          ← New Appeal
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">📋 Appeal History</h1>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : appeals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No appeals yet</p>
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              Generate your first appeal →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {appeals.map((appeal) => (
              <div key={appeal.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{appeal.payer_name || 'Unknown payer'}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {appeal.denial_reason?.slice(0, 100) || 'No reason extracted'}
                    </p>
                  </div>
                  <div className="text-right text-xs text-gray-400">
                    <p>{new Date(appeal.created_at).toLocaleDateString()}</p>
                    <p className={`mt-1 px-2 py-0.5 rounded-full inline-block ${
                      appeal.status === 'won' ? 'bg-green-100 text-green-700' :
                      appeal.status === 'appeal_generated' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {appeal.status === 'appeal_generated' ? 'Draft' : appeal.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
