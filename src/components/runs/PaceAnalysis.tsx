import { StravaSplit } from "@/types/strava";
import { formatPace } from "@/lib/format";

export default function PaceAnalysis({ splits }: { splits: StravaSplit[] }) {
  if (!splits || splits.length === 0) return null;

  const avgSpeed = splits.reduce((s, sp) => s + sp.average_speed, 0) / splits.length;

  return (
    <div>
      <h3 className="font-semibold text-gray-800 mb-3">구간별 페이스</h3>
      <div className="space-y-2">
        {splits.map((split) => {
          const pace = formatPace(split.average_speed);
          const relSpeed = split.average_speed / avgSpeed;
          const barWidth = Math.min(100, Math.max(10, relSpeed * 100));

          return (
            <div key={split.split} className="flex items-center gap-3">
              <span className="text-xs text-gray-400 w-10 shrink-0">{split.split} km</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: relSpeed >= 1 ? "#f97316" : "#fdba74",
                  }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700 w-14 text-right">{pace}/km</span>
              {split.average_heartrate && (
                <span className="text-xs text-red-400 w-14 text-right">♥ {Math.round(split.average_heartrate)}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
