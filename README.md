# Gözmacerasi - Monorepo Setup Guide

## 📋 Project Structure

This is a Turborepo monorepo containing the complete Gözmacerasi platform (web app, backend API, and shared libraries).

```
gozmacerasi/
├── packages/
│   ├── web/                    # Next.js 14 Frontend
│   ├── backend/                # NestJS 10 Backend API
│   └── shared/
│       ├── game-engine/        # PixiJS game framework
│       ├── api-client/         # Axios API wrapper
│       ├── ui-components/      # Radix UI + Tailwind components
│       └── utils/              # Shared utilities
├── docker-compose.yml          # Local dev environment (PostgreSQL + Redis)
├── package.json                # Monorepo root config
├── turbo.json                  # Turborepo pipeline
├── tsconfig.json               # Root TypeScript config
└── codev3.md                   # Technical specifications
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (tested with v24.12.0)
- npm 9+ (tested with npm 11.8.0)
- Docker & Docker Compose (for PostgreSQL + Redis)

### Installation

1. **Install dependencies** (currently running):
```bash
npm install
```

2. **Start local services** (PostgreSQL + Redis):
```bash
docker-compose up -d
```

3. **Setup database**:
```bash
npm run db:migrate  # Run Prisma migrations
npm run db:studio  # Optional: Open Prisma Studio for data exploration
```

4. **Start development servers**:

**In separate terminals:**

Frontend (http://localhost:3000):
```bash
npm run dev --workspace=@gozmacerasi/web
```

Backend (http://localhost:3001):
```bash
npm run dev --workspace=@gozmacerasi/backend
```

Or run both together:
```bash
npm run dev  # Turborepo parallel execution
```

## 📦 Available Commands

**Root Level:**
- `npm run dev` - Start all packages in watch mode
- `npm run build` - Build all packages
- `npm run type-check` - Type check all packages
- `npm run lint` - Lint all packages
- `npm run format` - Format all packages
- `npm run clean` - Clean all dist folders

**Database:**
- `npm run db:migrate` - Run Prisma migrations
- `npm run db:studio` - Open Prisma Studio UI

**Individual Package Scripts:**
```bash
npm run dev --workspace=@gozmacerasi/web
npm run dev --workspace=@gozmacerasi/backend
npm run build --workspace=@gozmacerasi/game-engine
# etc...
```

## 🗂️ Environment Configuration

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_POSTHOG_KEY=phc_dev_key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev_secret_change_in_production
```

### Backend (.env.local)
```env
DATABASE_URL=postgresql://postgres:postgres_password@localhost:5432/gozmacerasi
REDIS_URL=redis://localhost:6379
NODE_ENV=development
PORT=3001
JWT_SECRET=dev_secret_change_in_production
OPENAI_API_KEY=sk_your_key
POSTHOG_API_KEY=phc_your_key
```

**Note:** `.env.local` files are already created with development defaults. Update with production values when deploying.

## 📚 Tech Stack

### Frontend
- **Framework:** Next.js 14 with App Router
- **UI Library:** Radix UI + Tailwind CSS 3.4
- **State:** Zustand
- **Animations:** Framer Motion
- **Games:** PixiJS 8
- **Auth:** NextAuth.js
- **i18n:** next-intl (TR/EN)
- **Analytics:** PostHog
- **PWA:** next-pwa

### Backend
- **Framework:** NestJS 10.3
- **Database:** PostgreSQL with Prisma ORM
- **Cache:** Redis
- **Auth:** JWT + Passport
- **AI:** OpenAI API + LangChain
- **WebSockets:** Socket.io (Phase 2)
- **Analytics:** PostHog
- **Email:** Resend (optional)

### Shared Packages
- **game-engine:** PixiJS game SDK
- **api-client:** Axios wrapper for API calls
- **ui-components:** Reusable React components
- **utils:** Helper functions

## 🔐 Local Services

PostgreSQL & Redis run in Docker:

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f postgres
docker-compose logs -f redis

# Access PostgreSQL
# Host: localhost:5432
# User: postgres
# Password: postgres_password
# Database: gozmacerasi
```

## 📊 Project Phases (17-day MVP Sprint)

- **Phase 1 (May 4-8):** Infrastructure + Core backend/frontend
- **Phase 2 (May 9-12):** Game engine + 8 games implementation
- **Phase 3 (May 13-17):** Analytics, Doctor features, Polish
- **Investor Demo:** May 21, 2026

See `codev3.md` for detailed specifications.

## 🐛 Troubleshooting

### npm install fails with version errors
Check `packages/*/package.json` for compatible versions. Run `npm cache clean --force` and retry.

### TypeScript errors
Run `npm run type-check` to identify issues. Check path aliases in `tsconfig.json`.

### Database connection fails
Ensure PostgreSQL is running: `docker-compose ps`

### Port conflicts
- Frontend: 3000 (change in `packages/web/.env.local` → `NEXTAUTH_URL`)
- Backend: 3001 (change in `packages/backend/.env.local` → `PORT`)
- PostgreSQL: 5432
- Redis: 6379
- Adminer: 8080

## 📖 Documentation

- **[codev3.md](./codev3.md)** - Complete technical specifications, MVP requirements, roadmap
- **[SETUP.md](./SETUP.md)** - Detailed installation guide

## 🤝 Contributing

1. Feature branches from `main`
2. Run `npm run lint` and `npm run format` before commits
3. Update tests and documentation

## 📝 License

All rights reserved - Gözmacerasi Project
