# Tracker App

A personal execution-tracking web app built for a Senior DevOps Engineer running a strict 40 hr/week schedule across APAC, EMEA, and US time zones.

Login-protected. Self-hosted. Deployable as a Docker container to AWS ECR / ECS.

---

## Features

| Page | Description |
|---|---|
| **Dashboard** | Daily entry form (NOW / NEXT / DRIFT / SCORE), today's schedule strip with live active slot, greeting by time of day |
| **Schedule** | Full weekly schedule table (IST), live cell highlight, editable cells with category picker — edits persist to DB and sync to dashboard in real time |
| **Ideal Day** | Full 05:30–22:00 weekday template with colour-coded timeline, per-block descriptions, active block highlight, and a precise 40-hr weekly budget breakdown table |
| **Score Calendar** | Month-view calendar showing average daily score, colour-coded 1–5, month stats, hover tooltips, month navigation |
| **Profile** | Full name capture, avatar initials, username display — full name used in dashboard greeting |
| **Login** | JWT-based auth, single user, credentials in `.env` |

---

## Tech Stack

| Layer | Choice |
|---|---|
| Runtime | Node.js 18 |
| Framework | Express 4 |
| Auth | JWT (`jsonwebtoken`) |
| Database | SQLite 3 (file-based, zero infra) |
| Frontend | Plain HTML + CSS + Vanilla JS |
| Config | `dotenv` — all secrets in `.env` |
| Container | Docker (`node:18-alpine`) |

---

## Project Structure

```
tracker-app/
├── app.js                  # Express server + all API routes
├── auth.js                 # JWT middleware
├── db.js                   # SQLite schema init
├── package.json
├── Dockerfile
├── .env                    # Secrets — never commit
├── .env.example            # Safe template to commit
├── .gitignore
├── .dockerignore
└── public/
    ├── login.html
    ├── dashboard.html
    ├── schedule.html
    ├── schedule-data.js    # Shared schedule data (default rows + categories)
    ├── dayplan.html
    ├── scores.html
    ├── profile.html
    └── style.css
```

---

## Database Schema

```sql
-- Execution logs
CREATE TABLE logs (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  date     TEXT,
  now      TEXT,
  next     TEXT,
  drift    TEXT,
  score    INTEGER
);

-- User profile
CREATE TABLE profile (
  username  TEXT PRIMARY KEY,
  full_name TEXT
);

-- Schedule cell overrides (edits made in schedule.html)
CREATE TABLE schedule_overrides (
  row_idx   INTEGER NOT NULL,
  day_idx   INTEGER NOT NULL,
  label     TEXT    NOT NULL,
  category  TEXT    NOT NULL,
  PRIMARY KEY (row_idx, day_idx)
);
```

---

## API Routes

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/login` | — | Returns JWT token |
| `POST` | `/log` | ✓ | Save a daily execution entry |
| `GET` | `/logs` | ✓ | Get all entries (newest first) |
| `DELETE` | `/log/:id` | ✓ | Delete an entry |
| `GET` | `/profile` | ✓ | Get profile (username + full name) |
| `POST` | `/profile` | ✓ | Save / update full name |
| `GET` | `/schedule/overrides` | ✓ | Get all schedule cell overrides |
| `POST` | `/schedule/overrides` | ✓ | Save / update a cell override |
| `DELETE` | `/schedule/overrides/:row/:day` | ✓ | Reset cell to default |
| `GET` | `/scores/daily` | ✓ | Avg score + entry count per day |

---

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd tracker-app
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
APP_USER=admin
APP_PASS=your-strong-password
JWT_SECRET=a-long-random-secret-string
PORT=3000
```

> The server will refuse to start if `APP_USER`, `APP_PASS`, or `JWT_SECRET` are missing.

### 3. Run locally

```bash
npm start
# open http://localhost:3000
```

---

## Docker

### Build

```bash
docker build -t tracker-app .
```

### Run locally with Docker

```bash
docker run -p 3000:3000 \
  -e APP_USER=admin \
  -e APP_PASS=yourpassword \
  -e JWT_SECRET=yoursecret \
  -v $(pwd)/data:/app/data \
  tracker-app
```

> Mount a volume for `/app/data` (or the working directory) to persist `data.db` across container restarts.

---

## Deploy to AWS ECR + ECS

### 1. Create ECR repository

```bash
aws ecr create-repository --repository-name tracker-app --region us-east-1
```

### 2. Authenticate Docker to ECR

```bash
aws ecr get-login-password --region us-east-1 \
  | docker login --username AWS --password-stdin \
    <account-id>.dkr.ecr.us-east-1.amazonaws.com
```

### 3. Tag and push

```bash
docker tag tracker-app:latest \
  <account-id>.dkr.ecr.us-east-1.amazonaws.com/tracker-app:latest

docker push \
  <account-id>.dkr.ecr.us-east-1.amazonaws.com/tracker-app:latest
```

### 4. ECS task definition (key environment variables)

Set these as environment variables in your ECS task definition or via AWS Secrets Manager:

```
APP_USER      → your username
APP_PASS      → your password
JWT_SECRET    → long random string
PORT          → 3000
```

---

## Execution Field Reference

| Field | Meaning |
|---|---|
| **NOW** | What you are focused on in this block |
| **NEXT** | What you will do immediately after |
| **DRIFT** | What pulled you off your intended plan |
| **SCORE** | Execution quality of the block (1–5) |

### Score Scale

| Score | Meaning |
|---|---|
| 1 | Completely lost — didn't do it |
| 2 | Started, heavy drift |
| 3 | Partial focus, some drift |
| 4 | Focused, minor drift |
| 5 | Deep work, zero drift |

---

## Schedule Editing

Any cell in the weekly schedule table is editable:

1. Click a cell — a popover appears
2. Edit the label and pick a category
3. Press **Save** (or Enter) — change persists to SQLite and syncs to the dashboard immediately
4. Press **Reset** to restore the original default value

Overridden cells show a small blue dot indicator.

---

## Security Notes

- Credentials and JWT secret are read from environment variables only — no hardcoded fallbacks
- `.env` is excluded from both git (`.gitignore`) and Docker image (`.dockerignore`)
- All API routes except `/login` require a valid JWT in the `Authorization` header
- HTML output is XSS-safe (user content rendered via `textContent` / `escHtml`)
