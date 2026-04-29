'use client';

import { useState } from 'react';

const faqs = [
  { q: 'How does Denial Fighter work?', a: 'You paste your Medicare Advantage denial notice and chart notes into the app. Our AI analyzes the denial reason against CMS guidelines and payer policies, identifies evidence gaps, then generates a tailored appeal letter with specific regulations and arguments most likely to overturn the denial.' },
  { q: 'Is my patient data secure?', a: 'Denial Fighter is in beta. Use fake or de-identified text for now; production PHI support depends on the PHI scrubber, user access controls, retention policies, and the right vendor agreements.' },
  { q: 'What types of denials do you support?', a: 'All Medicare Advantage denial types: lack of medical necessity, not a covered benefit, experimental/investigational, out-of-network, prior authorization issues, and coding/billing errors.' },
  { q: 'Can I customize the appeal letters?', a: 'Absolutely. Every generated letter is editable before you download or print. You can adjust tone, add letterhead, and insert specific clinical details.' },
  { q: 'Do you integrate with my EHR?', a: 'Not yet — coming soon for Clinic-tier. For now, paste denial text directly or upload a screenshot.' },
  { q: 'What if the appeal is denied again?', a: 'Denial Fighter tracks appeal levels (redetermination, reconsideration, ALJ hearing). Each tier needs different arguments, and we adjust strategy accordingly.' },
];

const plans = [
  {
    name: 'Free',
    price: '$0',
    interval: '/mo',
    appeals: '5 appeals / month',
    features: ['Appeal letter generation', 'Basic CMS guideline lookup', 'PDF download', 'Email support'],
    cta: 'Get Started',
    featured: false,
  },
  {
    name: 'Solo',
    price: '$29',
    interval: '/mo',
    appeals: '50 appeals / month',
    features: ['Everything in Free', 'Multi-level appeal support', 'Payer-specific arguments', 'Priority email support', 'Custom letterhead branding'],
    cta: 'Start Free Trial',
    featured: true,
  },
  {
    name: 'Clinic',
    price: '$79',
    interval: '/mo',
    appeals: 'Unlimited appeals',
    features: ['Everything in Solo', 'Team accounts', 'Bulk import (CSV)', 'Analytics dashboard', 'Dedicated support', 'API access'],
    cta: 'Contact Sales',
    featured: false,
  },
];

const benefits = [
  { title: 'Stop Vague Denials', description: 'Most MA denials say "not medically necessary" without specifics. Our AI pinpoints exactly which criteria to satisfy.', icon: '🎯' },
  { title: 'End Manual Drafting', description: 'Stop spending 45 minutes on each appeal. Generate a payer-grade letter in under a minute.', icon: '⚡' },
  { title: 'Clear Appeal Path', description: 'Know exactly which regulation or CMS guideline to cite. No more guessing.', icon: '🧭' },
  { title: 'Track Every Stage', description: 'From redetermination to ALJ hearing — different rules for each level. We adapt.', icon: '📊' },
  { title: 'Recover Revenue', description: 'Clinics leave 10–15% of Medicare revenue on the table from denials. Get it back.', icon: '💰' },
  { title: 'Stay Audit-Ready', description: 'Every letter stored with source denial and citations. Perfect for compliance.', icon: '🛡️' },
];

const steps = [
  { num: '1', title: 'Paste Denial Notice', desc: 'Copy the denial text and chart notes from your EHR or portal and paste them into the tool.' },
  { num: '2', title: 'AI Analyzes', desc: 'Our engine extracts the payer, denial reason, evidence needed, and what\'s missing from your documentation.' },
  { num: '3', title: 'Generate Appeal', desc: 'Get a complete, citable appeal letter with specific CMS guidelines and payer policies cited.' },
];

function LandingPage() {
  const [dark, setDark] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">

        {/* Sticky Header */}
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight">Denial Fighter</span>
              <span className="rounded-full bg-teal-500/10 px-2 py-0.5 text-xs font-medium text-teal-600 dark:text-teal-400">⚡</span>
            </div>
            <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400 md:flex">
              <a href="#features" className="hover:text-slate-900 dark:hover:text-white">Features</a>
              <a href="#pricing" className="hover:text-slate-900 dark:hover:text-white">Pricing</a>
              <a href="#faq" className="hover:text-slate-900 dark:hover:text-white">FAQ</a>
              <button
                onClick={() => setDark(!dark)}
                className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Toggle dark mode"
              >
                {dark ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDark(!dark)}
                className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
                aria-label="Toggle dark mode"
              >
                {dark ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
              </button>
              <a
                href="/"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Launch App
              </a>
            </div>
          </nav>
        </header>

        {/* Hero */}
        <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2">
            <div className="h-[400px] w-[800px] rounded-full bg-gradient-to-r from-blue-400/20 to-teal-400/20 blur-3xl dark:from-blue-500/10 dark:to-teal-500/10" />
          </div>
          <div className="relative mx-auto max-w-5xl text-center">
            <div className="mx-auto mb-4 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
              Now in beta — built by a PA for PAs and NPs
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Fight Medicare Advantage{' '}
              <span className="text-blue-600 dark:text-blue-400">Denials</span> with{' '}
              <span className="text-teal-600 dark:text-teal-400">AI</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              Medicare Advantage plans say NO without telling you why. Paste the denial + chart notes → get a citable appeal letter in 3 minutes.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 dark:bg-blue-500 dark:shadow-blue-500/25 dark:hover:bg-blue-600"
              >
                Try Denial Fighter Free
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-8 py-3.5 text-base font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                How it works
              </a>
            </div>
            <div className="mt-12 flex items-center justify-center gap-2 text-sm text-slate-400 dark:text-slate-500">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-7 w-7 rounded-full border-2 border-white bg-gradient-to-br from-blue-100 to-teal-100 dark:border-slate-950 dark:from-blue-900 dark:to-teal-900" />
                ))}
              </div>
              <span className="ml-2">Trusted by clinicians fighting denials</span>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="border-t border-slate-100 bg-slate-50 px-4 py-20 dark:border-slate-800 dark:bg-slate-900 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold">How it works</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">Three steps from denial to appeal letter.</p>
            </div>
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.num} className="relative rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">{step.num}</div>
                  <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features / Benefits */}
        <section id="features" className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold">Built for the denials that hurt most</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">80% of Medicare Advantage denials get overturned — if you have the right argument.</p>
            </div>
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map((b) => (
                <div key={b.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <span className="text-2xl">{b.icon}</span>
                  <h3 className="mt-3 font-semibold">{b.title}</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="border-t border-slate-100 bg-slate-50 px-4 py-20 dark:border-slate-800 dark:bg-slate-900 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold">Simple, transparent pricing</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">No enterprise contracts. No hidden fees. Cancel anytime.</p>
            </div>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {plans.map((plan) => (
                <div key={plan.name} className={`relative rounded-xl border p-6 shadow-sm transition-all ${plan.featured ? 'border-blue-300 bg-white shadow-lg dark:border-blue-600 dark:bg-slate-800' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'}`}>
                  {plan.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">Most Popular</div>
                  )}
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{plan.interval}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{plan.appeals}</p>
                  <ul className="mt-6 space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <svg className="h-4 w-4 shrink-0 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={plan.cta === 'Contact Sales' ? 'mailto:james@clinicalaisuccess.com' : '/'}
                    className={`mt-6 flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition-all ${plan.featured ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'}`}
                  >
                    {plan.cta}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-bold">Frequently asked questions</h2>
            <div className="mt-10 space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => toggleFaq(i)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium"
                    aria-expanded={openFaq === i}
                  >
                    <span>{faq.q}</span>
                    <svg className={`h-4 w-4 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                  </button>
                  {openFaq === i && (
                    <div className="border-t border-slate-200 px-5 py-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 px-4 py-8 dark:border-slate-800">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400 sm:flex-row">
            <span>&copy; {new Date().getFullYear()} Denial Fighter. Built by Clinical AI Success.</span>
            <div className="flex gap-6">
              <a href="mailto:james@clinicalaisuccess.com" className="hover:text-slate-700 dark:hover:text-slate-300">Contact</a>
              <a href="https://clinicalaisuccess.com" className="hover:text-slate-700 dark:hover:text-slate-300">Clinical AI Success</a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}

export default LandingPage;
