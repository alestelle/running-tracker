"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { StravaActivity } from "@/types/strava";
import { getISOWeek } from "date-fns";

export default function WeeklyDistanceChart({ activities }: { activities: StravaActivity[] }) {
  // Last 12 weeks
  const weeks: Record<string, number> = {};
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i * 7);
    const key = `${d.getFullYear()}-W${String(getISOWeek(d)).padStart(2, "0")}`;
    weeks[key] = 0;
  }

  activities.forEach((a) => {
    const d = new Date(a.start_date_local);
    const key = `${d.getFullYear()}-W${String(getISOWeek(d)).padStart(2, "0")}`;
    if (key in weeks) weeks[key] += a.distance / 1000;
  });

  const data = Object.entries(weeks).map(([week, dist]) => ({
    week: week.split("-W")[1] + "주",
    dist: parseFloat(dist.toFixed(2)),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="week" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} unit="k" />
        <Tooltip formatter={(v: number) => [`${v} km`, "거리"]} />
        <Bar dataKey="dist" fill="#f97316" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
