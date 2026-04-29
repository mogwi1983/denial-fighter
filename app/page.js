'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'text'
  const [denialText, setDenialText] = useState('');
  const [chartNotes, setChartNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [payerName, setPayerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeTab === 'text' && (!denialText.trim() || !chartNotes.trim())) {
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
          denialText: denialText.trim() || "Uploaded Document Analysis...",
          chartNotes: chartNotes.trim() || "Uploaded Chart Analysis...",
          patientDiagnosis: diagnosis.trim(),
          payerName: payerName.trim(),
        }),
      });

      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Generation failed');
      }

      sessionStorage.setItem('lastAppeal', JSON.stringify(data));
      router.push('/tool/results');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      alert(`File "${e.dataTransfer.files[0].name}" received! (Mockup only)`);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar - simplified for root */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Denial Fighter</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-700">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Appeal
          </button>
          <button onClick={() => router.push('/tool/history')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            History
          </button>
        </nav>

        <div className="p-4 mt-auto border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Clinic Tier</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                JD
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-slate-900 truncate">Dr. Jane Doe</p>
                <p className="text-xs text-slate-500 truncate">St. Mary's Hospital</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">New Appeal</h2>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-teal-500/10 flex items-center justify-center">
              <span className="text-teal-600 text-xs font-bold">⚡</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">New Appeal Request</h1>
              <p className="text-slate-500 mt-2">Generate a high-authority appeal letter by providing the denial details and clinical context.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="flex border-b border-slate-100">
                    <button
                      onClick={() => setActiveTab('upload')}
                      className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                        activeTab === 'upload' ? 'text-blue-600 bg-white border-b-2 border-blue-600' : 'text-slate-400 bg-slate-50/50 hover:text-slate-600'
                      }`}
                    >
                      Upload Document
                    </button>
                    <button
                      onClick={() => setActiveTab('text')}
                      className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                        activeTab === 'text' ? 'text-blue-600 bg-white border-b-2 border-blue-600' : 'text-slate-400 bg-slate-50/50 hover:text-slate-600'
                      }`}
                    >
                      Paste Text
                    </button>
                  </div>

                  <div className="p-6">
                    {activeTab === 'upload' ? (
                      <div 
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-xl p-12 transition-all flex flex-col items-center justify-center text-center ${
                          dragActive ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300 bg-slate-50/30'
                        }`}
                      >
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Drop denial letter here</h3>
                        <p className="text-sm text-slate-500 mt-1 mb-6 max-w-xs">
                          Support for PDF, JPG, PNG, or screenshots. We'll automatically extract the text.
                        </p>
                        <label className="cursor-pointer bg-white border border-slate-200 shadow-sm px-6 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                          Browse Files
                          <input type="file" className="hidden" />
                        </label>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <textarea
                          value={denialText}
                          onChange={(e) => setDenialText(e.target.value)}
                          placeholder="Paste the denial letter or notice text here..."
                          className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                        />
                        <textarea
                          value={chartNotes}
                          onChange={(e) => setChartNotes(e.target.value)}
                          placeholder="Paste relevant progress notes, H&P, or diagnostic results..."
                          className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="font-bold text-slate-900 mb-4">Clinical Context</h3>
                  <div className="space-y-4">
                    <input
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="Primary Diagnosis"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                      value={payerName}
                      onChange={(e) => setPayerName(e.target.value)}
                      placeholder="Payer / Plan"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 p-6 text-white">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                      loading ? 'bg-blue-700/50' : 'bg-white text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {loading ? 'Analyzing...' : 'Generate Appeal'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
