"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Property, Project } from "@/types/database";
import { formatCurrency, PROPERTY_STATUS_LABELS } from "@/lib/constants";

interface PropertiesMapProps {
  properties: Property[];
  projects: Project[];
  height?: string;
  zoom?: number;
}

const STATUS_COLORS: Record<string, string> = {
  available: "#22c55e",
  reserved: "#f59e0b",
  sold: "#ef4444",
  blocked: "#6b7280",
  under_registration: "#3b82f6",
};

export function PropertiesMap({
  properties,
  projects,
  height = "400px",
  zoom = 11,
}: PropertiesMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const projectLocations = projects
        .filter((p) => p.latitude && p.longitude)
        .map((p) => [p.latitude!, p.longitude!] as [number, number]);

      const center: [number, number] = projectLocations.length > 0
        ? projectLocations[0]
        : [17.385, 78.4867];

      const map = L.map(mapRef.current, {
        center,
        zoom,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      // Add project markers
      projects
        .filter((p) => p.latitude && p.longitude)
        .forEach((project) => {
          const projectProps = properties.filter(
            (pr) => pr.project_id === project.id
          );
          const avail = projectProps.filter(
            (pr) => pr.status === "available"
          ).length;
          const total = projectProps.length;

          const icon = L.divIcon({
            className: "",
            html: `<div style="
              width: 40px; height: 40px;
              background: #1e40af;
              border: 3px solid white;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 16px;
              font-weight: bold;
            ">${avail}</div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          });

          const marker = L.marker([project.latitude!, project.longitude!], {
            icon,
          })
            .addTo(map)
            .bindPopup(`
              <div style="font-family:sans-serif;min-width:200px">
                <strong style="font-size:14px">${project.name}</strong><br/>
                <span style="font-size:12px;color:#666">
                  ${project.location}, ${project.city}
                </span><br/>
                <span style="font-size:12px;color:#22c55e;font-weight:600">
                  ${avail} available
                </span>
                <span style="font-size:12px;color:#666"> · </span>
                <span style="font-size:12px;color:#ef4444;font-weight:600">
                  ${total - avail} sold/reserved
                </span>
              </div>
            `);
        });

      // Fit bounds to show all project markers
      if (projectLocations.length > 1) {
        const bounds = L.latLngBounds(projectLocations);
        map.fitBounds(bounds, { padding: [50, 50] });
      }

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [properties, projects, zoom]);

  return (
    <div
      ref={mapRef}
      style={{ height }}
      className="w-full rounded-lg overflow-hidden border"
    />
  );
}
