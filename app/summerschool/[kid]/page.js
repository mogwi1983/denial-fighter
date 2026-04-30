'use client';

import { useRouter, useParams } from 'next/navigation';

const kidConfig = {
  kid1: {
    name: 'Kid 1',
    grade: 'Grade TBD',
    emoji: '🌟',
    color: 'from-blue-400 to-cyan-400',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    accent: 'text-blue-600',
    ring: 'ring-blue-300',
    headerBg: 'bg-blue-600',
  },
  kid2: {
    name: 'Kid 2',
    grade: 'Grade TBD',
    emoji: '🚀',
    color: 'from-purple-400 to-pink-400',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    accent: 'text-purple-600',
    ring: 'ring-purple-300',
    headerBg: 'bg-purple-600',
  },
  kid3: {
    name: 'Kid 3',
    grade: 'Grade TBD',
    emoji: '🎨',
    color: 'from-orange-400 to-yellow-400',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    accent: 'text-orange-600',
    ring: 'ring-orange-300',
    headerBg: 'bg-orange-500',
  },
};

const subjects = [
  { id: 'math', label: 'Math', icon: '➕', description: 'Numbers, operations, problem solving' },
  { id: 'reading', label: 'Reading', icon: '📖', description: 'Comprehension, vocabulary, fluency' },
  { id: 'writing', label: 'Writing', icon: '✏️', description: 'Grammar, composition, creative writing' },
  { id: 'science', label: 'Science', icon: '🔬', description: 'Experiments, concepts, curiosity' },
  { id: 'history', label: 'History', icon: '🌍', description: 'Stories, timelines, world events' },
  { id: 'art', label: 'Art & Music', icon: '🎵', description: 'Creativity, expression, appreciation' },
];

const weeklyStats = [
  { label: 'Lessons', value: '—', icon: '📝' },
  { label: 'Completed', value: '—', icon: '✅' },
  { label: 'Streak', value: '—', icon: '🔥' },
  { label: 'Stars', value: '—', icon: '⭐' },
];

export default function KidCurriculum() {
  const router = useRouter();
  const params = useParams();
  const kid = kidConfig[params.kid] || kidConfig.kid1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-amber-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/summerschool')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            All Kids
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl">{kid.emoji}</span>
            <span className="text-base font-bold text-slate-900">{kid.name}&apos;s Curriculum</span>
          </div>
          <div className="w-24" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Profile Hero */}
        <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-r ${kid.color} p-8 mb-10 text-white shadow-lg`}>
          <div className="flex items-center gap-6">
            <div className={`w-24 h-24 rounded-2xl bg-white/20 flex items-center justify-center text-5xl ring-4 ${kid.ring} ring-white/30`}>
              {kid.emoji}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold">{kid.name}</h1>
              <p className="text-white/80 text-sm font-medium mt-1">{kid.grade} · Summer 2025</p>
            </div>
          </div>
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-6 right-20 w-32 h-32 rounded-full bg-white/10" />
        </div>

        {/* Weekly Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {weeklyStats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Subject Grid */}
        <h2 className="text-xl font-bold text-slate-900 mb-5">Subjects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {subjects.map((subj) => (
            <div
              key={subj.id}
              className={`group relative bg-white rounded-2xl border-2 ${kid.border} shadow-sm hover:shadow-md transition-all duration-200 p-6 cursor-default`}
            >
              <div className={`w-12 h-12 rounded-xl ${kid.bg} flex items-center justify-center text-2xl mb-4`}>
                {subj.icon}
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{subj.label}</h3>
              <p className="text-xs text-slate-500 mb-4">{subj.description}</p>
              <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                Coming Soon
              </span>
            </div>
          ))}
        </div>

        {/* Placeholder weekly schedule */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">📅</span>
            <h2 className="text-xl font-bold text-slate-900">Weekly Schedule</h2>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
              <div key={day} className={`rounded-xl ${kid.bg} border ${kid.border} p-4 text-center`}>
                <p className={`text-xs font-bold ${kid.accent} mb-3`}>{day}</p>
                <div className="space-y-2">
                  {[1, 2, 3].map((slot) => (
                    <div key={slot} className="h-2 bg-slate-200 rounded-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-400 mt-4">Schedule will populate once curriculum is added</p>
        </div>
      </main>
    </div>
  );
}
