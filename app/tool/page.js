'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { sampleAppealCases } from '@/lib/sampleAppealCases';

const maxInputCharacters = 20000;

export default function NewAppeal() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('text');
  const [denialText, setDenialText] = useState('');
  const [chartNotes, setChartNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [payerName, setPayerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);

  const inputCharacterCount = useMemo(
    () => denialText.length + chartNotes.length,
    [denialText, chartNotes]
  );

  const loadSampleCase = (sampleCase) => {
    setActiveTab('text');
    setDenialText(sampleCase.denialText);
    setChartNotes(sampleCase.chartNotes);
    setDiagnosis(sampleCase.patientDiagnosis);
    setPayerName(sampleCase.payerName);
    setError('');
    setFieldErrors({});
  };

  const validateForm = () => {
    const nextErrors = {};

    if (activeTab !== 'text') {
      nextErrors.upload = 'Document upload is not wired up yet. Use Paste Text for this MVP pass.';
    }

    if (!denialText.trim()) {
      nextErrors.denialText = 'Paste the denial notice text.';
    }

    if (!chartNotes.trim()) {
      nextErrors.chartNotes = 'Paste the chart notes or clinical evidence.';
    }

    if (inputCharacterCount > maxInputCharacters) {
      nextErrors.inputLength = `Keep denial text and chart notes under ${maxInputCharacters.toLocaleString()} characters for this MVP endpoint.`;
    }

    setFieldErrors(nextErrors);
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm();
    if (Object.keys(nextErrors).length > 0) {
      setError(Object.values(nextErrors)[0]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          denialText: denialText.trim(),
          chartNotes: chartNotes.trim(),
          patientDiagnosis: diagnosis.trim(),
          payerName: payerName.trim(),
        }),
      });

      const data = await response.json().catch(() => ({
        success: false,
        error: 'The generator returned an unreadable response.',
      }));

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Generation failed. Please try again.');
      }

      sessionStorage.setItem('lastAppeal', JSON.stringify(data));
      router.push('/tool/results');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.type === 'dragenter' || event.type === 'dragover') {
      setDragActive(true);
    } else if (event.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    setFieldErrors({ upload: 'Document upload is not wired up yet. Use Paste Text for this MVP pass.' });
    setError('Document upload is not wired up yet. Use Paste Text for this MVP pass.');
  };

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Generator cleanup sprint</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">New Appeal Request</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Use fake or de-identified denial text and chart notes. The PHI scrubber is not active yet.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex border-b border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('text');
                  setError('');
                  setFieldErrors({});
                }}
                className={`flex-1 px-4 py-4 text-sm font-semibold transition-colors ${
                  activeTab === 'text'
                    ? 'border-b-2 border-blue-600 bg-white text-blue-700'
                    : 'bg-slate-50 text-slate-500 hover:text-slate-700'
                }`}
              >
                Paste Text
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('upload');
                  setError('Document upload is not wired up yet. Use Paste Text for this MVP pass.');
                  setFieldErrors({ upload: 'Document upload is not wired up yet. Use Paste Text for this MVP pass.' });
                }}
                className={`flex-1 px-4 py-4 text-sm font-semibold transition-colors ${
                  activeTab === 'upload'
                    ? 'border-b-2 border-blue-600 bg-white text-blue-700'
                    : 'bg-slate-50 text-slate-500 hover:text-slate-700'
                }`}
              >
                Upload Document
              </button>
            </div>

            <div className="p-5 sm:p-6">
              {activeTab === 'upload' ? (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`flex min-h-72 flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-all ${
                    dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16V4m0 0L8 8m4-4 4 4M4 20h16" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-950">Upload is parked for Sprint 0</h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                    File extraction needs a real parser and PHI review step. Paste fake or de-identified text for now.
                  </p>
                  {fieldErrors.upload && (
                    <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
                      {fieldErrors.upload}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="mr-1 text-xs font-bold uppercase tracking-widest text-blue-700">Load sample</span>
                      {sampleAppealCases.map((sampleCase) => (
                        <button
                          key={sampleCase.id}
                          type="button"
                          onClick={() => loadSampleCase(sampleCase)}
                          className="rounded-md border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-800 shadow-sm transition hover:bg-blue-100"
                        >
                          {sampleCase.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label htmlFor="denialText" className="text-xs font-bold uppercase tracking-widest text-slate-500">
                        Denial Notice Text
                      </label>
                      <span className="text-xs text-slate-400">{denialText.length.toLocaleString()} chars</span>
                    </div>
                    <textarea
                      id="denialText"
                      value={denialText}
                      onChange={(event) => {
                        setDenialText(event.target.value);
                        setFieldErrors((current) => ({ ...current, denialText: undefined, inputLength: undefined }));
                      }}
                      placeholder="Paste the denial letter or notice text here..."
                      className={`h-44 w-full resize-y rounded-lg border bg-slate-50 p-4 text-sm leading-6 outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                        fieldErrors.denialText ? 'border-red-300' : 'border-slate-200'
                      }`}
                    />
                    {fieldErrors.denialText && <p className="mt-2 text-sm font-medium text-red-600">{fieldErrors.denialText}</p>}
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label htmlFor="chartNotes" className="text-xs font-bold uppercase tracking-widest text-slate-500">
                        Chart Notes / Clinical Evidence
                      </label>
                      <span className="text-xs text-slate-400">{chartNotes.length.toLocaleString()} chars</span>
                    </div>
                    <textarea
                      id="chartNotes"
                      value={chartNotes}
                      onChange={(event) => {
                        setChartNotes(event.target.value);
                        setFieldErrors((current) => ({ ...current, chartNotes: undefined, inputLength: undefined }));
                      }}
                      placeholder="Paste relevant progress notes, H&P, therapy notes, medication history, or diagnostic results..."
                      className={`h-56 w-full resize-y rounded-lg border bg-slate-50 p-4 text-sm leading-6 outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                        fieldErrors.chartNotes ? 'border-red-300' : 'border-slate-200'
                      }`}
                    />
                    {fieldErrors.chartNotes && <p className="mt-2 text-sm font-medium text-red-600">{fieldErrors.chartNotes}</p>}
                  </div>

                  <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-600">
                      Combined input: <span className="font-semibold text-slate-900">{inputCharacterCount.toLocaleString()}</span> / {maxInputCharacters.toLocaleString()} characters
                    </p>
                    {fieldErrors.inputLength && <p className="text-sm font-medium text-red-600">{fieldErrors.inputLength}</p>}
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l5 5v11a2 2 0 0 1-2 2Z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-950">Generator contract</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  The API now expects denial text and chart notes, then returns payer, denial reason, evidence needed, evidence covered, evidence gaps, and the draft appeal in one predictable JSON shape.
                </p>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="font-bold text-slate-950">Clinical Context</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="diagnosis" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-500">
                  Primary Diagnosis
                </label>
                <input
                  id="diagnosis"
                  value={diagnosis}
                  onChange={(event) => setDiagnosis(event.target.value)}
                  placeholder="e.g. Lumbar radiculopathy"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="payerName" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-500">
                  Payer / Plan
                </label>
                <input
                  id="payerName"
                  value={payerName}
                  onChange={(event) => setPayerName(event.target.value)}
                  placeholder="e.g. ExampleCare MA"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>

          <section className="rounded-lg bg-blue-700 p-5 text-white shadow-sm sm:p-6">
            <h3 className="text-lg font-bold">Ready to generate?</h3>
            <p className="mt-2 text-sm leading-6 text-blue-100">
              The draft still needs clinical review before use.
            </p>

            {error && (
              <div className="mt-4 rounded-md border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`mt-5 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-base font-bold transition ${
                loading ? 'cursor-not-allowed bg-blue-800 text-blue-100' : 'bg-white text-blue-700 hover:bg-blue-50'
              }`}
            >
              {loading ? (
                <>
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate Appeal'
              )}
            </button>
          </section>

          <section className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-800">Beta privacy note</h4>
            <p className="mt-2 text-sm leading-6 text-amber-900">
              Use fake or de-identified text only. Scripted PHI detection will reduce risk later, but it will not guarantee HIPAA de-identification.
            </p>
          </section>
        </aside>
      </form>
    </div>
  );
}
