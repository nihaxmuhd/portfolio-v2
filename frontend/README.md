# Muhammed Nihad — Full Stack Portfolio

A production-ready developer portfolio with a **React + Vite + Tailwind v4** frontend and a **Django + DRF** backend.

## 📁 Project Structure

```
.
├── src/                      # Frontend (React/TypeScript)
│   ├── api/                  # API abstraction layer (matches DRF endpoints)
│   │   ├── types.ts          # Types mirroring Django models
│   │   ├── client.ts         # API calls (mock or real)
│   │   └── mockData.ts       # Seed data + localStorage persistence
│   ├── components/
│   │   ├── ui/               # Button, Card, Input, Modal, Section, Toast
│   │   ├── Navbar.tsx        # Sticky glass navbar
│   │   ├── Hero.tsx          # Hero with stats + resume download
│   │   ├── About.tsx
│   │   ├── Skills.tsx        # Animated progress bars, grouped by category
│   │   ├── Projects.tsx      # Featured project grid
│   │   ├── Experience.tsx    # Alternating timeline
│   │   ├── Contact.tsx       # Channels + form
│   │   ├── Footer.tsx
│   │   ├── AIAssistant.tsx   # Floating context-aware chat
│   │   └── BrandIcons.tsx    # GitHub / LinkedIn SVGs
│   ├── context/AuthContext.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Login.tsx         # /login — hidden from public nav
│   │   └── Dashboard.tsx     # /dashboard — admin CMS
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css             # Tailwind v4 theme + glass utilities
│
└── backend/                  # Django backend (ready to run)
    ├── core/                 # settings, urls, wsgi, asgi
    ├── accounts/             # token auth (login / logout / me)
    ├── portfolio/            # models, serializers, views, admin
    ├── requirements.txt
    └── manage.py
```

## ✨ Features

**Public site**
- Responsive navbar with smooth scroll
- Hero with live stats, resume download (hidden if no resume), and AI assistant
- About, Skills (animated bars), Projects, Experience (timeline), Contact, Footer
- Floating AI assistant that answers questions from database content

**Admin** (`/login` → `/dashboard`)
- No public admin button — access is via URL only
- Profile management
- Skills CRUD with category + proficiency slider
- Projects CRUD (featured flag, tech stack, links)
- Experience CRUD (current-role toggle)
- Resume upload / remove
- Inbox of contact messages with read/unread

**Demo credentials** — `admin` / `admin123`

## 🎨 Design System

- Premium dark theme with purple → cyan gradient accents
- Glassmorphism cards (`.glass`, `.glass-strong` utilities)
- Framer Motion entrance animations + animated bars
- Mobile-first, tested across 320 / 375 / 425 / 768 / 1024 / 1440
- No fixed widths — all responsive Tailwind utilities

## 🚀 Frontend

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # outputs dist/index.html (single file)
```

### Swapping the mock API for the real backend

In `src/api/client.ts`, replace each function body with a `fetch` call against the Django server:

```ts
const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: authHeaders(),
    credentials: "include",
  });
  if (!res.ok) throw Object.assign(new Error(res.statusText), { status: res.status });
  return res.json();
}

export const getProfile = () => get<PortfolioProfile>("/api/profile/");
// ... etc.
```

The TypeScript types in `src/api/types.ts` match the DRF serializers 1:1, so the swap is drop-in.

## 🐍 Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser   # use these creds for /login
python manage.py runserver
```

API lives at `http://localhost:8000/api/`. See `backend/README.md` for full endpoint reference.

### Production (PostgreSQL)

Set `DATABASE_URL`, `SECRET_KEY`, `DEBUG=0`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS` — `settings.py` reads them automatically via `dj-database-url` and `os.environ`.

## 📡 API Surface

| Endpoint | Public | Admin |
|---|---|---|
| `GET /api/profile/` | ✅ | `PUT/PATCH` |
| `GET /api/stats/` | ✅ | — |
| `/api/skills/` | `GET` | full CRUD |
| `/api/projects/` | `GET` | full CRUD |
| `/api/experience/` | `GET` | full CRUD |
| `/api/resume/` | `GET` | `POST/DELETE` |
| `POST /api/contact/` | ✅ | — |
| `/api/messages/` | — | list / retrieve / delete / `.../read/` |
| `/api/auth/login/` | `POST` | — |
| `/api/auth/logout/` | — | `POST` |
| `/api/auth/me/` | — | `GET` |

## 🛡️ Architecture Notes

- **Separation of concerns** — the frontend never imports models or backend internals. All communication flows through `src/api/client.ts`.
- **Token auth** — DRF `TokenAuthentication`. Login issues a token, logout deletes it, every admin view checks `request.user.is_staff`.
- **Permissions** — `ReadOnlyOrAdmin` (public reads, admin writes) and `AdminOnly` (writes only).
- **Singleton profile** — `PortfolioProfile.save()` prevents duplicate rows.
- **Resume rotation** — uploading a new resume auto-deletes the previous one.

## 📜 License

MIT
