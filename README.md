# CampusQuiz

Live classroom quizzes for college staff and students. Staff create quizzes and host them; students join from their phones with a 6-digit code. No student accounts.

## Features
- Staff sign-up / sign-in (optionally limited to your college's email domain)
- Quiz builder: multiple-choice and true/false, per-question time limit, points and explanation
- Live sessions: join code, lobby, timed questions, speed-based scoring, leaderboard
- Results dashboard: sessions, participants, average score, completion rate, hardest questions

## Run locally
```bash
npm install
npm run dev
```
With no `DATABASE_URL`, data is stored in JSON files under `./data`.

## Configuration
Copy `.env.example` to `.env.local`.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string (Supabase works). Without it, local files are used. |
| `NEXTAUTH_SECRET` | Signs login cookies. Required in production. |
| `ALLOWED_EMAIL_DOMAIN` | Optional. Only this email domain can create staff accounts. |
| `DATA_DIR` | Optional. Folder for file storage when no database is set. |

## Database
Create these tables in Postgres (Supabase SQL editor): `app_users`, `app_quizzes`, `app_results`. See `supabase/schema.sql`.

## Deploy
`render.yaml` deploys to Render. Live sessions are kept in server memory, so run a single instance. A restart ends any game in progress; accounts, quizzes and results are kept in the database.
