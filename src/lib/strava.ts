import { StravaActivity } from "@/types/strava";

const BASE = "https://www.strava.com/api/v3";

async function stravaFetch(token: string, path: string) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Strava API error: ${res.status}`);
  return res.json();
}

export async function fetchActivities(
  token: string,
  params: { before?: number; after?: number; page?: number; per_page?: number } = {}
): Promise<StravaActivity[]> {
  const query = new URLSearchParams();
  if (params.before) query.set("before", String(params.before));
  if (params.after) query.set("after", String(params.after));
  query.set("page", String(params.page ?? 1));
  query.set("per_page", String(params.per_page ?? 60));
  const data = await stravaFetch(token, `/athlete/activities?${query}`);
  return (data as StravaActivity[]).filter(
    (a) => a.sport_type === "Run" || a.type === "Run"
  );
}

export async function fetchActivity(
  token: string,
  id: string
): Promise<StravaActivity> {
  return stravaFetch(token, `/activities/${id}`);
}
