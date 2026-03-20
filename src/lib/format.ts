export function formatPace(speedMps: number, unit: "km" | "mi" = "km"): string {
  if (!speedMps || speedMps === 0) return "--:--";
  const metersPerUnit = unit === "km" ? 1000 : 1609.34;
  const secPerUnit = metersPerUnit / speedMps;
  const min = Math.floor(secPerUnit / 60);
  const sec = Math.round(secPerUnit % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export function formatDistance(meters: number, unit: "km" | "mi" = "km"): string {
  if (unit === "km") return (meters / 1000).toFixed(2) + " km";
  return (meters / 1609.34).toFixed(2) + " mi";
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}
