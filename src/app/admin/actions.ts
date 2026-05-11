"use server";

import {
  getAdminConfig,
  verifyPassword,
  createSessionToken,
  setAdminSessionCookie,
  clearAdminSessionCookie,
} from "@/lib/admin/auth";

/**
 * Server action to log in an admin. Accepts a FormData with `username` and `password` fields.
 * On success, sets a signed session cookie and returns { success: true }.
 * On failure, returns { error: string }.
 */
export async function login(formData: FormData) {
  const usernameInput = formData.get("username");
  const passwordInput = formData.get("password");

  if (typeof usernameInput !== "string" || typeof passwordInput !== "string") {
    return { error: "Credenciales invalidas" };
  }

  const { username, passwordHash, passwordSalt, sessionSecret } = getAdminConfig();
  const providedUsername = usernameInput.trim();
  const validPassword = await verifyPassword(passwordInput, passwordHash, passwordSalt);

  if (providedUsername !== username || !validPassword) {
    return { error: "Usuario o contrasena incorrectos" };
  }

  const token = createSessionToken(username, sessionSecret);
  await setAdminSessionCookie(token);
  return { success: true };
}

/**
 * Server action to log out an admin. Clears the session cookie.
 */
export async function logout() {
  await clearAdminSessionCookie();
  return { success: true };
}
