export const dynamic = "force-dynamic";

import { getSession } from "@/lib/session";
import { fetchActivity } from "@/lib/strava";
import { formatDate, formatDistance, formatDuration, formatPace } from "@/lib/format";
import PaceAnalysis from "@/components/runs/PaceAnalysis";
import MapWrapper from "@/components/map/MapWrapper";
import polyline from "@mapbox/polyline";
import Link from "next/link";

export default async function RunDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  const activity = await fetchActivity(session!.accessToken, id);

  const coords: [number, number][] =
    activity.map?.polyline
      ? polyline.decode(activity.map.polyline)
      : activity.map?.summary_polyline
      ? polyline.decode(activity.map.summary_polyline)
      : [];

  const stats = [
    { label: "거리", value: formatDistance(activity.distance) },
    { label: "이동 시간", value: formatDuration(activity.moving_time) },
    { label: "총 시간", value: formatDuration(activity.elapsed_time) },
    { label: "평균 페이스", value: `${formatPace(activity.average_speed)}/km` },
    { label: "최고 페이스", value: `${formatPace(activity.max_speed)}/km` },
    { label: "고도 상승", value: `${Math.round(activity.total_elevation_gain)} m` },
    ...(activity.average_heartrate ? [{ label: "평균 심박", value: `${Math.round(activity.average_heartrate)} bpm` }] : []),
    ...(activity.max_heartrate ? [{ label: "최고 심박", value: `${Math.round(activity.max_heartrate)} bpm` }] : []),
    ...(activity.calories ? [{ label: "칼로리", value: `${Math.round(activity.calories)} kcal` }] : []),
  ];

  return (
    <div className="p-6 max-w-3xl">
      <Link href="/dashboard/runs" className="text-sm text-gray-400 hover:text-gray-600 mb-4 inline-block">
        ← 목록으로
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{activity.name}</h1>
      <p className="text-gray-400 text-sm mb-6">{formatDate(activity.start_date_local)}</p>

      <div className="mb-6">
        <MapWrapper coords={coords} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">기록 요약</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-xs text-gray-400 mb-0.5">{s.label}</p>
              <p className="font-bold text-gray-900">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {activity.splits_metric && activity.splits_metric.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <PaceAnalysis splits={activity.splits_metric} />
        </div>
      )}
    </div>
  );
}
