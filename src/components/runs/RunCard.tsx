import Link from "next/link";
import { StravaActivity } from "@/types/strava";
import { formatDistance, formatDuration, formatPace } from "@/lib/format";

export default function RunCard({ activity }: { activity: StravaActivity }) {
  const date = new Date(activity.start_date_local);
  const dateStr = date.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" });

  return (
    <Link href={`/dashboard/runs/${activity.id}`}>
      <div className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-orange-200 transition-all">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-semibold text-gray-900 text-sm">{activity.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{dateStr}</p>
          </div>
          <span className="text-lg">🏃</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <p className="text-xs text-gray-400">거리</p>
            <p className="font-bold text-gray-900">{formatDistance(activity.distance)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">시간</p>
            <p className="font-bold text-gray-900">{formatDuration(activity.moving_time)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">페이스</p>
            <p className="font-bold text-gray-900">{formatPace(activity.average_speed)}/km</p>
          </div>
        </div>
        {activity.average_heartrate && (
          <div className="mt-2 pt-2 border-t border-gray-50 flex items-center gap-1">
            <span className="text-xs text-red-400">♥</span>
            <span className="text-xs text-gray-500">{Math.round(activity.average_heartrate)} bpm</span>
          </div>
        )}
      </div>
    </Link>
  );
}
