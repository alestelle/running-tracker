"use client";
import { useEffect, useState } from "react";
import { StravaActivity } from "@/types/strava";
import WeeklyDistanceChart from "@/components/charts/WeeklyDistanceChart";
import MonthlyDistanceChart from "@/components/charts/MonthlyDistanceChart";
import CumulativeDistanceChart from "@/components/charts/CumulativeDistanceChart";
import PaceTrendChart from "@/components/charts/PaceTrendChart";

export default function ChartsPage() {
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"weekly" | "monthly" | "cumulative">("weekly");

  useEffect(() => {
    fetch("/api/strava/activities?all=true")
      .then((r) => r.json())
      .then((data) => { setActivities(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">차트 분석</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">누적 거리</h2>
              <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                {(["weekly", "monthly", "cumulative"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                      tab === t ? "bg-white text-orange-600 shadow-sm" : "text-gray-500"
                    }`}
                  >
                    {t === "weekly" ? "주간" : t === "monthly" ? "월간" : "누적"}
                  </button>
                ))}
              </div>
            </div>
            {tab === "weekly" ? (
              <WeeklyDistanceChart activities={activities} />
            ) : tab === "monthly" ? (
              <MonthlyDistanceChart activities={activities} />
            ) : (
              <CumulativeDistanceChart activities={activities} />
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-4">페이스 트렌드</h2>
            <PaceTrendChart activities={activities.slice(-30)} />
            <p className="text-xs text-gray-400 mt-2">최근 30회 기록 기준 · 낮을수록 빠름</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "총 러닝 횟수", value: `${activities.length}회` },
              { label: "총 거리", value: `${(activities.reduce((s, a) => s + a.distance, 0) / 1000).toFixed(1)} km` },
              { label: "총 시간", value: `${Math.round(activities.reduce((s, a) => s + a.moving_time, 0) / 3600)}시간` },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
                <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                <p className="text-xl font-bold text-gray-900">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
