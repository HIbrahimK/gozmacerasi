# 📦 GÖZMACERASI CodeV3 — Proje Yapısı ve Kurulum Rehberi

## Tarih
**Oluşturma Tarihi:** 4 Mayıs 2026
**Versiyon:** 0.3.0
**Monorepo:** Turborepo
**Durumu:** 🟡 Installation in progress...

---

## 📁 Klasör Yapısı

```
gozmacerasi/
├── packages/
│   ├── web/                          # Next.js 14 Frontend (PWA)
│   │   ├── src/
│   │   │   ├── app/                  # App Router
│   │   │   ├── components/           # React Components
│   │   │   ├── pages/                # Special pages
│   │   │   ├── hooks/                # Custom hooks
│   │   │   ├── styles/               # Global styles
│   │   │   └── lib/                  # Utilities
│   │   ├── public/                   # Static assets
│   │   ├── next.config.js            # Next.js config
│   │   ├── tailwind.config.js        # Tailwind config
│   │   ├── postcss.config.js         # PostCSS config
│   │   └── package.json              # Dependencies
│   │
│   ├── backend/                      # NestJS API Server
│   │   ├── src/
│   │   │   ├── modules/              # Feature modules
│   │   │   │   ├── auth/
│   │   │   │   ├── games/
│   │   │   │   ├── adaptive-engine/
│   │   │   │   ├── scoring/
│   │   │   │   ├── quests/
│   │   │   │   ├── stories/
│   │   │   │   ├── input-tracking/
│   │   │   │   ├── analytics/
│   │   │   │   └── prescriptions/
│   │   │   ├── app.module.ts         # Root module
│   │   │   └── main.ts               # Entry point
│   │   ├── prisma/
│   │   │   └── schema.prisma         # Database schema
│   │   ├── nest-cli.json             # NestJS CLI config
│   │   └── package.json              # Dependencies
│   │
│   └── shared/
│       ├── game-engine/              # PixiJS SDK
│       │   ├── src/
│       │   │   ├── base/
│       │   │   │   ├── BaseGame.ts
│       │   │   │   ├── TargetingGame.ts
│       │   │   │   ├── PuzzleGame.ts
│       │   │   │   ├── MotionGame.ts
│       │   │   │   └── MemoryGame.ts
│       │   │   ├── adaptive/
│       │   │   ├── input/
│       │   │   └── index.ts
│       │   └── package.json
│       │
│       ├── api-client/               # Axios API Client
│       │   ├── src/
│       │   │   ├── client.ts
│       │   │   ├── endpoints/
│       │   │   └── types.ts
│       │   └── package.json
│       │
│       ├── ui-components/            # Radix UI + Tailwind
│       │   ├── src/
│       │   │   ├── components/
│       │   │   │   ├── Button.tsx
│       │   │   │   ├── Card.tsx
│       │   │   │   ├── Modal.tsx
│       │   │   │   ├── Dashboard.tsx
│       │   │   │   ├── ScoreDisplay.tsx
│       │   │   │   ├── StreakBadge.tsx
│       │   │   │   └── ...
│       │   │   └── index.ts
│       │   └── package.json
│       │
│       └── utils/                    # Helper utilities
│           ├── src/
│           │   ├── scoring.ts        # Focus/Vision Score calc
│           │   ├── dates.ts
│           │   ├── formatting.ts
│           │   └── index.ts
│           └── package.json
│
├── .github/
│   └── workflows/                    # GitHub Actions CI/CD
│       ├── deploy-staging.yml
│       ├── deploy-production.yml
│       └── test.yml
│
├── node_modules/                     # Monorepo deps (linked)
├── .gitignore                        # Git exclusions
├── tsconfig.json                     # Root TypeScript config
├── package.json                      # Root package.json
├── turbo.json                        # Turborepo config
├── codev3.md                         # Implementation plan (THIS FILE)
├── codev2.md                         # Previous plan (reference)
└── README.md                         # Project documentation

```

---

## 🚀 Tech Stack (CodeV3 MVP)

### Frontend (@gozmacerasi/web)
- **Next.js 14** — SSR, SSG, App Router
- **React 18** — UI library
- **Tailwind CSS** — Styling
- **Radix UI** — Component library (accessible)
- **Zustand** — State management
- **Framer Motion** — Animations
- **PixiJS** — 2D game rendering
- **Chart.js** — Dashboard charts
- **NextAuth.js** — Authentication
- **next-intl** — Multi-language (TR/EN)
- **next-themes** — Dark/light mode
- **next-pwa** — Offline support
- **PostHog** — Analytics

### Backend (@gozmacerasi/backend)
- **NestJS** — API framework
- **PostgreSQL** — Primary database
- **Redis** — Caching & sessions
- **Prisma** — ORM
- **JWT** — Token-based auth
- **OpenAI GPT-4 API** — AI assistant
- **LangChain** — AI guardrails
- **Socket.io** — Real-time (Phase 2)
- **PostHog** — Server-side analytics

### Shared Packages
- **game-engine** — PixiJS SDK (BaseGame, templates)
- **api-client** — Axios wrapper for API calls
- **ui-components** — Shared React components
- **utils** — Helper functions (scoring, dates, etc.)

---

## 📦 Installed Dependencies

### Root (Monorepo)
```
turbo@^2.1.0
```

### Frontend (@gozmacerasi/web)
```
react@^18.3.1
react-dom@^18.3.1
next@^14.2.0
next-auth@^4.24.0
next-intl@^3.10.0
next-themes@^0.2.1
next-pwa@^5.6.0
zustand@^4.4.0
framer-motion@^11.0.0
pixi.js@^8.0.0
chart.js@^4.4.0
react-chartjs-2@^5.2.0
radix-ui@^1.0.0
tailwindcss@^3.4.0
axios@^1.6.0
posthog-js@^1.145.0
```

### Backend (@gozmacerasi/backend)
```
@nestjs/common@^10.3.0
@nestjs/core@^10.3.0
@nestjs/jwt@^12.0.0
@nestjs/passport@^10.0.0
@nestjs/config@^3.1.0
@nestjs/websockets@^10.3.0
@prisma/client@^5.7.0
prisma@^5.7.0
passport@^0.7.0
passport-jwt@^4.0.1
bcryptjs@^2.4.3
redis@^4.6.0
openai@^4.24.0
langchain@^0.1.0
posthog-node@^0.4.0
```

---

## ✅ Kurulum Adımları (Tamamlandı)

### ✅ Faz 0: Proje Yapısı
- [x] Turborepo monorepo setup
- [x] Root package.json ve turbo.json
- [x] TypeScript config
- [x] .gitignore

### ✅ Faz 1: Klasör Mimarisi
- [x] packages/web/ (Next.js frontend)
- [x] packages/backend/ (NestJS API)
- [x] packages/shared/ (game-engine, api-client, ui-components, utils)
- [x] .github/workflows/ (CI/CD placeholder)

### ✅ Faz 2: Frontend Setup
- [x] Next.js config (next.config.js, tailwind.config.js)
- [x] Frontend package.json (14 npm packages)
- [x] .env.example (API endpoints)

### ✅ Faz 3: Backend Setup
- [x] NestJS app.module.ts
- [x] Backend main.ts entry point
- [x] Prisma schema (15+ tables)
- [x] Backend package.json (20+ npm packages)
- [x] .env.example (database, API keys)

### ✅ Faz 4: Shared Packages
- [x] game-engine package.json
- [x] api-client package.json
- [x] ui-components package.json
- [x] utils package.json

### 🟡 Faz 5: Dependencies Installation
- 🔄 Running: `npm install` in progress...

---

## ⏭️ Sonraki Adımlar

### Phase 1 (Faz 5-10 gün)
1. **npm install tamamla** ← Current
2. **Database Setup**
   - PostgreSQL local kurulumu (`docker-compose.yml` oluştur)
   - Prisma migrations (`npm run db:migrate`)
   - Seed data oluştur

3. **Frontend Temel Sayfalar**
   - Layout (header, sidebar, footer)
   - Auth pages (login, register)
   - Home page
   - Dashboard skeleton

4. **Backend API Endpoints**
   - Auth module (login, register, JWT)
   - Games CRUD
   - Child profile management
   - Session tracking

5. **Shared Game Engine SDK**
   - BaseGame abstract class
   - TargetingGame, PuzzleGame, MotionGame, MemoryGame templates
   - Scoring & adaptive logic

6. **MVP Oyunları**
   - Balon Patlatma (TargetingGame)
   - Yıldız Toplama (TargetingGame)
   - Kelebek Yakalama (MotionGame)
   - Labirent Kaçışı (PuzzleGame)

### Phase 2 (Faz 11-17 gün)
- Remaining 4 games
- Dashboard panels (parent, doctor, admin)
- Analytics integration (PostHog)
- Adaptive engine deployment
- PWA service worker

---

## 🔧 Kullanışlı Komutlar

```bash
# Development
npm run dev                    # Start all packages (frontend + backend)
npm run build                  # Build all packages
npm run lint                   # Lint all packages
npm run format                 # Format code

# Database
npm run db:migrate             # Run Prisma migrations
npm run db:studio              # Open Prisma Studio UI

# Individual packages
cd packages/web && npm run dev
cd packages/backend && npm run dev

# Specific commands
cd packages/web && npm run build
cd packages/backend && npm run build
```

---

## 🗂️ Dosya Yapısı (Detaylı)

### Frontend Pages (Tasarlanacak)
```
packages/web/src/app/
├── layout.tsx
├── page.tsx                    # Home
├── (auth)/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── layout.tsx
├── (dashboard)/
│   ├── parent/page.tsx
│   ├── doctor/page.tsx
│   ├── admin/page.tsx
│   └── layout.tsx
└── games/
    ├── [id]/page.tsx
    └── layout.tsx
```

### Backend Modules (Tasarlanacak)
```
packages/backend/src/modules/
├── auth/
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   ├── jwt.strategy.ts
│   └── auth.module.ts
├── games/
├── adaptive-engine/
├── scoring/
├── quests/
├── stories/
├── input-tracking/
├── analytics/
└── prescriptions/
```

---

## 💾 Ortam Değişkenleri

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXTAUTH_SECRET=dev_secret
```

### Backend (.env.local)
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/gozmacerasi
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev_jwt_secret
OPENAI_API_KEY=sk-xxx
```

---

## 📊 Proje Timelini

- **4-5 Mayıs:** ✅ Proje yapısı ve dependencies
- **6-8 Mayıs:** 🔄 Veritabanı ve temel API
- **9-10 Mayıs:** 🔄 Game engine SDK
- **11-12 Mayıs:** 🔄 MVP oyunları (8 adet)
- **13-14 Mayıs:** 🔄 Engagement loop (quests, streaks, stories)
- **15 Mayıs:** 🔄 Kitaplar ve UI komponentleri
- **16 Mayıs:** 🔄 Doktor reçete formu ve AI
- **17 Mayıs:** 🔄 PWA ve katalog
- **18 Mayıs:** 🔄 SEO ve demo modu
- **19-21 Mayıs:** ⏰ QA, test, production deploy

---

## 📝 Notlar

- Monorepo yapısı workspace'leri kullanıyor (npm workspaces)
- Turbo kullanılarak build cache ve task orchestration
- TypeScript strict mode etkinleştirildi
- All packages use Node.js v20+, npm v11+

---

**Sonraki: npm install tamamlandığında veritabanı setup başlayacak.**
