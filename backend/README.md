# Portfolio Backend

Django + Django REST Framework backend powering the portfolio frontend.

## Architecture

```
backend/
├── core/            # Project settings, root URLs, WSGI/ASGI
├── accounts/        # Auth (login/logout/me) via DRF TokenAuth
├── portfolio/       # Profile, Skills, Projects, Experience, Resume, Messages
├── media/           # Uploaded files (gitignored)
└── manage.py
```

## API Endpoints

### Public (read-only)
- `GET  /api/profile/`           — portfolio profile
- `GET  /api/stats/`             — projects_built, tech_skills, years_experience
- `GET  /api/skills/`            — ordered by `order`
- `GET  /api/projects/`          — ordered by `order`
- `GET  /api/experience/`        — ordered by `order`
- `GET  /api/resume/`            — latest resume (or 404)
- `POST /api/contact/`           — submit a contact message

### Auth
- `POST /api/auth/login/`        — returns `{ token, user }`
- `POST /api/auth/logout/`
- `GET  /api/auth/me/`           — current user

### Admin (token-authenticated)
- `PUT/PATCH  /api/profile/`
- `GET/POST   /api/skills/`
- `PUT/PATCH/DELETE /api/skills/<id>/`
- `GET/POST   /api/projects/`
- `PUT/PATCH/DELETE /api/projects/<id>/`
- `GET/POST   /api/experience/`
- `PUT/PATCH/DELETE /api/experience/<id>/`
- `POST/DELETE /api/resume/`
- `GET        /api/messages/`
- `POST       /api/messages/<id>/read/`
- `DELETE     /api/messages/<id>/`

## Setup (Development — SQLite)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

The frontend expects the backend on `http://localhost:8000`.
CORS is pre-configured for `http://localhost:5173` (Vite).

## Production (PostgreSQL)

1. Install `psycopg2-binary` (already in requirements).
2. Set environment variables:

```
DATABASE_URL=postgres://user:pass@host:5432/portfolio
SECRET_KEY=<generate-with-django-core-commands>
DEBUG=0
ALLOWED_HOSTS=api.example.com
CORS_ALLOWED_ORIGINS=https://example.com
```

3. The `settings.py` uses `DATABASE_URL` via `dj-database-url` when present,
   otherwise falls back to SQLite for development.

## Superuser vs. Portfolio Admin

- Django superuser → `/admin/` (Django's built-in admin)
- Portfolio admin → `/dashboard` (the React app, authenticated via `/api/auth/login/`)

Create the first portfolio admin user via Django shell:

```bash
python manage.py shell
>>> from django.contrib.auth import get_user_model
>>> User = get_user_model()
>>> User.objects.create_superuser('admin', 'admin@example.com', 'your-password')
```

## Initial Data

Run once after migrating:

```bash
python manage.py shell < portfolio/fixtures/seed.py
```

Or create a `PortfolioProfile` row via the Django admin and the API will serve it.
