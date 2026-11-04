import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

/** Results of finished live games, stored in data/results.json (same approach as quizzes). */

export interface SessionResult {
  id: string;
  code: string;
  quizId: string;
  quizTitle: string;
  hostId: string;
  endedAt: string;
  maxPoints: number; // points a player gets for every question answered correctly with no speed penalty
  players: { name: string; score: number; answered: number; correct: number }[];
  questions: { text: string; answered: number; correct: number }[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE = path.join(DATA_DIR, 'results.json');

function readAll(): SessionResult[] {
  try {
    if (!fs.existsSync(FILE)) return [];
    return JSON.parse(fs.readFileSync(FILE, 'utf-8')) as SessionResult[];
  } catch {
    return [];
  }
}

export function saveResult(result: Omit<SessionResult, 'id' | 'endedAt'>) {
  const all = readAll();
  all.push({ ...result, id: crypto.randomUUID(), endedAt: new Date().toISOString() });
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = `${FILE}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(all, null, 2), 'utf-8');
  fs.renameSync(tmp, FILE);
}

export function listResults(hostId: string): SessionResult[] {
  return readAll()
    .filter((r) => r.hostId === hostId)
    .sort((a, b) => a.endedAt.localeCompare(b.endedAt));
}

export interface DashboardStats {
  totalSessions: number;
  totalParticipants: number;
  avgScorePct: number; // 0-100
  completionPct: number; // 0-100
  trend: { label: string; title: string; pct: number }[]; // last 10 sessions, oldest first
  hardest: { quizTitle: string; text: string; accuracy: number; answered: number }[];
  recent: { id: string; title: string; endedAt: string; players: number; avgPct: number }[];
}

const pctOf = (n: number, d: number) => (d > 0 ? Math.min(100, Math.round((n / d) * 100)) : 0);

export function computeStats(results: SessionResult[]): DashboardStats {
  let participants = 0;
  let scoreSum = 0;
  let scoreN = 0;
  let answeredSum = 0;
  let possibleSum = 0;

  const perSession = results.map((r) => {
    const sessionPcts = r.players.map((p) => pctOf(p.score, r.maxPoints));
    const avgPct = sessionPcts.length ? Math.round(sessionPcts.reduce((a, b) => a + b, 0) / sessionPcts.length) : 0;
    participants += r.players.length;
    for (const pct of sessionPcts) {
      scoreSum += pct;
      scoreN++;
    }
    for (const p of r.players) {
      answeredSum += p.answered;
      possibleSum += r.questions.length;
    }
    return { r, avgPct };
  });

  const hardest = results
    .flatMap((r) =>
      r.questions
        .filter((q) => q.answered > 0)
        .map((q) => ({
          quizTitle: r.quizTitle,
          text: q.text,
          accuracy: pctOf(q.correct, q.answered),
          answered: q.answered,
        }))
    )
    .sort((a, b) => a.accuracy - b.accuracy || b.answered - a.answered)
    .slice(0, 5);

  return {
    totalSessions: results.length,
    totalParticipants: participants,
    avgScorePct: scoreN ? Math.round(scoreSum / scoreN) : 0,
    completionPct: pctOf(answeredSum, possibleSum),
    trend: perSession.slice(-10).map(({ r, avgPct }, i) => ({
      label: String(i + 1),
      title: r.quizTitle,
      pct: avgPct,
    })),
    hardest,
    recent: perSession
      .slice(-8)
      .reverse()
      .map(({ r, avgPct }) => ({
        id: r.id,
        title: r.quizTitle,
        endedAt: r.endedAt,
        players: r.players.length,
        avgPct,
      })),
  };
}
