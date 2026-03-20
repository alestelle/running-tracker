import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    {
      id: "strava",
      name: "Strava",
      type: "oauth",
      checks: ["state"],
      clientId: process.env.STRAVA_CLIENT_ID,
      clientSecret: process.env.STRAVA_CLIENT_SECRET,
      authorization: {
        url: "https://www.strava.com/oauth/authorize",
        params: {
          scope: "read,activity:read_all",
          approval_prompt: "auto",
          response_type: "code",
        },
      },
      token: {
        url: "https://www.strava.com/oauth/token",
        async request({ params, provider }) {
          const res = await fetch("https://www.strava.com/oauth/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: provider.clientId!,
              client_secret: provider.clientSecret!,
              code: params.code!,
              grant_type: "authorization_code",
            }),
          });
          const tokens = await res.json();
          return { tokens };
        },
      },
      userinfo: {
        url: "https://www.strava.com/api/v3/athlete",
        async request({ tokens }) {
          const res = await fetch("https://www.strava.com/api/v3/athlete", {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
          });
          return res.json();
        },
      },
      profile(profile) {
        return {
          id: String(profile.id),
          name: `${profile.firstname} ${profile.lastname}`,
          email: profile.email ?? `${profile.id}@strava.local`,
          image: profile.profile_medium ?? null,
        };
      },
    },
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        return token;
      }
      if (Date.now() < (token.expiresAt as number) * 1000) {
        return token;
      }
      // Refresh
      try {
        const res = await fetch("https://www.strava.com/oauth/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: process.env.STRAVA_CLIENT_ID!,
            client_secret: process.env.STRAVA_CLIENT_SECRET!,
            grant_type: "refresh_token",
            refresh_token: token.refreshToken as string,
          }),
        });
        const refreshed = await res.json();
        if (!res.ok) throw refreshed;
        return {
          ...token,
          accessToken: refreshed.access_token,
          refreshToken: refreshed.refresh_token ?? token.refreshToken,
          expiresAt: refreshed.expires_at,
        };
      } catch {
        return { ...token, error: "RefreshAccessTokenError" };
      }
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
  pages: { signIn: "/" },
});
