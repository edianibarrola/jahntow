# Jahntow

A browser-based space trading / mission game. React (Vite) frontend, Flask
backend. The backend is the single source of truth for all game state —
prices, mission outcomes, XP, inventory, etc. are all computed and validated
server-side; the frontend just renders whatever the API returns and sends
player intent ("buy 2x Alpha Core", "start Asteroid Mining").

## Project layout

```
src/api/           Flask backend
  models.py           Player/User/MarketPrice DB models
  routes.py            auth + basic player endpoints
  game_routes.py        market/mission/equipment/property/recovery/upgrade endpoints
  economy.py            all game math: prices, mission resolution, levelling, passive regen
  game_data.py           the item/mission/property/equipment/recovery catalog (single source
                          of truth - the frontend fetches this via GET /api/game-data)
  admin.py               Flask-Admin panel (see below)
src/front/js/       React app (Vite)
  store/flux.js         narrative/flavor content (story arc text) + local UI state helpers
  pages/, component/    UI
migrations/         Alembic DB migrations
```

## Prerequisites

- Python 3.10+
- Node 20.x
- [pipenv](https://pipenv.pypa.io/) (`pip install pipenv`)

## Local setup

```sh
cp .env.example .env
```

Open `.env` and fill in what you need (see the table below - the defaults
work for local development against SQLite with no changes needed except
`BACKEND_URL`).

**Backend:**

```sh
pipenv install
pipenv run upgrade       # applies DB migrations
pipenv run start         # runs Flask on http://localhost:3001
```

**Frontend** (separate terminal):

```sh
npm install
npm start                # runs the Vite dev server on http://localhost:3000
```

Open `http://localhost:3000`.

## Environment variables

| Variable | Required | Default / notes |
| --- | --- | --- |
| `DATABASE_URL` | No | Falls back to a local SQLite file if unset. Format for Postgres: `postgres://user:pass@host:5432/dbname` |
| `FLASK_APP` | Yes | `src/app.py` |
| `FLASK_ENV` | Yes | `development` locally (relaxes CORS, enables the `/` sitemap page, allows insecure default secrets). Use `production` everywhere else. |
| `FLASK_APP_KEY` | Only in production | Flask session secret key. Generate with `python -c "import secrets; print(secrets.token_hex(32))"` |
| `JWT_SECRET_KEY` | Only in production | Signs auth tokens. Generate the same way as above. **Never reuse the same value for both.** |
| `CORS_ORIGINS` | No | Comma-separated allowed frontend origins in production, e.g. `https://yourdomain.com`. Not needed locally (dev mode allows any origin); not needed in production either if the frontend is served by this same Flask app, which is the default setup. |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | No | Set both to enable the `/admin` panel (HTTP Basic Auth). Leave unset to keep it fully disabled - recommended unless you actually need it. |
| `BASENAME` | Yes | Frontend router base path. `/` unless you're deploying under a subpath. |
| `BACKEND_URL` | Only in dev | Where the frontend should send API requests, e.g. `http://localhost:3001` locally, where the frontend (:3000) and backend (:3001) are different origins. In production leave it empty - Flask serves both the API and the built frontend from one origin, so relative requests already reach the right place. |

In production, `FLASK_APP_KEY` and `JWT_SECRET_KEY` are **required** - the
app refuses to start without them rather than falling back to an insecure
default.

## Database migrations

```sh
pipenv run migrate     # generate a new migration after changing src/api/models.py
pipenv run upgrade      # apply migrations
pipenv run downgrade    # roll back one migration
```

## Seeding test accounts

```sh
pipenv run flask insert-test-users 5
```

Creates 5 accounts (`test_user1@test.com` .. `test_user5@test.com`,
password `123456`), each with a playable default `Player`.

## Admin panel

`/admin` (Flask-Admin) lets you view/edit `User` and `Player` rows directly.
It's disabled unless both `ADMIN_USERNAME` and `ADMIN_PASSWORD` are set, and
even then it's gated behind HTTP Basic Auth. Password hashes are never
exposed through it.

## Production build

```sh
npm run build
```

Outputs to `public/`, which the Flask app serves directly (no separate
static host needed). This is what `render_build.sh` runs on deploy.

## Deploying

`render.yaml` targets [Render](https://render.com). `FLASK_APP_KEY`,
`JWT_SECRET_KEY`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `CORS_ORIGINS` are
marked `sync: false` there on purpose - set them in the Render dashboard
rather than committing them.
