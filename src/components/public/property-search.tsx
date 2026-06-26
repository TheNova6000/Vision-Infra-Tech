"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PROPERTY_STATUS_LABELS,
  PROPERTY_FACING_LABELS,
  formatCurrency,
  formatArea,
} from "@/lib/constants";
import {
  Search,
  SlidersHorizontal,
  Building2,
  MapPin,
  ArrowRight,
  MapIcon,
  List,
} from "lucide-react";
import type { Property, Project } from "@/types/database";

const PropertiesMap = dynamic(
  () =>
    import("@/components/public/properties-map").then((m) => m.PropertiesMap),
  { ssr: false }
);

const STATUS_COLORS: Record<string, string> = {
  available:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  reserved:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  sold: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  blocked: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  under_registration:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

interface PropertySearchProps {
  initialProperties: Property[];
  projects: Project[];
}

export function PropertySearch({
  initialProperties,
  projects,
}: PropertySearchProps) {
  const [search, setSearch] = useState("");
  const [budgetRange, setBudgetRange] = useState("all");
  const [facingFilter, setFacingFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const projectMap = useMemo(() => {
    const map = new Map<string, Project>();
    projects.forEach((p) => map.set(p.id, p));
    return map;
  }, [projects]);

  const filteredProperties = useMemo(() => {
    return initialProperties.filter((p) => {
      const proj = projectMap.get(p.project_id);
      const matchSearch =
        !search ||
        p.plot_number.toLowerCase().includes(search.toLowerCase()) ||
        (proj?.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (proj?.location || "").toLowerCase().includes(search.toLowerCase());

      let matchBudget = true;
      if (budgetRange !== "all") {
        const [min, max] = budgetRange.split("-").map(Number);
        if (max) {
          matchBudget = p.price >= min && p.price <= max;
        } else {
          matchBudget = p.price >= min;
        }
      }

      const matchFacing = facingFilter === "all" || p.facing === facingFilter;
      const matchType = typeFilter === "all" || p.property_type === typeFilter;

      return matchSearch && matchBudget && matchFacing && matchType;
    });
  }, [search, budgetRange, facingFilter, typeFilter, initialProperties, projectMap]);

  return (
    <>
      <Card className="mb-8">
        <CardContent className="pt-6 space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by location, project, or plot number..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select
              value={budgetRange}
              onValueChange={(value) => value && setBudgetRange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Budgets</SelectItem>
                <SelectItem value="0-2500000">Under ₹25 Lakhs</SelectItem>
                <SelectItem value="2500000-5000000">₹25–50 Lakhs</SelectItem>
                <SelectItem value="5000000-10000000">
                  ₹50 Lakhs–1 Cr
                </SelectItem>
                <SelectItem value="10000000">Above ₹1 Cr</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <Select
              value={typeFilter}
              onValueChange={(value) => value && setTypeFilter(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="plot">Plot</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="farmland">Farmland</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={facingFilter}
              onValueChange={(value) => value && setFacingFilter(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Facing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Facings</SelectItem>
                {Object.entries(PROPERTY_FACING_LABELS).map(([val, label]) => (
                  <SelectItem key={val} value={val}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2">
              {["Plot", "East Facing", "Under ₹30L"].map((tag) => (
                <Button
                  key={tag}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    if (tag === "Plot")
                      setTypeFilter(typeFilter === "plot" ? "all" : "plot");
                    if (tag === "East Facing")
                      setFacingFilter(
                        facingFilter === "east" ? "all" : "east"
                      );
                    if (tag === "Under ₹30L")
                      setBudgetRange(
                        budgetRange === "0-3000000" ? "all" : "0-3000000"
                      );
                  }}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {filteredProperties.length} property
          {filteredProperties.length !== 1 ? "ies" : "y"} found
        </p>
        <div className="flex border rounded-md">
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8 rounded-r-none"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "map" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8 rounded-l-none"
            onClick={() => setViewMode("map")}
          >
            <MapIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === "map" ? (
        <Card>
          <CardContent className="pt-6">
            <PropertiesMap
              properties={filteredProperties}
              projects={projects.filter((p) => p.status !== "upcoming")}
              height="500px"
            />
          </CardContent>
        </Card>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-16">
          <Building2 className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold">No properties found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your filters or search terms.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => {
            const project = projectMap.get(property.project_id);
            return (
              <Card key={property.id} className="overflow-hidden group">
                <Link href={`/properties/${property.id}`}>
                  <div className="aspect-[16/9] bg-muted overflow-hidden relative">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={`${project?.name} ${property.plot_number}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                        <Building2 className="w-10 h-10 text-primary/20" />
                      </div>
                    )}
                  </div>
                </Link>
                <CardContent className="pt-4 space-y-3">
                  <Link
                    href={`/properties/${property.id}`}
                    className="block"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {project?.name} — {property.plot_number}
                        </h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {project?.location}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                          STATUS_COLORS[property.status] || ""
                        }`}
                      >
                        {PROPERTY_STATUS_LABELS[property.status]}
                      </span>
                    </div>
                  </Link>

                  <div className="grid grid-cols-3 gap-3 text-center text-xs">
                    <div className="bg-muted/50 rounded-lg p-2">
                      <p className="text-muted-foreground">Area</p>
                      <p className="font-medium">
                        {formatArea(property.area, property.area_unit)}
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2">
                      <p className="text-muted-foreground">Facing</p>
                      <p className="font-medium capitalize">
                        {PROPERTY_FACING_LABELS[property.facing]}
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2">
                      <p className="text-muted-foreground">Price</p>
                      <p className="font-medium text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(property.price)}
                      </p>
                    </div>
                  </div>

                  {property.dimensions && (
                    <p className="text-xs text-muted-foreground">
                      Dimensions: {property.dimensions}
                      {property.price_per_unit &&
                        ` · ₹${property.price_per_unit.toLocaleString("en-IN")}/sq.yd`}
                    </p>
                  )}

                  <Button
                    className="w-full"
                    size="sm"
                    variant="outline"
                    nativeButton={false}
                    render={<Link href={`/properties/${property.id}`} />}
                  >
                    View Details
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
