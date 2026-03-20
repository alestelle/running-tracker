import { getSessionFromRequest, refreshIfNeeded, createSession, setSessionCookie } from "@/lib/session";
import { fetchActivity } from "@/lib/strava";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session?.accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const refreshed = await refreshIfNeeded(session);
  if (!refreshed) return NextResponse.json({ error: "Token refresh failed" }, { status: 401 });

  const { id } = await params;
  const activity = await fetchActivity(refreshed.accessToken, id);
  const res = NextResponse.json(activity);

  if (refreshed.accessToken !== session.accessToken) {
    const newToken = await createSession(refreshed);
    const cookie = setSessionCookie(newToken);
    res.cookies.set(cookie.name, cookie.value, cookie.options as Parameters<typeof res.cookies.set>[2]);
  }

  return res;
}
