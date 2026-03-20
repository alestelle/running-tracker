import { getSession } from "@/lib/session";
import { fetchActivities } from "@/lib/strava";
import { formatDistance, formatPace } from "@/lib/format";
import RunCard from "@/components/runs/RunCard";

export default async function DashboardPage() {
  const session = await getSession();
  const activities = await fetchActivities(session!.accessToken, { per_page: 30 });

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());

  const monthRuns = activities.filter((a) => new Date(a.start_date_local) >= startOfMonth);
  const weekRuns = activities.filter((a) => new Date(a.start_date_local) >= startOfWeek);
  const totalMonthDist = monthRuns.reduce((s, a) => s + a.distance, 0);
  const avgPace = activities.length
    ? activities.reduce((s, a) => s + a.average_speed, 0) / activities.length
    : 0;
  const longest = activities.reduce((max, a) => (a.distance > max ? a.distance : max), 0);

  return (
    <div className="p-6 max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">대시보드</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "이번 달 거리", value: formatDistance(totalMonthDist), sub: `${monthRuns.length}회` },
          { label: "이번 주 러닝", value: `${weekRuns.length}회`, sub: formatDistance(weekRuns.reduce((s, a) => s + a.distance, 0)) },
          { label: "평균 페이스", value: formatPace(avgPace), sub: "/km" },
          { label: "최장 거리", value: formatDistance(longest), sub: "단일 기록" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-gray-800 mb-4">최근 러닝</h2>
      {activities.length === 0 ? (
        <p className="text-gray-400 text-sm">기록이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.slice(0, 6).map((a) => <RunCard key={a.id} activity={a} />)}
        </div>
      )}
    </div>
  );
}
