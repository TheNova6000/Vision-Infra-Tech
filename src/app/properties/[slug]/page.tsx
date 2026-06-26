import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ImageCarousel } from "@/components/public/image-carousel";
import { PropertyApplyCTA } from "@/components/public/property-apply-cta";
import { LocationMapDynamic as LocationMap } from "@/components/public/location-map-dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getPropertyById,
  getPropertiesByProject,
} from "@/lib/supabase/queries";
import { getAllProjects } from "@/lib/supabase/queries";
import {
  formatCurrency,
  formatArea,
  PROPERTY_STATUS_LABELS,
  PROPERTY_FACING_LABELS,
} from "@/lib/constants";
import {
  ArrowLeft,
  MapPin,
  Compass,
  Maximize2,
  IndianRupee,
  Grid3X3,
} from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getPropertyAndProject(slug: string) {
  const property = await getPropertyById(slug);
  if (!property) return { property: null, project: null };

  const allProjects = await getAllProjects();
  const project = allProjects.find((p) => p.id === property.project_id) ?? null;
  return { property, project };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { property, project } = await getPropertyAndProject(slug);

  if (!property || !project) {
    return { title: "Property Not Found" };
  }

  return {
    title: `${project.name} — ${property.plot_number}`,
    description: `${PROPERTY_FACING_LABELS[property.facing]} plot in ${project.name}, ${project.location}. ${formatArea(property.area, property.area_unit)} at ${formatCurrency(property.price)}.`,
    openGraph: {
      title: `${project.name} — ${property.plot_number}`,
      images: property.images?.[0] ? [property.images[0]] : undefined,
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const { property, project } = await getPropertyAndProject(slug);

  if (!property || !project) {
    notFound();
  }

  const sameProjectProps = await getPropertiesByProject(project.id);
  const nearbyAvailable = sameProjectProps
    .filter((p) => p.status === "available" && p.id !== property.id)
    .slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/properties"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Properties
      </Link>

      <div className="rounded-xl overflow-hidden mb-6">
        <ImageCarousel
          images={property.images || []}
          alt={`${project.name} ${property.plot_number}`}
          className="aspect-[21/9]"
        />
      </div>

      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {project.name} — {property.plot_number}
            </h1>
            <p className="text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              {project.location}, {project.city}, {project.state}
            </p>
          </div>
          <Badge
            className={
              property.status === "available"
                ? "bg-emerald-500 text-white"
                : property.status === "reserved"
                  ? "bg-amber-500 text-white"
                  : property.status === "sold"
                    ? "bg-red-500 text-white"
                    : "bg-gray-500 text-white"
            }
          >
            {PROPERTY_STATUS_LABELS[property.status]}
          </Badge>
        </div>
        <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
          {formatCurrency(property.price)}
        </p>
        {property.price_per_unit && (
          <p className="text-sm text-muted-foreground">
            ₹{property.price_per_unit.toLocaleString("en-IN")}/sq.yd
          </p>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted/50 rounded-lg p-4 text-center space-y-1">
                  <Maximize2 className="w-5 h-5 mx-auto text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Area</p>
                  <p className="font-semibold">
                    {formatArea(property.area, property.area_unit)}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center space-y-1">
                  <Compass className="w-5 h-5 mx-auto text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Facing</p>
                  <p className="font-semibold">
                    {PROPERTY_FACING_LABELS[property.facing]}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center space-y-1">
                  <IndianRupee className="w-5 h-5 mx-auto text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Rate/sq.yd</p>
                  <p className="font-semibold">
                    ₹
                    {(
                      property.price_per_unit ??
                      Math.round(property.price / property.area)
                    ).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center space-y-1">
                  <Grid3X3 className="w-5 h-5 mx-auto text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Dimensions</p>
                  <p className="font-semibold">
                    {property.dimensions || "—"}
                  </p>
                </div>
              </div>

              {property.features && property.features.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-sm mb-2">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.features.map((f) => (
                      <Badge key={f} variant="secondary">
                        {f}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {property.description && (
                <div className="mt-6">
                  <h3 className="font-semibold text-sm mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">
                    {property.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-3">
                About {project.name}
              </h2>
              <p className="text-sm text-muted-foreground mb-3">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                {project.rera_number && (
                  <div>
                    <span className="text-muted-foreground">RERA:</span>{" "}
                    {project.rera_number}
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Total Plots:</span>{" "}
                  {project.total_units}
                </div>
                <Button
                  variant="link"
                  size="xs"
                  className="h-auto p-0 text-xs"
                  nativeButton={false}
                  render={<Link href={`/projects/${project.slug}`} />}
                >
                  View project details →
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <PropertyApplyCTA
            projectName={project.name}
            projectId={project.id}
            projectSlug={project.slug}
            plotNumber={property.plot_number}
            propertyId={property.id}
          />

          {project.latitude && project.longitude && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Location</h3>
                <LocationMap
                  latitude={project.latitude}
                  longitude={project.longitude}
                  label={project.name}
                  height="200px"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {project.location}, {project.city}
                </p>
              </CardContent>
            </Card>
          )}

          {nearbyAvailable.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">
                  Other Available Plots in {project.name}
                </h3>
                <div className="space-y-2">
                  {nearbyAvailable.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2 rounded-lg border hover:bg-muted/30 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium">{p.plot_number}</p>
                        <p className="text-xs text-muted-foreground">
                          {PROPERTY_FACING_LABELS[p.facing]} &middot;{" "}
                          {formatArea(p.area, p.area_unit)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          {formatCurrency(p.price)}
                        </p>
                        <Button
                          variant="link"
                          size="xs"
                          className="text-xs h-auto p-0"
                          nativeButton={false}
                          render={<Link href={`/properties/${p.id}`} />}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
