import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

/**
 * Quiz storage.
 *
 * Mirrors the zero-config approach used for users in `auth.ts`: quizzes are
 * persisted to `data/quizzes.json` so the app works without a database.
 * The shapes match the Prisma `Quiz` / `Question` / `QuestionOption` models,
 * so swapping this module for a database-backed one later only touches this file.
 */

export type EditableQuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE';
export const QUESTION_TYPES: EditableQuestionType[] = ['MULTIPLE_CHOICE', 'TRUE_FALSE'];

export interface StoredOption {
  id: string;
  text: string;
  isCorrect: boolean;
  order: number;
}

export interface StoredQuestion {
  id: string;
  type: EditableQuestionType;
  text: string;
  timeLimit: number;
  points: number;
  order: number;
  explanation: string | null;
  options: StoredOption[];
}

export interface StoredQuiz {
  id: string;
  title: string;
  description: string | null;
  isPublished: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  questions: StoredQuestion[];
}

/** Payload accepted from the client when creating or updating a quiz. */
export interface QuizInput {
  title: string;
  description?: string | null;
  isPublished?: boolean;
  questions: {
    type: EditableQuestionType;
    text: string;
    timeLimit?: number;
    points?: number;
    explanation?: string | null;
    options: { text: string; isCorrect: boolean }[];
  }[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const QUIZZES_FILE = path.join(DATA_DIR, 'quizzes.json');

function readAll(): StoredQuiz[] {
  try {
    if (!fs.existsSync(QUIZZES_FILE)) return [];
    return JSON.parse(fs.readFileSync(QUIZZES_FILE, 'utf-8')) as StoredQuiz[];
  } catch {
    return [];
  }
}

function writeAll(quizzes: StoredQuiz[]) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  // Write to a temp file then rename so a crash mid-write can't corrupt the store.
  const tmp = `${QUIZZES_FILE}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(quizzes, null, 2), 'utf-8');
  fs.renameSync(tmp, QUIZZES_FILE);
}

// ---------- Validation ----------

export class QuizValidationError extends Error {}

const clampInt = (value: unknown, min: number, max: number, fallback: number) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
};

/** Validates and normalises untrusted input. Throws QuizValidationError. */
export function parseQuizInput(raw: unknown): QuizInput {
  if (!raw || typeof raw !== 'object') throw new QuizValidationError('Invalid request body');
  const body = raw as Record<string, unknown>;

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  if (!title) throw new QuizValidationError('Quiz title is required');
  if (title.length > 200) throw new QuizValidationError('Quiz title must be 200 characters or fewer');

  const description =
    typeof body.description === 'string' && body.description.trim()
      ? body.description.trim().slice(0, 2000)
      : null;

  if (!Array.isArray(body.questions)) throw new QuizValidationError('Questions must be a list');
  if (body.questions.length > 100) throw new QuizValidationError('A quiz can have at most 100 questions');

  const questions = body.questions.map((q, i) => {
    const label = `Question ${i + 1}`;
    if (!q || typeof q !== 'object') throw new QuizValidationError(`${label} is invalid`);
    const question = q as Record<string, unknown>;

    const type = question.type as EditableQuestionType;
    if (!QUESTION_TYPES.includes(type)) throw new QuizValidationError(`${label} has an unsupported type`);

    const text = typeof question.text === 'string' ? question.text.trim() : '';
    if (!text) throw new QuizValidationError(`${label} needs question text`);
    if (text.length > 500) throw new QuizValidationError(`${label} text must be 500 characters or fewer`);

    const rawOptions = Array.isArray(question.options) ? question.options : [];
    const options = rawOptions.map((o) => {
      const opt = (o ?? {}) as Record<string, unknown>;
      return {
        text: typeof opt.text === 'string' ? opt.text.trim().slice(0, 200) : '',
        isCorrect: opt.isCorrect === true,
      };
    });

    if (type === 'TRUE_FALSE') {
      if (options.length !== 2) throw new QuizValidationError(`${label} must have exactly True and False options`);
      if (options.filter((o) => o.isCorrect).length !== 1)
        throw new QuizValidationError(`${label} must mark either True or False as correct`);
    } else {
      if (options.length < 2 || options.length > 6)
        throw new QuizValidationError(`${label} needs between 2 and 6 answer options`);
      if (options.some((o) => !o.text)) throw new QuizValidationError(`${label} has an empty answer option`);
      if (!options.some((o) => o.isCorrect))
        throw new QuizValidationError(`${label} needs at least one correct answer`);
    }

    return {
      type,
      text,
      timeLimit: clampInt(question.timeLimit, 5, 300, 30),
      points: clampInt(question.points, 0, 1000, 100),
      explanation:
        typeof question.explanation === 'string' && question.explanation.trim()
          ? question.explanation.trim().slice(0, 1000)
          : null,
      options,
    };
  });

  const isPublished = body.isPublished === true;
  if (isPublished && questions.length === 0)
    throw new QuizValidationError('Add at least one question before publishing');

  return { title, description, isPublished, questions };
}

function buildQuestions(input: QuizInput): StoredQuestion[] {
  return input.questions.map((q, qi) => ({
    id: crypto.randomUUID(),
    type: q.type,
    text: q.text,
    timeLimit: q.timeLimit ?? 30,
    points: q.points ?? 100,
    order: qi,
    explanation: q.explanation ?? null,
    options:
      q.type === 'TRUE_FALSE'
        ? [
            { id: crypto.randomUUID(), text: 'True', isCorrect: q.options[0].isCorrect, order: 0 },
            { id: crypto.randomUUID(), text: 'False', isCorrect: q.options[1].isCorrect, order: 1 },
          ]
        : q.options.map((o, oi) => ({
            id: crypto.randomUUID(),
            text: o.text,
            isCorrect: o.isCorrect,
            order: oi,
          })),
  }));
}

// ---------- CRUD ----------

export function listQuizzes(authorId: string): StoredQuiz[] {
  return readAll()
    .filter((q) => q.authorId === authorId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getQuiz(id: string, authorId: string): StoredQuiz | null {
  return readAll().find((q) => q.id === id && q.authorId === authorId) ?? null;
}

export function createQuiz(authorId: string, input: QuizInput): StoredQuiz {
  const now = new Date().toISOString();
  const quiz: StoredQuiz = {
    id: crypto.randomUUID(),
    title: input.title,
    description: input.description ?? null,
    isPublished: input.isPublished ?? false,
    authorId,
    createdAt: now,
    updatedAt: now,
    questions: buildQuestions(input),
  };
  const all = readAll();
  all.push(quiz);
  writeAll(all);
  return quiz;
}

export function updateQuiz(id: string, authorId: string, input: QuizInput): StoredQuiz | null {
  const all = readAll();
  const index = all.findIndex((q) => q.id === id && q.authorId === authorId);
  if (index === -1) return null;
  const updated: StoredQuiz = {
    ...all[index],
    title: input.title,
    description: input.description ?? null,
    isPublished: input.isPublished ?? false,
    updatedAt: new Date().toISOString(),
    questions: buildQuestions(input),
  };
  all[index] = updated;
  writeAll(all);
  return updated;
}

export function deleteQuiz(id: string, authorId: string): boolean {
  const all = readAll();
  const remaining = all.filter((q) => !(q.id === id && q.authorId === authorId));
  if (remaining.length === all.length) return false;
  writeAll(remaining);
  return true;
}
