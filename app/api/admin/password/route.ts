import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/lib/auth";
import { ensureSchema, getSql } from "@/app/lib/db";
import { hashPassword, verifyPassword } from "@/app/lib/passwords";

export const runtime = "nodejs";

export async function PUT(request: Request) {
  try {
    const admin = await requireAdmin();
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword) {
      return NextResponse.json({ error: "Current password is required." }, { status: 400 });
    }

    if (!newPassword || String(newPassword).length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const sql = getSql();
    if (!sql) {
      throw new Error("DATABASE_URL is not configured.");
    }

    await ensureSchema(sql);
    const rows = (await sql`
      SELECT password_hash
      FROM admins
      WHERE id = ${admin.id}
      LIMIT 1
    `) as { password_hash: string }[];

    if (!rows[0] || !verifyPassword(String(currentPassword), rows[0].password_hash)) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }

    await sql`
      UPDATE admins
      SET password_hash = ${hashPassword(String(newPassword))}
      WHERE id = ${admin.id}
    `;

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }

    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
