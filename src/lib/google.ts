import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from 'jose';

const JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
let remoteKeys: JWTVerifyGetKey | undefined;

export interface GoogleIdentity {
  email: string;
  name: string;
}

/**
 * Verifies a Firebase ID token (signature, issuer, audience, expiry) and returns the
 * signed-in person's verified email and name. Throws if anything is wrong.
 */
export async function verifyFirebaseIdToken(
  idToken: string,
  projectId: string,
  keys?: JWTVerifyGetKey
): Promise<GoogleIdentity> {
  const { payload } = await jwtVerify(idToken, keys ?? (remoteKeys ??= createRemoteJWKSet(new URL(JWKS_URL))), {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
    algorithms: ['RS256'],
  });
  const email = typeof payload.email === 'string' ? payload.email.toLowerCase() : '';
  if (!email || payload.email_verified !== true) throw new Error('Email is not verified');
  const firebase = payload.firebase as { sign_in_provider?: string } | undefined;
  if (firebase?.sign_in_provider !== 'google.com') throw new Error('Not a Google sign-in');
  const name = typeof payload.name === 'string' && payload.name.trim() ? payload.name.trim() : email.split('@')[0];
  return { email, name };
}
