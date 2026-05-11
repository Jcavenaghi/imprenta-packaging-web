import "server-only";
import { cookies } from "next/headers";
import {
  randomBytes,
  scrypt as _scrypt,
  createHmac,
  timingSafeEqual as cryptoTimingSafeEqual,
} from "crypto";
import { promisify } from "util";
import { redirect } from "next/navigation";

// Promisified scrypt for async/await usage.
const scrypt = promisify(_scrypt) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number
  // biome-ignore lint/complexity/noBannedTypes: see below
) => Promise<Buffer>;

const COOKIE_NAME = "admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

/**
 * Generate a password hash using Node.js crypto.scrypt.
 *
 * Scrypt is a memory-hard key derivation function that is more resistant to brute-force
 * attacks than simple hashing. We generate a random salt if one is not provided.
 */
export async function hashPassword(
  password: string,
  salt?: string
): Promise<{ hash: string; salt: string }> {
  const usedSalt = salt ?? randomBytes(16).toString("hex");
  const derived = (await scrypt(password, usedSalt, 64)) as Buffer;
  return {
    hash: derived.toString("hex"),
    salt: usedSalt,
  };
}

/**
 * Verify a password against a stored scrypt hash and salt.
 */
export async function verifyPassword(
  password: string,
  hash: string,
  salt: string
): Promise<boolean> {
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return timingSafeEqual(derived.toString("hex"), hash);
}

/**
 * Timing-safe comparison to prevent timing attacks.
 */
function timingSafeEqual(a: string, b: string): boolean {
  // convert strings to buffers
  const bufA = Buffer.from(a, "hex");
  const bufB = Buffer.from(b, "hex");
  if (bufA.length !== bufB.length) return false;
  return cryptoTimingSafeEqual(bufA, bufB);
}

/**
 * Create a signed session token for the admin user.
 *
 * The token format is `${username}|${signature}` where signature is an HMAC-SHA256
 * of the username using ADMIN_SESSION_SECRET. We encode the signature in hex
 * to simplify comparisons.
 */
export function createSessionToken(
  username: string,
  secret: string,
  issuedAt = Math.floor(Date.now() / 1000)
): string {
  // We generate a hex-encoded HMAC signature for the username.
  const hmac = createHmac("sha256", secret);
  hmac.update(`${username}|${issuedAt}`);
  const signature = hmac.digest("hex");
  return `${username}|${issuedAt}|${signature}`;
}

/**
 * Verify the session token stored in the cookie. Returns the username if valid.
 */
export function verifySessionToken(
  token: string,
  secret: string
): string | null {
  const [username, issuedAtRaw, signature] = token.split("|");
  if (!username || !issuedAtRaw || !signature) return null;
  const issuedAt = Number(issuedAtRaw);
  if (!Number.isInteger(issuedAt)) return null;
  const now = Math.floor(Date.now() / 1000);
  if (issuedAt > now || now - issuedAt > SESSION_MAX_AGE_SECONDS) {
    return null;
  }
  // Recreate the expected signature using the same algorithm.
  const expected = createSessionToken(username, secret, issuedAt).split("|")[2];
  return timingSafeEqual(expected, signature) ? username : null;
}

/**
 * Helper to get env vars for admin credentials and session secret.
 */
export function getAdminConfig() {
  const username = process.env.ADMIN_USERNAME;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const passwordSalt = process.env.ADMIN_PASSWORD_SALT;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  if (!username || !passwordHash || !passwordSalt || !sessionSecret) {
    throw new Error(
      "Missing admin environment variables (ADMIN_USERNAME, ADMIN_PASSWORD_HASH, ADMIN_PASSWORD_SALT, ADMIN_SESSION_SECRET)"
    );
  }
  return { username, passwordHash, passwordSalt, sessionSecret };
}

/**
 * Set admin session cookie.
 */
export async function setAdminSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

/**
 * Clear the admin session cookie.
 */
export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Check if the current request has a valid admin session.
 */
export async function getAdminSessionUsername(): Promise<string | null> {
  try {
    const { sessionSecret } = getAdminConfig();
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const username = verifySessionToken(token, sessionSecret);
    return username;
  } catch {
    return null;
  }
}

/**
 * Require admin session in server components or actions.
 *
 * Throws if session is invalid or missing.
 */
export async function requireAdminSession(): Promise<string> {
  const username = await getAdminSessionUsername();
  if (!username) {
    redirect("/admin");
  }
  return username;
}
