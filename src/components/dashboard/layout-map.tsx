"use client";

import { useState, useMemo, useEffect } from "react";
import type { Property, Project } from "@/types/database";
import {
  PROPERTY_STATUS_LABELS,
  PROPERTY_FACING_LABELS,
  formatCurrency,
  formatArea,
} from "@/lib/constants";
import { X } from "lucide-react";

const STATUS_FILLS: Record<string, string> = {
  available: "#22c55e",
  reserved: "#f59e0b",
  sold: "#ef4444",
  blocked: "#6b7280",
  under_registration: "#3b82f6",
};

const STATUS_STROKES: Record<string, string> = {
  available: "#16a34a",
  reserved: "#d97706",
  sold: "#dc2626",
  blocked: "#4b5563",
  under_registration: "#2563eb",
};

interface LayoutMapProps {
  project: Project;
  properties: Property[];
  onSelectProperty?: (property: Property | null) => void;
  highlightPropertyId?: string;
}

export function LayoutMap({ project, properties, onSelectProperty, highlightPropertyId }: LayoutMapProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null);

  useEffect(() => {
    if (highlightPropertyId) {
      const prop = properties.find((p) => p.id === highlightPropertyId);
      if (prop) {
        setSelectedProperty(prop);
        onSelectProperty?.(prop);
      }
    }
  }, [highlightPropertyId, properties, onSelectProperty]);

  const { gridCols, gridRows, cellW, cellH, svgW, svgH } = useMemo(() => {
    const cols = Math.max(...properties.map((p) => p.layout_x ?? 0)) + 1;
    const rows = Math.max(...properties.map((p) => p.layout_y ?? 0)) + 1;
    const cw = 64;
    const ch = 52;
    return {
      gridCols: cols,
      gridRows: rows,
      cellW: cw,
      cellH: ch,
      svgW: cols * (cw + 6) + 40,
      svgH: rows * (ch + 6) + 40,
    };
  }, [properties]);

  const plotMap = useMemo(() => {
    const map = new Map<string, Property>();
    properties.forEach((p) => map.set(`${p.layout_x},${p.layout_y}`, p));
    return map;
  }, [properties]);

  function handlePlotClick(property: Property) {
    setSelectedProperty(property);
    onSelectProperty?.(property);
  }

  function handleCloseDetail() {
    setSelectedProperty(null);
    onSelectProperty?.(null);
  }

  const legend = [
    { label: "Available", color: STATUS_FILLS.available },
    { label: "Reserved", color: STATUS_FILLS.reserved },
    { label: "Sold", color: STATUS_FILLS.sold },
    { label: "Blocked", color: STATUS_FILLS.blocked },
    { label: "Under Reg.", color: STATUS_FILLS.under_registration },
  ];

  return (
    <div className="space-y-6">
      {/* Project Info Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{project.name}</h3>
          <p className="text-sm text-muted-foreground">
            {project.location}, {project.city} | {project.total_units} plots ·{" "}
            {properties.filter((p) => p.status === "available").length} available
          </p>
        </div>
        {project.rera_number && (
          <div className="text-xs text-muted-foreground text-right">
            <span className="font-medium">RERA:</span> {project.rera_number}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs">
        <span className="text-muted-foreground font-medium">Legend:</span>
        {legend.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-sm border border-white/20"
              style={{ backgroundColor: item.color }}
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* SVG Layout */}
      <div className="overflow-auto rounded-lg border bg-muted/20 p-4">
        <svg
          width={svgW}
          height={svgH}
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="min-w-max"
        >
          {/* Row labels (y-axis) */}
          {Array.from({ length: gridRows }, (_, r) => (
            <text
              key={`row-${r}`}
              x={8}
              y={r * (cellH + 6) + cellH / 2 + 48}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {r + 1}
            </text>
          ))}

          {/* Column labels (x-axis) */}
          {Array.from({ length: gridCols }, (_, c) => (
            <text
              key={`col-${c}`}
              x={c * (cellW + 6) + cellW / 2 + 40}
              y={18}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {c + 1}
            </text>
          ))}

          {/* Plots */}
          {Array.from({ length: gridRows }, (_, r) =>
            Array.from({ length: gridCols }, (_, c) => {
              const property = plotMap.get(`${c},${r}`);
              if (!property) return null;

              const x = c * (cellW + 6) + 40;
              const y = r * (cellH + 6) + 32;
              const isHovered = hoveredProperty === property.id;
              const isSelected = selectedProperty?.id === property.id;

              return (
                <g
                  key={property.id}
                  onClick={() => handlePlotClick(property)}
                  onMouseEnter={() => setHoveredProperty(property.id)}
                  onMouseLeave={() => setHoveredProperty(null)}
                  className="cursor-pointer"
                >
                  <rect
                    x={x}
                    y={y}
                    width={cellW}
                    height={cellH}
                    rx={4}
                    fill={STATUS_FILLS[property.status] || "#6b7280"}
                    stroke={
                      isSelected
                        ? "#ffffff"
                        : isHovered
                          ? "#fef08a"
                          : STATUS_STROKES[property.status] || "#4b5563"
                    }
                    strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1}
                  />
                  <text
                    x={x + cellW / 2}
                    y={y + cellH / 2 - 5}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    className="text-[10px] font-semibold"
                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                  >
                    {property.plot_number}
                  </text>
                  <text
                    x={x + cellW / 2}
                    y={y + cellH / 2 + 9}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="rgba(255,255,255,0.85)"
                    className="text-[8px]"
                    style={{ textShadow: "0 1px 1px rgba(0,0,0,0.4)" }}
                  >
                    {PROPERTY_FACING_LABELS[property.facing]?.slice(0, 5)}
                  </text>
                  <text
                    x={x + cellW / 2}
                    y={y + cellH / 2 + 20}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="rgba(255,255,255,0.7)"
                    className="text-[7px]"
                    style={{ textShadow: "0 1px 1px rgba(0,0,0,0.3)" }}
                  >
                    {formatArea(property.area, property.area_unit)}
                  </text>
                </g>
              );
            })
          )}
        </svg>
      </div>

      {/* Selected Property Detail */}
      {selectedProperty && (
        <div className="relative rounded-lg border bg-card p-4 pr-8">
          <button
            onClick={handleCloseDetail}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Plot</p>
              <p className="font-semibold">{selectedProperty.plot_number}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <span
                className="inline-flex items-center gap-1 text-xs font-medium"
              >
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{
                    backgroundColor:
                      STATUS_FILLS[selectedProperty.status] || "#6b7280",
                  }}
                />
                {PROPERTY_STATUS_LABELS[selectedProperty.status]}
              </span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Area</p>
              <p className="font-semibold">
                {formatArea(selectedProperty.area, selectedProperty.area_unit)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Facing</p>
              <p className="font-semibold">
                {PROPERTY_FACING_LABELS[selectedProperty.facing]}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="font-semibold">
                {formatCurrency(selectedProperty.price)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Rate</p>
              <p className="font-semibold">
                ₹{selectedProperty.price_per_unit?.toLocaleString("en-IN")}/sq.yd
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Dimensions</p>
              <p className="font-semibold">
                {selectedProperty.dimensions || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Features</p>
              <p className="text-sm">
                {selectedProperty.features?.join(", ") || "—"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
