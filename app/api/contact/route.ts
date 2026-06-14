import { NextResponse } from "next/server";
import { ensureSchema, getSql } from "@/app/lib/db";

export const runtime = "nodejs";

const requiredDetailFields = [
  ["goals", "Select at least one goal."],
  ["motivation", "Answer what would feel different if you reached your goal."],
  ["trainingHistory", "Choose your fitness background."],
  ["healthHistory", "Enter your health history, or type none."],
  ["injuries", "Enter injuries or limitations, or type none."],
  ["availability", "Select at least one available training time."],
  ["preferredStart", "Choose when you want to start."],
  ["weeklySessions", "Choose sessions per week."],
  ["trainingPreference", "Choose a training preference."],
  ["nutritionSupport", "Choose whether you want nutrition support."],
  ["supplements", "Select at least one supplement option, including None."],
  ["biggestObstacle", "Answer what has made consistency hard."],
  ["readiness", "Choose how ready you are to begin."],
] as const;

function hasDetailValue(value: unknown) {
  if (Array.isArray(value)) return value.length > 0;
  return String(value || "").trim().length > 0;
}

export async function POST(request: Request) {
  const body = await request.json();
  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const email = String(body.email || "").trim();
  const message = String(body.message || "").trim();
  const details = typeof body.details === "object" && body.details ? body.details : {};

  if (!name || !phone || !email || !message) {
    const missing = [
      !name ? "Enter your name." : "",
      !phone ? "Enter your phone number." : "",
      !email ? "Enter your email address." : "",
      !message ? "Add anything else you want your trainer to know, or type none." : "",
    ].filter(Boolean);
    return NextResponse.json({ error: missing.join(" ") }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const missingDetails = requiredDetailFields
    .filter(([field]) => !hasDetailValue(details[field]))
    .map(([, error]) => error);

  if (missingDetails.length) {
    return NextResponse.json({ error: missingDetails.join(" ") }, { status: 400 });
  }

  const sql = getSql();
  if (!sql) {
    return NextResponse.json({ error: "Lead storage is not configured yet." }, { status: 503 });
  }

  await ensureSchema(sql);
  await sql`
    INSERT INTO leads (name, phone, email, message, source, details)
    VALUES (${name}, ${phone}, ${email}, ${message}, 'intake_form', ${JSON.stringify(details)}::jsonb)
  `;

  return NextResponse.json({ ok: true });
}
