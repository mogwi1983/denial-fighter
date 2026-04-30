'use client';

import { useRouter } from 'next/navigation';

const kids = [
  {
    id: 'kid1',
    name: 'Kid 1',
    grade: 'Grade TBD',
    emoji: '🌟',
    color: 'from-blue-400 to-cyan-400',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    accent: 'text-blue-600',
    button: 'bg-blue-600 hover:bg-blue-700',
    subjects: ['Math', 'Reading', 'Science', 'Writing'],
  },
  {
    id: 'kid2',
    name: 'Kid 2',
    grade: 'Grade TBD',
    emoji: '🚀',
    color: 'from-purple-400 to-pink-400',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    accent: 'text-purple-600',
    button: 'bg-purple-600 hover:bg-purple-700',
    subjects: ['Math', 'Reading', 'Science', 'Writing'],
  },
  {
    id: 'kid3',
    name: 'Kid 3',
    grade: 'Grade TBD',
    emoji: '🎨',
    color: 'from-orange-400 to-yellow-400',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    accent: 'text-orange-600',
    button: 'bg-orange-500 hover:bg-orange-600',
    subjects: ['Math', 'Reading', 'Science', 'Writing'],
  },
];

export default function SummerSchoolHome() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-amber-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/landing')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">☀️</span>
            <span className="text-lg font-bold text-slate-900">Summer School</span>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <span>☀️</span> Summer 2025 Curriculum
          </div>
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Learning is an{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-500">
              Adventure
            </span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Pick a learner to explore their personalized summer curriculum — games, lessons, and progress all in one place.
          </p>
        </div>

        {/* Kid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {kids.map((kid) => (
            <button
              key={kid.id}
              onClick={() => router.push(`/summerschool/${kid.id}`)}
              className={`group relative rounded-3xl border-2 ${kid.border} bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden text-left hover:-translate-y-1`}
            >
              {/* Gradient bar */}
              <div className={`h-2 w-full bg-gradient-to-r ${kid.color}`} />

              <div className="p-8">
                {/* Avatar */}
                <div className={`w-20 h-20 rounded-2xl ${kid.bg} flex items-center justify-center text-4xl mb-5 group-hover:scale-110 transition-transform duration-200`}>
                  {kid.emoji}
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-1">{kid.name}</h2>
                <p className={`text-sm font-semibold ${kid.accent} mb-5`}>{kid.grade}</p>

                {/* Subject chips */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {kid.subjects.map((subj) => (
                    <span
                      key={subj}
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${kid.bg} ${kid.accent} border ${kid.border}`}
                    >
                      {subj}
                    </span>
                  ))}
                </div>

                <div className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white ${kid.button} transition-colors`}>
                  Open Curriculum
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom info strip */}
        <div className="mt-16 bg-white border border-slate-200 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="text-5xl">📚</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Curriculum coming soon</h3>
            <p className="text-sm text-slate-500">
              We&apos;re building out each child&apos;s personalized lesson plan. Check back soon to see assignments, progress tracking, and resources.
            </p>
          </div>
          <div className="flex-shrink-0">
            <span className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-teal-200">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              In Progress
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
