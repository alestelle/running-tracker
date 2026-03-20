import { getSessionFromRequest } from "@/lib/session";
import { fetchActivities } from "@/lib/strava";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session?.accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const activities = await fetchActivities(session.accessToken, {
    before: searchParams.get("before") ? Number(searchParams.get("before")) : undefined,
    after: searchParams.get("after") ? Number(searchParams.get("after")) : undefined,
    page: Number(searchParams.get("page") ?? 1),
    per_page: Number(searchParams.get("per_page") ?? 60),
  });
  return NextResponse.json(activities);
}
