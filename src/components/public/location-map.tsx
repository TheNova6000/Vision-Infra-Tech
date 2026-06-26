"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationMapProps {
  latitude: number;
  longitude: number;
  label: string;
  height?: string;
  zoom?: number;
}

export function LocationMap({
  latitude,
  longitude,
  label,
  height = "300px",
  zoom = 15,
}: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center: [latitude, longitude],
        zoom,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        className: "",
        html: `<div style="
          width: 32px; height: 32px;
          background: #1e40af;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        ">📍</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      L.marker([latitude, longitude], { icon })
        .addTo(map)
        .bindPopup(`<strong>${label}</strong>`);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, label, zoom]);

  return (
    <div
      ref={mapRef}
      style={{ height }}
      className="w-full rounded-lg overflow-hidden border"
    />
  );
}
