# Home Upkeep AI — Architecture & Tech Stack

## Philosophy
- Monorepo, local-first, deployable with one command
- SQLite for local development (no Docker/Postgres required)
- Full-stack TypeScript for type safety across the boundary
- Server-rendered where possible, SPA where necessary (dashboards, drag-and-drop)

## Tech Stack

### Frontend
- **Next.js 14** (App Router) — SSR, file-based routing, API routes
- **React 19** — UI framework
- **Tailwind CSS 3** + **shadcn/ui** — component library (accessible, themeable)
- **Recharts** — charts and analytics
- **React Hook Form** + **Zod** — form handling and validation
- **Zustand** — lightweight client state for dashboards
- **Lucide React** — icon library
- **date-fns** — date formatting
- **TanStack Table** — sortable, filterable data tables

### Backend
- **Next.js API Routes** (Route Handlers) — REST API endpoints
- **Drizzle ORM** — type-safe SQL, works with SQLite + Postgres
- **better-sqlite3** — local SQLite for development, zero config
- **Zod** — request validation
- **bcrypt** — password hashing
- **jose** — JWT token handling
- **multer** / formidable — file uploads
- **sharp** — image processing and thumbnails

### AI
- **Anthropic Claude SDK** — inspection report analysis, photo assessment, chat advisor, cost estimation
- Falls back gracefully when no API key is configured (features degrade, app still works)

### Database
- **SQLite** (local dev) via better-sqlite3
- **PostgreSQL** (production) — same Drizzle schema, swap driver
- **Drizzle Kit** — migrations

### Testing
- **Vitest** — unit and integration tests
- **Testing Library** — React component tests
- **Playwright** — end-to-end tests
- **supertest** — API route testing

### DevOps
- **npm** — package management
- **TypeScript 5.3** — strict mode
- **ESLint** + **Prettier** — code quality
- **Husky** — git hooks

## Project Structure
```
home-upkeep-ai/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing / redirect to dashboard
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx      # Dashboard shell (sidebar + header)
│   │   │   ├── page.tsx        # Portfolio overview
│   │   │   ├── properties/
│   │   │   │   ├── page.tsx           # Property list
│   │   │   │   ├── new/page.tsx       # Add property wizard
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx       # Property detail
│   │   │   │       ├── systems/page.tsx
│   │   │   │       ├── work-orders/page.tsx
│   │   │   │       ├── financials/page.tsx
│   │   │   │       ├── documents/page.tsx
│   │   │   │       ├── tenants/page.tsx
│   │   │   │       └── inspections/page.tsx
│   │   │   ├── work-orders/
│   │   │   │   ├── page.tsx           # All work orders
│   │   │   │   └── [id]/page.tsx      # Work order detail
│   │   │   ├── contractors/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── calendar/page.tsx
│   │   │   ├── financials/page.tsx
│   │   │   ├── reports/page.tsx
│   │   │   └── settings/page.tsx
│   │   └── api/
│   │       ├── auth/
│   │       ├── properties/
│   │       ├── systems/
│   │       ├── work-orders/
│   │       ├── contractors/
│   │       ├── tenants/
│   │       ├── documents/
│   │       ├── financials/
│   │       ├── ai/
│   │       └── uploads/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── layout/             # Sidebar, Header, Footer
│   │   ├── properties/         # Property-specific components
│   │   ├── work-orders/        # Work order components
│   │   ├── systems/            # System/appliance components
│   │   ├── financials/         # Charts, budget views
│   │   ├── contractors/        # Contractor components
│   │   ├── tenants/            # Tenant portal components
│   │   └── shared/             # Reusable components
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts        # Database connection
│   │   │   ├── schema.ts       # Drizzle schema (all tables)
│   │   │   └── migrations/     # Drizzle migrations
│   │   ├── auth.ts             # JWT utilities
│   │   ├── ai.ts               # AI service abstraction
│   │   ├── validators.ts       # Zod schemas
│   │   └── utils.ts            # Shared utilities
│   ├── hooks/                  # React hooks
│   ├── stores/                 # Zustand stores
│   └── types/                  # TypeScript types
├── public/                     # Static assets
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── drizzle.config.ts
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── .env.local                  # Local config (SQLite path, optional AI keys)
└── README.md
```

## Database Schema (Core Tables)
1. users — authentication and profile
2. properties — address, type, year_built, sq_ft, units_count
3. units — property subdivision (apartments, rooms)
4. systems — HVAC, plumbing, electrical, roof, etc. per property/unit
5. appliances — individual appliances with make/model/serial
6. work_orders — maintenance tasks with status lifecycle
7. work_order_photos — before/after images
8. contractors — vendor database
9. contractor_specialties — many-to-many
10. expenses — financial tracking per work order or general
11. documents — uploaded files metadata
12. tenants — tenant info linked to units
13. maintenance_schedules — recurring task definitions
14. inspections — inspection events with findings
15. inspection_items — individual findings per inspection
16. notifications — user notification queue
17. audit_log — immutable action log
18. tags — flexible tagging system
19. tag_assignments — polymorphic tag links

## Local Deployment
```bash
git clone <repo>
cd home-upkeep-ai
npm install
cp .env.example .env.local   # SQLite auto-configured
npm run db:migrate            # Create SQLite tables
npm run dev                   # http://localhost:3000
```
