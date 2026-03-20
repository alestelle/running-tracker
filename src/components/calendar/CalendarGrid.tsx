"use client";
import { StravaActivity } from "@/types/strava";
import { formatDistance, formatPace } from "@/lib/format";
import { useState } from "react";

interface Props {
  activities: StravaActivity[];
  year: number;
  month: number;
}

export default function CalendarGrid({ activities, year, month }: Props) {
  const [tooltip, setTooltip] = useState<{ day: number; acts: StravaActivity[] } | null>(null);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const byDay: Record<number, StravaActivity[]> = {};
  activities.forEach((a) => {
    const d = new Date(a.start_date_local);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      byDay[day] = byDay[day] ? [...byDay[day], a] : [a];
    }
  });

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div>
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((d) => (
          <div key={d} className="text-center text-xs text-gray-400 py-2 font-medium">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          const runs = day ? byDay[day] ?? [] : [];
          const totalDist = runs.reduce((s, a) => s + a.distance, 0);
          const totalMovingTime = runs.reduce((s, a) => s + a.moving_time, 0);
          const avgSpeed = totalDist > 0 && totalMovingTime > 0 ? totalDist / totalMovingTime : 0;
          return (
            <div
              key={i}
              className={`relative aspect-square rounded-lg flex flex-col items-center justify-start p-1 cursor-pointer transition-colors ${
                day
                  ? runs.length > 0
                    ? "bg-orange-50 hover:bg-orange-100 border border-orange-200"
                    : "bg-white hover:bg-gray-50 border border-gray-100"
                  : ""
              }`}
              onClick={() => day && runs.length > 0 && setTooltip(tooltip?.day === day ? null : { day, acts: runs })}
            >
              {day && (
                <>
                  <span className={`text-xs font-medium ${runs.length > 0 ? "text-orange-600" : "text-gray-400"}`}>
                    {day}
                  </span>
                  {runs.length > 0 && (
                    <>
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-0.5" />
                      <span className="text-[10px] text-orange-500 font-medium mt-0.5 leading-tight">
                        {(totalDist / 1000).toFixed(1)}k
                      </span>
                      <span className="text-[9px] text-orange-400 leading-tight">
                        {formatPace(avgSpeed)}
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div className="mt-4 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-sm font-semibold text-gray-700 mb-3">{month + 1}월 {tooltip.day}일</p>
          <div className="space-y-3">
            {tooltip.acts.map((a) => (
              <div key={a.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-700 font-medium">{a.name}</span>
                <div className="flex gap-3 text-gray-500">
                  <span>{formatDistance(a.distance)}</span>
                  <span>{formatPace(a.average_speed)}/km</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
