import { getSessionFromRequest } from "@/lib/session";
import { fetchActivity } from "@/lib/strava";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session?.accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const activity = await fetchActivity(session.accessToken, id);
  return NextResponse.json(activity);
}
