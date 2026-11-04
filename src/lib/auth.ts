import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import prisma from './prisma';

export interface UserSession {
  id: string;
  name: string;
  email: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
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
  try {
    const dbUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (dbUser) return { ...dbUser, passwordHash: dbUser.password };
  } catch {
    // Database connection offline, fallback to local file store
  }

  const localUsers = getLocalUsers();
  return localUsers.find((u) => u.email === normalizedEmail) || null;
}

export async function createUser(name: string, email: string, password: string) {
  const normalizedEmail = email.toLowerCase().trim();
  const passwordHash = hashPassword(password);
  const id = crypto.randomUUID();

  try {
    const dbUser = await prisma.user.create({
      data: {
        id,
        name,
        email: normalizedEmail,
        password: passwordHash,
      },
    });
    return { id: dbUser.id, name: dbUser.name || name, email: dbUser.email };
  } catch {
    // Database connection offline, fallback to local file store
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

