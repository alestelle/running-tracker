import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSession, setSessionCookie } from "@/lib/session";

export async function GET(req: NextRequest) {
  const jar = await cookies();
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const storedState = jar.get("oauth_state")?.value;

  jar.delete("oauth_state");

  if (!code || !state || state !== storedState) {
    return NextResponse.redirect(new URL("/?error=invalid_state", req.url));
  }

  // Exchange code for tokens
  const tokenRes = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.STRAVA_CLIENT_ID!,
      client_secret: process.env.STRAVA_CLIENT_SECRET!,
      code,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL("/?error=token_exchange", req.url));
  }

  const data = await tokenRes.json();

  const session = await createSession({
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: data.expires_at,
    user: {
      id: String(data.athlete.id),
      name: `${data.athlete.firstname} ${data.athlete.lastname}`,
      email: `${data.athlete.id}@strava.local`,
      image: data.athlete.profile_medium ?? "",
    },
  });

  const { name, value, options } = setSessionCookie(session);
  const response = NextResponse.redirect(new URL("/dashboard", req.url));
  response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2]);
  return response;
}
