import { neon } from "@neondatabase/serverless";
import { defaultSiteContent, mergeSiteContent, SiteContent } from "./siteContent";
import { hashPassword } from "./passwords";

type SqlClient = ReturnType<typeof neon>;

let schemaReady = false;

export function getSql(): SqlClient | null {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  return neon(databaseUrl);
}

export async function ensureSchema(sql: SqlClient) {
  if (schemaReady) {
    return;
  }

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
      details jsonb NOT NULL DEFAULT '{}'::jsonb,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `;

  await sql`
    ALTER TABLE leads
    ADD COLUMN IF NOT EXISTS details jsonb NOT NULL DEFAULT '{}'::jsonb
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
    VALUES ('main', ${JSON.stringify(defaultSiteContent)}::jsonb)
    ON CONFLICT (key) DO NOTHING
  `;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const passwordHash = hashPassword(adminPassword);
    await sql`
      INSERT INTO admins (email, password_hash)
      VALUES (${adminEmail.toLowerCase()}, ${passwordHash})
      ON CONFLICT (email) DO NOTHING
    `;
  }

  schemaReady = true;
}

export async function getSiteContent(): Promise<SiteContent> {
  const sql = getSql();
  if (!sql) {
    return defaultSiteContent;
  }

  try {
    await ensureSchema(sql);
    const rows = (await sql`SELECT data FROM site_content WHERE key = 'main' LIMIT 1`) as { data: Partial<SiteContent> }[];
    return mergeSiteContent(rows[0]?.data as Partial<SiteContent> | undefined);
  } catch (error) {
    console.error("Failed to load site content", error);
    return defaultSiteContent;
  }
}

export async function saveSiteContent(content: SiteContent) {
  const sql = getSql();
  if (!sql) {
    throw new Error("DATABASE_URL is not configured.");
  }

  await ensureSchema(sql);
  await sql`
    INSERT INTO site_content (key, data, updated_at)
    VALUES ('main', ${JSON.stringify(mergeSiteContent(content))}::jsonb, now())
    ON CONFLICT (key)
    DO UPDATE SET data = EXCLUDED.data, updated_at = now()
  `;
}
