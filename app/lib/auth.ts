import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { getSql, ensureSchema } from "./db";
import { verifyPassword } from "./passwords";

const cookieName = "phx_admin_session";

export type AdminSession = {
  id: number;
  email: string;
  exp: number;
};

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET || "dev-only-change-me";
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function createSessionToken(admin: Omit<AdminSession, "exp">) {
  const payload = Buffer.from(
    JSON.stringify({
      ...admin,
      exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
    }),
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token?: string): AdminSession | null {
  if (!token) {
    return null;
  }

  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return null;
  }

  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return null;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as AdminSession;
    return session.exp > Date.now() ? session : null;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(cookieName)?.value);
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    throw new Response("Unauthorized", { status: 401 });
  }

  return session;
}

export async function loginAdmin(email: string, password: string) {
  const sql = getSql();
  if (!sql) {
    throw new Error("DATABASE_URL is not configured.");
  }

  await ensureSchema(sql);
  const rows = (await sql`
    SELECT id, email, password_hash
    FROM admins
    WHERE email = ${email.toLowerCase()}
    LIMIT 1
  `) as { id: number; email: string; password_hash: string }[];

  const admin = rows[0];
  if (!admin || !verifyPassword(password, admin.password_hash)) {
    return null;
  }

  return {
    token: createSessionToken({ id: admin.id, email: admin.email }),
    admin: { id: admin.id, email: admin.email },
  };
}

export async function setAdminCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}
