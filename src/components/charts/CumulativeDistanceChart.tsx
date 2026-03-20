"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { StravaActivity } from "@/types/strava";

export default function CumulativeDistanceChart({ activities }: { activities: StravaActivity[] }) {
  const sorted = [...activities].sort(
    (a, b) => new Date(a.start_date_local).getTime() - new Date(b.start_date_local).getTime()
  );

  // 월별로 누적 합산
  const monthMap: Record<string, number> = {};
  sorted.forEach((a) => {
    const d = new Date(a.start_date_local);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthMap[key] = (monthMap[key] ?? 0) + a.distance / 1000;
  });

  let cumulative = 0;
  const data = Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, dist]) => {
      cumulative += dist;
      const [year, month] = key.split("-");
      return {
        label: `${year.slice(2)}년 ${parseInt(month)}월`,
        total: parseFloat(cumulative.toFixed(1)),
      };
    });

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="label" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 11 }} unit="k" />
        <Tooltip formatter={(v) => [`${v} km`, "누적 거리"]} />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#f97316"
          strokeWidth={2}
          fill="url(#cumulativeGradient)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
