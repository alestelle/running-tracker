"use client";
import { useEffect, useState } from "react";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import { StravaActivity } from "@/types/strava";

export default function CalendarPage() {
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());

  useEffect(() => {
    setLoading(true);
    const after = Math.floor(new Date(year, month, 1).getTime() / 1000);
    const before = Math.floor(new Date(year, month + 1, 1).getTime() / 1000);
    fetch(`/api/strava/activities?after=${after}&before=${before}&per_page=200`)
      .then((r) => r.json())
      .then((data) => { setActivities(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [year, month]);

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  const monthNames = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">달력</h1>
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 text-xl">‹</button>
          <span className="text-lg font-semibold text-gray-800 w-28 text-center">{year}년 {monthNames[month]}</span>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 text-xl">›</button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <CalendarGrid activities={activities} year={year} month={month} />
          <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              <span>러닝 기록 있음</span>
            </div>
            <span>총 {activities.length}회 러닝</span>
          </div>
        </div>
      )}
    </div>
  );
}
