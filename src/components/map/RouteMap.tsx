"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, Polyline, CircleMarker, useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";

// Fix Leaflet default icon issue in webpack
import L from "leaflet";
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function FitBounds({ coords }: { coords: LatLngExpression[] }) {
  const map = useMap();
  useEffect(() => {
    if (coords.length > 0) {
      map.fitBounds(coords as [number, number][], { padding: [20, 20] });
    }
  }, [map, coords]);
  return null;
}

interface Props {
  coords: [number, number][];
}

export default function RouteMap({ coords }: Props) {
  if (coords.length === 0) {
    return (
      <div className="h-72 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
        GPS 데이터가 없습니다
      </div>
    );
  }

  const start = coords[0];
  const end = coords[coords.length - 1];

  return (
    <MapContainer
      center={start}
      zoom={14}
      style={{ height: "300px", width: "100%", borderRadius: "12px" }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline positions={coords} color="#f97316" weight={3} opacity={0.8} />
      <CircleMarker center={start} radius={7} fillColor="#22c55e" color="#fff" weight={2} fillOpacity={1} />
      <CircleMarker center={end} radius={7} fillColor="#ef4444" color="#fff" weight={2} fillOpacity={1} />
      <FitBounds coords={coords} />
    </MapContainer>
  );
}
