import { getSessionFromRequest, refreshIfNeeded, createSession, setSessionCookie } from "@/lib/session";
import { fetchActivities, fetchAllActivities } from "@/lib/strava";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session?.accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const refreshed = await refreshIfNeeded(session);
  if (!refreshed) return NextResponse.json({ error: "Token refresh failed" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  let data;

  if (searchParams.get("all") === "true") {
    data = await fetchAllActivities(refreshed.accessToken);
  } else {
    data = await fetchActivities(refreshed.accessToken, {
      before: searchParams.get("before") ? Number(searchParams.get("before")) : undefined,
      after: searchParams.get("after") ? Number(searchParams.get("after")) : undefined,
      page: Number(searchParams.get("page") ?? 1),
      per_page: Number(searchParams.get("per_page") ?? 60),
    });
  }

  const res = NextResponse.json(data);

  // 토큰이 갱신됐으면 쿠키 업데이트
  if (refreshed.accessToken !== session.accessToken) {
    const newToken = await createSession(refreshed);
    const cookie = setSessionCookie(newToken);
    res.cookies.set(cookie.name, cookie.value, cookie.options as Parameters<typeof res.cookies.set>[2]);
  }

  return res;
}
