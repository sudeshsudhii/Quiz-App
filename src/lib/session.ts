import { cookies } from 'next/headers';
import { verifyToken, type UserSession } from './auth';

export const SESSION_COOKIE = 'quiz_session';

/** Returns the signed-in user from the session cookie, or null. */
export async function getSessionUser(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}
