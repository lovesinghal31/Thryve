# Thryve – Mental Health Platform

A multi–component mental health solution (Smart India Hackathon 2025) delivering secure data management, administrative analytics, assessments, and a user‑facing support experience ("Mental Mitra").

## 🚀 Overview

Core pillars:
- **Backend API (`Backend/`)** – Node.js / Express / MongoDB service exposing secure REST endpoints, authentication, screening, resources, appointments, notifications & analytics data feeds.
- **Admin Dashboard (`thryveadmin/`)** – Next.js 15 (App Router) powered interface for administrators: user / institute / appointment / screening / resource & notification management + analytics.
- **User Platform (`Thryve/`)** – Static HTML/CSS/JS experience (Mental Mitra) offering assessments (PHQ, GHQ), chatbot UI, community & educational resources.

## 🏗️ Architecture & Tech

### 1. Backend (`Backend/`)
| Layer | Stack / Library |
|-------|-----------------|
| Runtime | Node.js (ESM) |
| Framework | Express 5 (next-gen router) |
| Database | MongoDB + Mongoose 8 |
| Auth | JWT (access / refresh), bcrypt password hashing |
| Email | Nodemailer (OTP + notifications) |
| Utilities | `dotenv`, `cors`, `cookie-parser` |
| Dev | Nodemon, Prettier |

Key Responsibilities:
- Auth & authorization (role / token lifecycle)
- OTP email verification & password reset
- Screening + appointments + resources CRUD
- Institutes, notifications, tasks, intervention logs
- Analytics aggregation for dashboard
- Seeding & data generation via Faker

### 2. Admin Dashboard (`thryveadmin/`)
| Concern | Stack |
|---------|-------|
| Framework | Next.js 15 (App Dir) |
| Language | TypeScript |
| UI / Headless | Radix UI, custom components |
| Styling | Tailwind CSS 4 + utility merge |
| State / Data | TanStack Query (React Query), React state, (potential future store) |
| Forms / Validation | React Hook Form + Zod |
| Charts | Recharts |
| HTTP | Axios (interceptors) |
| UX | Sonner (toasts), Drag & Drop (dnd-kit) |

Admin Features:
- Secure session (cookie / token consumption)
- Management (Users, Institutes, Appointments, Screenings, Resources)
- Notifications & analytics panels
- Visualization dashboards (appointments, screenings, usage)

### 3. User Platform (`Thryve/` – “Mental Mitra”)
| Aspect | Details |
|--------|---------|
| Delivery | Static HTML/CSS/JS |
| Styling | Plain CSS + optional Tailwind classes (where applied) |
| Assets | PDFs (assessments & learning), images, audio |
| Features | PHQ & GHQ questionnaires, chatbot UI shell, community & profile pages |

Note: This layer currently consumes backend indirectly (future integration hooks can be added). Chatbot logic placeholder may integrate an LLM or domain rule engine later.

## 📋 API Surface

High‑level domains exposed by the backend (/api/v1):
- Users (auth lifecycle, profile)
- Institutes
- Appointments
- Screenings (PHQ / GHQ etc.)
- Resources (educational content)
- Notifications
- Admin analytics (aggregated metrics)

Detailed routes: see `Backend/API_ENDPOINTS.md` & specialized analytics docs in `Backend/ADMIN_ANALYTICS_ENDPOINTS.md`.

## 🔧 Quick Start (All Components)

### Prerequisites
- Node.js ≥ 18 (recommended) *(Express 5 & Next.js 15 tested against modern LTS)*
- MongoDB ≥ 5 (local or remote URI)
- Git

### 1. Clone
```bash
git clone https://github.com/lovesinghal31/Thryve.git
cd Thryve
```

### 2. Backend Setup (`Backend/`)
```bash
cd Backend
npm install
cp .env.example .env   # or manually create
```
Populate `.env` (see Environment Variables below) then:
```bash
npm run seed        # optional test data
npm run dev         # starts on PORT (default 5000)
```

### 3. Admin Dashboard (`thryveadmin/`)
In a new terminal from repo root:
```bash
cd thryveadmin
npm install
cp .env.local.example .env.local  # create if not present
```
Set `NEXT_PUBLIC_API_BASE_URL` (defaults often: http://localhost:5000/api/v1)
```bash
npm run dev
```

### 4. User Platform (`Thryve/`)
Open the HTML files directly or serve with a lightweight static server:
```bash
# From repo root
cd Thryve
# Example (using Node's http-server if installed)
# npx http-server . -p 5173
```

---

## 🔐 Environment Variables

### Backend (`Backend/.env`)
| Variable | Purpose | Example |
|----------|---------|---------|
| MONGODB_URI | Mongo connection string | mongodb://127.0.0.1:27017/thryve |
| ACCESS_TOKEN_SECRET | JWT signing (short‑lived) | (random 64 chars) |
| REFRESH_TOKEN_SECRET | JWT refresh signing | (random 64 chars) |
| ACCESS_TOKEN_EXPIRY | Access token TTL | 15m |
| REFRESH_TOKEN_EXPIRY | Refresh token TTL | 7d |
| PORT | API port | 5000 |
| EMAIL_HOST | SMTP host | smtp.example.com |
| EMAIL_PORT | SMTP port | 587 |
| EMAIL_USER | SMTP username | no-reply@example.com |
| EMAIL_PASS | SMTP password | ******** |

### Admin (`thryveadmin/.env.local`)
| Variable | Purpose | Example |
|----------|---------|---------|
| NEXT_PUBLIC_API_BASE_URL | Base URL pointing to backend prefix | http://localhost:5000/api/v1 |

> Keep secrets out of version control. Provide example templates only.

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn package manager
- Git

### 🔗 Clone the Repository

1. Clone the repository:
```bash
git clone https://github.com/lovesinghal31/Thryve.git
```

2. Navigate to the project directory:
```bash
cd Thryve
```

## 🗄️ Database Seeding

Seeder scripts (Faker‑powered) create realistic domain data (users, institutes, screenings, appointments, tasks, notifications, resources, logs, chat sessions, admin snapshots).

```bash
cd Backend
npm run seed          # populate
npm run seed:clear    # remove all collections
```
Fresh reseed pattern:
```bash
npm run seed:clear && npm run seed
```

> NOTE: A `--fresh` flag is referenced historically; current scripts support explicit `seed:clear` then `seed`.

## 🎯 Feature Summary

| Domain | Highlights |
|--------|-----------|
| Authentication | Access/Refresh tokens, OTP email verify, password reset |
| Users & Roles | Multi‑role (admin, counselor, etc.) management |
| Screenings | PHQ / GHQ storage & retrieval, future extensibility |
| Appointments | Scheduling, status tracking, analytics integration |
| Institutes | CRUD + association with users & screenings |
| Resources | Educational content catalog |
| Notifications | System events & administrative alerts |
| Analytics | Aggregated counts, screening trends, appointment metrics |
| Seeding | Realistic domain data generation (Faker) |
| Chat Sessions | Placeholder schema for AI / support transcripts |

Planned Enhancements (Roadmap):
- Centralized logging & request tracing
- Role-based UI gating refinement in admin
- Chatbot backend integration (LLM / rules engine)
- CI pipeline & containerization (Docker + deployment recipes)
- Rate limiting & audit trails

## 🚦 Scripts

### Backend (`Backend/package.json`)
| Script | Purpose |
|--------|---------|
| dev | Start dev server (nodemon + dotenv) |
| start | Production start |
| seed | Populate database with dummy data |
| seed:clear | Clear all collections |

### Admin (`thryveadmin/package.json`)
| Script | Purpose |
|--------|---------|
| dev | Next.js dev server |
| build | Production build |
| start | Start compiled server |
| lint | Run ESLint |

### User Platform
Static – serve via any static server (no build step currently).

## 📁 Structure (Current)

```
Thryve/
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   └── seed/
│   └── public/
├── thryveadmin/          # Next.js admin dashboard
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── types/
├── Thryve/               # Static user frontend (Mental Mitra)
│   ├── *.html / *.css / *.js / *.pdf
└── Readme.md
```

## 🧪 Development Workflow

1. Run Mongo locally (or point `MONGODB_URI` to Atlas / remote).
2. Start backend first (`npm run dev`).
3. Launch admin dashboard; verify API base env variable.
4. Seed data if you need test fixtures.
5. Iterate with feature branches (`feature/<short-topic>`), open PRs.
6. Keep schemas & controllers cohesive; update seeder when adding new domain objects.

### Coding Conventions
- ESM imports (backend) – prefer named exports where possible.
- Error handling via centralized ApiError utility (see `Backend/src/utils`).
- Consistent response envelopes (success flag, data, message).
- Use Zod/react-hook-form on admin side for client validation.

### Suggested Next Improvements (Good First Issues)
- Add Dockerfiles for backend & admin.
- Introduce centralized logger (pino / winston) with request correlation.
- Add rate limiting middleware (express-rate-limit) & helmet hardening.
- Write minimal Jest test suite for critical auth & screening flows.

## 🤝 Contributing

1. Fork & clone
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "feat: add X"`
4. Push: `git push origin feature/your-feature`
5. Open a PR (describe context, screenshots if UI)

Follow conventional commit prefixes when possible (feat, fix, chore, docs, refactor).

## 🔒 Security
- Never commit real secrets.
- Rotate JWT secrets & SMTP credentials periodically.
- Validate all input server‑side (augment with JOI / Zod server if needed).
- Consider enabling CORS allow‑list when deploying.

Report vulnerabilities privately to the maintainers before public disclosure.

## 📜 License / Usage
Currently unlicensed (default copyright © authors). Consider adding an OSI approved license (MIT / Apache‑2.0) for broader collaboration.

## 👥 Team

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


### Development Team
- **[Krish Mishra](https://github.com/Krish-Mishra)** – Team Lead / Research & Frontend
- **[Jayendra Vishwakarma](https://github.com/Jay-877)** – Frontend
- **[Ansh Zamde](https://github.com/ansh1024)** – Frontend
- **[Ashish Gupta](https://github.com/ashish13gupta2006-cmd)** – UI / UX
- **[Nimisha Agarwal](https://github.com/nimisha1505)** – Research / Backend
- **[Love Singhal](https://github.com/lovesinghal31)** – Backend

## 📞 Support
Open an issue or consult component‑level READMEs. For sensitive matters (security / data integrity) contact maintainers directly.

---

Smart India Hackathon 2025 – Mental Health in Higher Education Initiative.