import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/lib/auth";
import { ensureSchema, getSql } from "@/app/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();
    const sql = getSql();
    if (!sql) {
      throw new Error("DATABASE_URL is not configured.");
    }

    await ensureSchema(sql);
    const leads = (await sql`
      SELECT id, name, phone, email, message, source, details, created_at
      FROM leads
      ORDER BY created_at DESC
      LIMIT 200
    `) as unknown[];

    return NextResponse.json({ leads });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }

    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
