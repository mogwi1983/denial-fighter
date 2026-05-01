# Denial Fighter

AI-assisted Medicare Advantage appeal letters for small clinics and clinicians.

Denial Fighter is being built as a pilot-ready MVP and as a full-stack learning sprint. The app should become a practical workflow, not just a prompt box: enter fake or de-identified denial and chart text, scrub likely PHI, review what will be sent, generate a structured appeal, then edit, copy, export, save, and revisit the result.

## Current Status

- Canonical app workflow: `/tool`, `/tool/results`, `/tool/history`.
- Legacy or parallel routes still exist at `/`, `/results`, and `/history`; reconcile carefully.
- PHI scrubber is a planned core feature. Until it exists, use only fake or already de-identified data.
- Progress is tracked in the external productivity tracker described in `AGENTS.md` and `MAY_BUILD_PLAN.md`.

## Tech Stack

- Next.js 14 App Router
- React
- Tailwind CSS
- Supabase
- DeepSeek/OpenAI-compatible API client
- npm

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

The dev server runs on:

```txt
http://localhost:3005
```

Build for production:

```bash
npm run build
```

## Environment Variables

```txt
DEEPSEEK_API_KEY=sk-your-deepseek-api-key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional production demo flags
SAVE_GENERATED_APPEALS=false
ALLOW_PUBLIC_APPEAL_HISTORY=false

# Optional: pilot waitlist inbox for /landing mailto (public build-time value)
# NEXT_PUBLIC_WAITLIST_EMAIL=pilot-inbox@example.com

# Appeal history: production requires sign-in unless ALLOW_PUBLIC_APPEAL_HISTORY=true.
# Dev allows anonymous history unless APPEALS_REQUIRE_LOGIN=true.
# APPEALS_REQUIRE_LOGIN=false
```

Never hardcode secrets or print `.env.local` values into logs or chat.

## Project Map

```txt
denial-fighter/
├── app/                         Next.js App Router pages and API routes
│   ├── api/
│   │   ├── generate/route.js     Appeal generation endpoint
│   │   └── appeals/route.js      Appeal persistence endpoint
│   ├── tool/                     Canonical app workflow
│   ├── history/                  Legacy history route
│   └── results/                  Legacy results route
├── docs/
│   ├── agents/                   AI-agent operating docs and handoff templates
│   ├── adr/                      Architecture decision records
│   ├── checklists/               Agent and QA checklists
│   └── runbooks/                 Repeatable operating procedures
├── lib/                          Shared app logic
├── scripts/                      Repeatable deterministic helper scripts
├── tests/fixtures/               Fake or de-identified test fixtures
├── AGENTS.md                     Canonical instructions for AI agents
├── CLAUDE.md                     Claude Code pointer to AGENTS.md
├── GEMINI.md                     Gemini CLI pointer to AGENTS.md
└── MAY_BUILD_PLAN.md             May roadmap and sprint plan
```

## AI Agent Workflow

This repo is intentionally optimized for work by multiple AI agents with human oversight.

Start here:

1. `AGENTS.md`
2. `docs/agents/context-pack.md`
3. `docs/architecture-data-flow.md`
4. `docs/checklists/agent-change-checklist.md`

Then read the nearest folder README before editing a major area, such as `app/README.md`, `app/api/README.md`, `app/tool/README.md`, or `lib/README.md`.

Before meaningful work, update or prepare the Supabase progress tracker step. Before handoff, run the most relevant verification command and summarize changed files, tracker state, and next action.

## PHI And Safety

Treat denial notices and chart notes as potentially containing PHI.

- Use fake or de-identified data during development.
- Do not store raw PHI by default.
- Do not send raw PHI to an LLM by default.
- The first de-identifier should be deterministic code using scripts/regex, not AI.
- Scripted de-identification reduces risk but does not guarantee HIPAA de-identification.
- Do not claim the product is HIPAA-ready until BAAs, access controls, audit logs, retention policies, and provider requirements are in place.

## Useful Docs

- `MAY_BUILD_PLAN.md` - sprint plan, product direction, learning goals.
- `docs/architecture-data-flow.md` - current route map and data flow.
- `docs/fake-appeal-cases.md` - fake cases for development.
- `docs/runbooks/local-development.md` - setup and smoke testing.
- `docs/runbooks/progress-tracker.md` - tracker update procedure.
- `docs/adr/0001-agent-managed-project-structure.md` - why the agent structure exists.

## License

MIT
