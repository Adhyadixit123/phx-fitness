import { NextResponse } from "next/server";
import { loginAdmin, setAdminCookie } from "@/app/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  try {
    const result = await loginAdmin(email, password);
    if (!result) {
      return NextResponse.json({ error: "Invalid admin login." }, { status: 401 });
    }

    await setAdminCookie(result.token);
    return NextResponse.json({ admin: result.admin });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
