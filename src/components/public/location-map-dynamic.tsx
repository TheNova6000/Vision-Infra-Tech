"use client";

import dynamic from "next/dynamic";

const LocationMap = dynamic(
  () => import("./location-map").then((m) => m.LocationMap),
  { ssr: false }
);

interface LocationMapDynamicProps {
  latitude: number;
  longitude: number;
  label: string;
  height?: string;
  zoom?: number;
}

export function LocationMapDynamic(props: LocationMapDynamicProps) {
  return <LocationMap {...props} />;
}
