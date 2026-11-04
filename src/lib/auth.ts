import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { getPool } from './db';

export interface UserSession {
  id: string;
  name: string;
  email: string;
}

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]), 'utf-8');
  }
}

interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

function getLocalUsers(): StoredUser[] {
  ensureDataDir();
  try {
    const content = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(content) as StoredUser[];
  } catch {
    return [];
  }
}

function saveLocalUsers(users: StoredUser[]) {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) return false;
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

const SECRET = process.env.NEXTAUTH_SECRET || 'quizportal-super-secret-key-32-chars-long';

export function createToken(payload: UserSession): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): UserSession | null {
  try {
    const [header, body, signature] = token.split('.');
    if (!header || !body || !signature) return null;
    const expected = crypto.createHmac('sha256', SECRET).update(`${header}.${body}`).digest('base64url');
    if (expected !== signature) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
    if (payload.exp && Date.now() > payload.exp) return null;
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
    };
  } catch {
    return null;
  }
}

export async function findUserByEmail(email: string) {
  const normalizedEmail = email.toLowerCase().trim();
  const pool = getPool();
  if (pool) {
    const { rows } = await pool.query(
      'select id, name, email, password_hash from app_users where email = $1',
      [normalizedEmail]
    );
    const row = rows[0];
    return row ? { id: row.id as string, name: row.name as string, email: row.email as string, passwordHash: row.password_hash as string } : null;
  }
  return getLocalUsers().find((u) => u.email === normalizedEmail) || null;
}

export async function createUser(name: string, email: string, password: string) {
  const normalizedEmail = email.toLowerCase().trim();
  const passwordHash = hashPassword(password);
  const id = crypto.randomUUID();

  const pool = getPool();
  if (pool) {
    await pool.query(
      'insert into app_users (id, name, email, password_hash) values ($1, $2, $3, $4)',
      [id, name, normalizedEmail, passwordHash]
    );
    return { id, name, email: normalizedEmail };
  }

  const localUsers = getLocalUsers();
  const newUser: StoredUser = {
    id,
    name,
    email: normalizedEmail,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  localUsers.push(newUser);
  saveLocalUsers(localUsers);

  return { id: newUser.id, name: newUser.name, email: newUser.email };
}
