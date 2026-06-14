import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/lib/auth";
import { getSiteContent, saveSiteContent } from "@/app/lib/db";
import { mergeSiteContent } from "@/app/lib/siteContent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();
    const content = await getSiteContent();
    return NextResponse.json({ content });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }

    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const { content } = await request.json();
    const merged = mergeSiteContent(content);
    await saveSiteContent(merged);
    return NextResponse.json({ content: merged });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }

    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
