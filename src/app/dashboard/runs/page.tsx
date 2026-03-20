"use client";
import { useEffect, useState } from "react";
import { StravaActivity } from "@/types/strava";
import RunCard from "@/components/runs/RunCard";

export default function RunsPage() {
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const PER_PAGE = 18;

  useEffect(() => {
    fetch("/api/strava/activities?per_page=200")
      .then((r) => r.json())
      .then((data) => { setActivities(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const total = activities.length;
  const totalPages = Math.ceil(total / PER_PAGE);
  const paged = activities.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">전체 기록</h1>
        {!loading && <span className="text-sm text-gray-400">총 {total}회</span>}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {paged.map((a) => <RunCard key={a.id} activity={a} />)}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40">
                이전
              </button>
              <span className="text-sm text-gray-500">{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40">
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
