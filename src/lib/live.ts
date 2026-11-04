import crypto from 'crypto';
import { getQuiz, type StoredQuiz } from './quizzes';
import { saveResult } from './results';

/**
 * Live quiz sessions, kept in memory (single server process).
 * Sessions are lost on restart, which is fine for short-lived live games.
 */

export type LiveStatus = 'LOBBY' | 'QUESTION' | 'REVEAL' | 'ENDED';

interface PlayerAnswer {
  optionIds: string[];
  correct: boolean;
  points: number;
}

interface Player {
  id: string;
  name: string;
  score: number;
  answers: Record<number, PlayerAnswer>;
}

interface LiveSession {
  code: string;
  hostId: string;
  quiz: StoredQuiz; // snapshot taken when the session starts
  status: LiveStatus;
  questionIndex: number;
  endsAt: number;
  players: Map<string, Player>;
  createdAt: number;
  saved: boolean;
}

const MAX_AGE_MS = 6 * 60 * 60 * 1000;
const MAX_PLAYERS = 300;

const g = globalThis as unknown as { __liveSessions?: Map<string, LiveSession> };
const sessions = (g.__liveSessions ??= new Map<string, LiveSession>());

export class LiveError extends Error {
  constructor(
    message: string,
    public status = 400
  ) {
    super(message);
  }
}

function cleanup() {
  const now = Date.now();
  for (const [code, s] of sessions) if (now - s.createdAt > MAX_AGE_MS) sessions.delete(code);
}

function getSession(code: string): LiveSession {
  const s = sessions.get(code);
  if (!s) throw new LiveError('Session not found. Check the code and try again.', 404);
  tick(s);
  return s;
}

/** Moves a running question to REVEAL once time is up or everyone has answered. */
function tick(s: LiveSession) {
  if (s.status !== 'QUESTION') return;
  const everyoneAnswered =
    s.players.size > 0 && [...s.players.values()].every((p) => p.answers[s.questionIndex]);
  if (Date.now() >= s.endsAt || everyoneAnswered) s.status = 'REVEAL';
}

/** Marks the game as over and stores its results once (games with no players are skipped). */
async function endGame(s: LiveSession) {
  s.status = 'ENDED';
  if (s.saved || s.players.size === 0) return;
  s.saved = true;
  const players = [...s.players.values()];
  try {
    await saveResult({
      code: s.code,
      quizId: s.quiz.id,
      quizTitle: s.quiz.title,
      hostId: s.hostId,
      maxPoints: s.quiz.questions.reduce((sum, q) => sum + q.points, 0),
      players: players.map((p) => {
        const answers = Object.values(p.answers);
        return {
          name: p.name,
          score: p.score,
          answered: answers.length,
          correct: answers.filter((a) => a.correct).length,
        };
      }),
      questions: s.quiz.questions.map((q, i) => {
        const answered = players.filter((p) => p.answers[i]);
        return {
          text: q.text,
          answered: answered.length,
          correct: answered.filter((p) => p.answers[i].correct).length,
        };
      }),
    });
  } catch (error) {
    console.error('Failed to save session results:', error);
  }
}

function startQuestion(s: LiveSession, index: number) {
  s.questionIndex = index;
  s.status = 'QUESTION';
  s.endsAt = Date.now() + s.quiz.questions[index].timeLimit * 1000;
}

// ---------- Commands ----------

export async function createSession(hostId: string, quizId: string): Promise<string> {
  cleanup();
  const quiz = await getQuiz(quizId, hostId);
  if (!quiz) throw new LiveError('Quiz not found', 404);
  if (quiz.questions.length === 0) throw new LiveError('Add at least one question before hosting');

  let code = '';
  do {
    code = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
  } while (sessions.has(code));

  sessions.set(code, {
    code,
    hostId,
    quiz,
    status: 'LOBBY',
    questionIndex: -1,
    endsAt: 0,
    players: new Map(),
    createdAt: Date.now(),
    saved: false,
  });
  return code;
}

export function joinSession(code: string, rawName: string): { playerId: string; name: string } {
  const s = getSession(code);
  const name = rawName.trim().slice(0, 20);
  if (!name) throw new LiveError('Please enter a nickname');
  if (s.status !== 'LOBBY') throw new LiveError('This game has already started');
  if (s.players.size >= MAX_PLAYERS) throw new LiveError('This game is full');
  const taken = [...s.players.values()].some((p) => p.name.toLowerCase() === name.toLowerCase());
  if (taken) throw new LiveError('That nickname is taken. Try another.');

  const id = crypto.randomUUID();
  s.players.set(id, { id, name, score: 0, answers: {} });
  return { playerId: id, name };
}

export function submitAnswer(code: string, playerId: string, optionIds: unknown) {
  const s = getSession(code);
  const player = s.players.get(playerId);
  if (!player) throw new LiveError('You are not in this game', 403);
  if (s.status !== 'QUESTION') throw new LiveError('Time is up for this question');
  if (player.answers[s.questionIndex]) throw new LiveError('You already answered');

  const q = s.quiz.questions[s.questionIndex];
  const valid = new Set(q.options.map((o) => o.id));
  const chosen = Array.isArray(optionIds)
    ? [...new Set(optionIds.filter((id): id is string => typeof id === 'string' && valid.has(id)))]
    : [];
  if (chosen.length === 0) throw new LiveError('Pick an answer');

  const correctIds = q.options.filter((o) => o.isCorrect).map((o) => o.id);
  const correct = chosen.length === correctIds.length && correctIds.every((id) => chosen.includes(id));

  let points = 0;
  if (correct) {
    const total = q.timeLimit * 1000;
    const remaining = Math.max(0, s.endsAt - Date.now());
    points = Math.round(q.points * (0.5 + 0.5 * (remaining / total)));
  }
  player.score += points;
  player.answers[s.questionIndex] = { optionIds: chosen, correct, points };
  tick(s);
}

export type HostAction = 'start' | 'reveal' | 'next' | 'end';

export async function hostAction(code: string, hostId: string, action: HostAction) {
  const s = getSession(code);
  if (s.hostId !== hostId) throw new LiveError('Only the host can do that', 403);

  switch (action) {
    case 'start':
      if (s.status !== 'LOBBY') throw new LiveError('Game already started');
      startQuestion(s, 0);
      break;
    case 'reveal':
      if (s.status === 'QUESTION') s.status = 'REVEAL';
      break;
    case 'next':
      if (s.status === 'REVEAL') {
        if (s.questionIndex + 1 >= s.quiz.questions.length) endGame(s);
        else startQuestion(s, s.questionIndex + 1);
      }
      break;
    case 'end':
      await endGame(s);
      break;
    default:
      throw new LiveError('Unknown action');
  }
}

// ---------- Views ----------

export interface LiveView {
  code: string;
  status: LiveStatus;
  title: string;
  questionIndex: number;
  totalQuestions: number;
  endsAt: number;
  serverNow: number;
  playerCount: number;
  question: null | {
    text: string;
    timeLimit: number;
    multi: boolean;
    options: { id: string; text: string }[];
  };
  /** Only set during REVEAL / ENDED. */
  reveal: null | {
    correctOptionIds: string[];
    explanation: string | null;
    answerCounts: Record<string, number>;
  };
  leaderboard: { name: string; score: number }[];
  me: null | {
    name: string;
    score: number;
    rank: number;
    answered: boolean;
    result: null | { correct: boolean; points: number };
  };
  host: null | { players: string[]; answeredCount: number };
}

export function getView(code: string, opts: { playerId?: string | null; hostId?: string | null }): LiveView {
  const s = getSession(code);
  const isHost = !!opts.hostId && opts.hostId === s.hostId;
  const players = [...s.players.values()];
  const ranked = [...players].sort((a, b) => b.score - a.score);
  const q = s.questionIndex >= 0 ? s.quiz.questions[s.questionIndex] : null;
  const showAnswers = s.status === 'REVEAL' || s.status === 'ENDED';
  const showQuestion = q && s.status !== 'LOBBY' && s.status !== 'ENDED';

  const me = opts.playerId ? s.players.get(opts.playerId) : undefined;
  const myAnswer = me && q ? me.answers[s.questionIndex] : undefined;

  let reveal: LiveView['reveal'] = null;
  if (q && s.status === 'REVEAL') {
    const answerCounts: Record<string, number> = {};
    for (const p of players) for (const id of p.answers[s.questionIndex]?.optionIds ?? []) {
      answerCounts[id] = (answerCounts[id] ?? 0) + 1;
    }
    reveal = {
      correctOptionIds: q.options.filter((o) => o.isCorrect).map((o) => o.id),
      explanation: q.explanation,
      answerCounts,
    };
  }
  void showAnswers;

  return {
    code: s.code,
    status: s.status,
    title: s.quiz.title,
    questionIndex: s.questionIndex,
    totalQuestions: s.quiz.questions.length,
    endsAt: s.endsAt,
    serverNow: Date.now(),
    playerCount: players.length,
    question:
      showQuestion && q
        ? {
            text: q.text,
            timeLimit: q.timeLimit,
            multi: q.type === 'MULTIPLE_CHOICE' && q.options.filter((o) => o.isCorrect).length > 1,
            options: q.options.map((o) => ({ id: o.id, text: o.text })),
          }
        : null,
    reveal,
    leaderboard: ranked.slice(0, 5).map((p) => ({ name: p.name, score: p.score })),
    me: me
      ? {
          name: me.name,
          score: me.score,
          rank: ranked.findIndex((p) => p.id === me.id) + 1,
          answered: !!myAnswer,
          result: myAnswer && s.status !== 'QUESTION' ? { correct: myAnswer.correct, points: myAnswer.points } : null,
        }
      : null,
    host: isHost
      ? {
          players: players.map((p) => p.name),
          answeredCount: players.filter((p) => q && p.answers[s.questionIndex]).length,
        }
      : null,
  };
}
