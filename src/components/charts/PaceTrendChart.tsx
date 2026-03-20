"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { StravaActivity } from "@/types/strava";

function speedToPace(speed: number) {
  if (!speed) return 0;
  return parseFloat((1000 / speed / 60).toFixed(2));
}

function formatPaceLabel(val: number) {
  const min = Math.floor(val);
  const sec = Math.round((val - min) * 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export default function PaceTrendChart({ activities }: { activities: StravaActivity[] }) {
  const data = [...activities]
    .sort((a, b) => new Date(a.start_date_local).getTime() - new Date(b.start_date_local).getTime())
    .map((a) => ({
      date: new Date(a.start_date_local).toLocaleDateString("ko-KR", { month: "short", day: "numeric" }),
      pace: speedToPace(a.average_speed),
    }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
        <YAxis
          reversed
          tick={{ fontSize: 11 }}
          tickFormatter={formatPaceLabel}
          domain={["auto", "auto"]}
        />
        <Tooltip formatter={(v: number) => [formatPaceLabel(v) + " /km", "페이스"]} />
        <Line type="monotone" dataKey="pace" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
