<br/>
<p align="center">
  <img src="app/favicon.ico" alt="Denial Fighter" width="60" height="60">
</p>

<h1 align="center">Denial Fighter ⚡</h1>

<p align="center">
  <strong>AI-powered Medicare Advantage appeal letters in 3 minutes</strong>
</p>

<p align="center">
  Paste a denial notice + chart notes → get a complete appeal letter.<br/>
  Built for PAs, NPs, and small clinic providers fighting vague MA denials.
</p>

<p align="center">
  <a href="https://denial.jamesrodriguez.dev">🚀 Live Demo</a>
</p>

## Why

Medicare Advantage plans give vague "NO" denials with no specific appeal path — unlike traditional Medicare or commercial insurance. Existing denial management tools cost $50k+/yr and target enterprise health systems. Small clinics (1-10 providers) are left doing appeals manually.

**Denial Fighter bridges that gap.**

## How It Works

1. **Paste** the denial notice + chart notes
2. **AI analyzes** — identifies payer, denial reason, evidence gaps
3. **Generate** — complete appeal letter with evidence mapping + ICD-10 codes

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS
- **Backend:** Next.js API Routes
- **AI:** DeepSeek API (model: deepseek-chat)
- **Database:** Supabase (PostgreSQL)
- **Deployment:** PM2 + Nginx on Ubuntu

## Getting Started

```bash
# Install dependencies
npm install

# Set up env vars
cp .env.example .env.local
# Edit .env.local with your keys

# Run dev server
npm run dev

# Build for production
npm run build
```

## Environment Variables

```
DEEPSEEK_API_KEY=sk-your-key-here
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-service-role-key
```

## Project Structure

```
denial-fighter/
├── app/
│   ├── api/
│   │   ├── generate/route.js      # AI appeal generation
│   │   └── appeals/route.js        # CRUD for stored appeals
│   ├── results/page.js             # Appeal results view
│   ├── history/page.js             # Past appeals list
│   ├── layout.js                   # Root layout
│   ├── globals.css                 # Tailwind styles
│   └── page.js                     # Input form (main tool)
├── lib/
│   ├── ai.js                       # DeepSeek API client
│   └── supabase.js                 # Supabase client
├── components/                     # Shared components
├── ecosystem.config.js             # PM2 config
├── next.config.js                  # Next.js config
├── tailwind.config.js              # Tailwind config
└── package.json
```

## Pricing

| Plan | Price | Appeals |
|------|-------|---------|
| Free | $0 | 5/month |
| Solo | $29/mo | 50/month |
| Clinic | $79/mo | Unlimited |

## Roadmap

- [x] Core: paste denial → get appeal letter
- [x] History: view past appeals
- [x] Payer pattern tracking
- [ ] Marketing landing page
- [ ] Stripe payment integration
- [ ] User auth (multi-user)
- [ ] EHR integration (Phase 2)
- [ ] Prior authorization support

## License

MIT
