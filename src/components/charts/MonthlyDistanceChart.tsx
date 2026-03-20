"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { StravaActivity } from "@/types/strava";

export default function MonthlyDistanceChart({ activities }: { activities: StravaActivity[] }) {
  // 첫 번째 활동 월부터 현재까지, 최대 60개월
  const now = new Date();
  const earliest = activities.length
    ? new Date(
        [...activities].sort(
          (a, b) => new Date(a.start_date_local).getTime() - new Date(b.start_date_local).getTime()
        )[0].start_date_local
      )
    : new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const startMonth = new Date(Math.max(
    new Date(earliest.getFullYear(), earliest.getMonth(), 1).getTime(),
    new Date(now.getFullYear(), now.getMonth() - 59, 1).getTime()
  ));

  const months: Record<string, number> = {};
  const cursor = new Date(startMonth);
  while (cursor <= now) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
    months[key] = 0;
    cursor.setMonth(cursor.getMonth() + 1);
  }

  activities.forEach((a) => {
    const d = new Date(a.start_date_local);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (key in months) months[key] += a.distance / 1000;
  });

  const data = Object.entries(months).map(([key, dist]) => ({
    month: `${key.split("-")[0].slice(2)}/${key.split("-")[1]}`,
    dist: parseFloat(dist.toFixed(2)),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }} barCategoryGap="20%">
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 11 }} unit="k" />
        <Tooltip formatter={(v) => [`${v} km`, "거리"]} />
        <Bar dataKey="dist" fill="#fb923c" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
