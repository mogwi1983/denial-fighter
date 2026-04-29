'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewAppeal() {
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
      // For the mockup, we'll simulate a processing delay if it's "upload"
      // In a real app, this would hit /api/generate
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
      // Mock file handling
      alert(`File "${e.dataTransfer.files[0].name}" received! (Mockup only)`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">New Appeal Request</h1>
        <p className="text-slate-500 mt-2">Generate a high-authority appeal letter by providing the denial details and clinical context.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Input Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Tabs */}
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
                  <p className="text-xs text-slate-400 mt-4 italic">
                    Tip: You can also paste a screenshot directly from your clipboard (Ctrl+V)
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Denial Notice Text</label>
                    <textarea
                      value={denialText}
                      onChange={(e) => setDenialText(e.target.value)}
                      placeholder="Paste the denial letter or notice text here..."
                      className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Chart Notes / Clinical Evidence</label>
                    <textarea
                      value={chartNotes}
                      onChange={(e) => setChartNotes(e.target.value)}
                      placeholder="Paste relevant progress notes, H&P, or diagnostic results..."
                      className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
             <div className="flex items-center gap-2 mb-4">
               <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               <h3 className="font-bold text-slate-900">Why this matters</h3>
             </div>
             <p className="text-sm text-slate-600 leading-relaxed">
               Providing specific chart notes allows our AI to match clinical evidence directly against the payer's denial criteria. This significantly increases the chances of a successful redetermination.
             </p>
          </div>
        </div>

        {/* Sidebar / Context Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-4">Clinical Context</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Primary Diagnosis</label>
                <input
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Lumbar Stenosis"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Payer / Plan</label>
                <input
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  placeholder="e.g. UnitedHealthcare"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 p-6 text-white">
            <h3 className="font-bold text-lg mb-2">Ready to fight?</h3>
            <p className="text-blue-100 text-sm mb-6">Our AI will analyze the denial and draft a professional appeal citing CMS guidelines.</p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-xs font-medium">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                loading
                  ? 'bg-blue-700/50 cursor-not-allowed'
                  : 'bg-white text-blue-600 hover:bg-blue-50 active:scale-95'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing...
                </>
              ) : (
                'Generate Appeal'
              )}
            </button>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Security & Compliance</h4>
            <div className="flex items-center gap-3 text-xs text-slate-500 leading-tight">
              <svg className="w-5 h-5 text-teal-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>HIPAA Compliant. Data is encrypted and never used for training.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
