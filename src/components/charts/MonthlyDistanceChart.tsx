"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { StravaActivity } from "@/types/strava";

export default function MonthlyDistanceChart({ activities }: { activities: StravaActivity[] }) {
  const months: Record<string, number> = {};
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    months[key] = 0;
  }

  activities.forEach((a) => {
    const d = new Date(a.start_date_local);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (key in months) months[key] += a.distance / 1000;
  });

  const data = Object.entries(months).map(([key, dist]) => ({
    month: key.split("-")[1] + "월",
    dist: parseFloat(dist.toFixed(2)),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} unit="k" />
        <Tooltip formatter={(v) => [`${v} km`, "거리"]} />
        <Bar dataKey="dist" fill="#fb923c" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
