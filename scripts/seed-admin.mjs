import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { randomBytes, scryptSync } from "node:crypto";
import { neon } from "@neondatabase/serverless";

function loadEnvFile(path) {
  if (!existsSync(path)) {
    return;
  }

  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const rawValue = trimmed.slice(index + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

loadEnvFile(resolve(".env.local"));

const databaseUrl = process.env.DATABASE_URL;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing. Paste your Neon connection string into .env.local first.");
}

if (!adminEmail || !adminPassword) {
  throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required.");
}

const sql = neon(databaseUrl);

await sql`
  CREATE TABLE IF NOT EXISTS site_content (
    key text PRIMARY KEY,
    data jsonb NOT NULL,
    updated_at timestamptz NOT NULL DEFAULT now()
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS leads (
    id bigserial PRIMARY KEY,
    name text NOT NULL,
    phone text NOT NULL,
    email text NOT NULL,
    message text NOT NULL,
    source text NOT NULL DEFAULT 'website',
    created_at timestamptz NOT NULL DEFAULT now()
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS admins (
    id bigserial PRIMARY KEY,
    email text UNIQUE NOT NULL,
    password_hash text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )
`;

await sql`
  INSERT INTO site_content (key, data)
  VALUES ('main', '{}'::jsonb)
  ON CONFLICT (key) DO NOTHING
`;

await sql`
  INSERT INTO admins (email, password_hash)
  VALUES (${adminEmail.toLowerCase()}, ${hashPassword(adminPassword)})
  ON CONFLICT (email)
  DO UPDATE SET password_hash = EXCLUDED.password_hash
`;

console.log(`Admin ready: ${adminEmail}`);
