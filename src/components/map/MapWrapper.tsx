"use client";
import dynamic from "next/dynamic";

const RouteMap = dynamic(() => import("./RouteMap"), {
  ssr: false,
  loading: () => <div className="h-72 bg-gray-100 rounded-xl animate-pulse" />,
});

export default function MapWrapper({ coords }: { coords: [number, number][] }) {
  return <RouteMap coords={coords} />;
}
