import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { LayoutMap } from "@/components/dashboard/layout-map";
import { ImageCarousel } from "@/components/public/image-carousel";
import { ProjectApplyCTA } from "@/components/public/project-apply-cta";
import { LocationMapDynamic as LocationMap } from "@/components/public/location-map-dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimateOnScroll } from "@/components/effects/animate-on-scroll";
import { getProjectBySlug, getPropertiesByProject } from "@/lib/supabase/queries";
import {
  formatCurrency,
  PROPERTY_FACING_LABELS,
} from "@/lib/constants";
import {
  MapPin,
  ArrowLeft,
  CheckCircle2,
  Rows3,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: project.name,
    description:
      project.description ??
      `Explore ${project.name} — premium plotted development in ${project.location}, ${project.city}.`,
    openGraph: {
      title: project.name,
      description: project.description ?? undefined,
      images: project.thumbnail ? [project.thumbnail] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const properties = await getPropertiesByProject(project.id);
  const available = properties.filter((p) => p.status === "available").length;
  const sold = properties.filter((p) => p.status === "sold").length;
  const reserved = properties.filter((p) => p.status === "reserved").length;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </Link>

      <AnimateOnScroll animation="fade-in">
        <div className="rounded-xl overflow-hidden mb-6">
          <ImageCarousel
            images={project.images}
            alt={project.name}
            className="aspect-[21/9]"
          />
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll animation="fade-up">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-bold">
                  {project.name}
                </h1>
                <Badge
                  variant={
                    project.status === "ongoing" ? "default" : "secondary"
                  }
                >
                  {project.status === "ongoing" ? "Ongoing" : "Completed"}
                </Badge>
              </div>
              <p className="text-muted-foreground flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {project.location}, {project.city}, {project.state}
              </p>
              <p className="text-muted-foreground max-w-2xl">
                {project.description}
              </p>
            </div>
            <div className="text-right shrink-0">
              {project.rera_number && (
                <div className="text-xs text-muted-foreground mb-2">
                  <span className="font-medium">RERA:</span>{" "}
                  {project.rera_number}
                </div>
              )}
              <div className="text-sm">
                <span className="font-bold text-emerald-500">
                  {available} Available
                </span>
                <span className="mx-2 text-muted-foreground">&middot;</span>
                <span className="text-amber-500">{reserved} Reserved</span>
                <span className="mx-2 text-muted-foreground">&middot;</span>
                <span className="text-red-500">{sold} Sold</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Price range: {formatCurrency(project.price_range_min ?? 0)} –{" "}
                {formatCurrency(project.price_range_max ?? 0)}
              </p>
            </div>
          </div>
        </div>
      </AnimateOnScroll>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Rows3 className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Plot Layout</h2>
              </div>
              <LayoutMap project={project} properties={properties} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4">
                Available Plots ({available})
              </h2>
              {available === 0 ? (
                <p className="text-sm text-muted-foreground">
                  All plots in this project have been sold or reserved. Check
                  back for new releases.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {properties
                    .filter((p) => p.status === "available")
                    .slice(0, 12)
                    .map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-sm">{p.plot_number}</p>
                          <p className="text-xs text-muted-foreground">
                            {PROPERTY_FACING_LABELS[p.facing]} &middot;{" "}
                            {p.dimensions || "—"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm text-emerald-500">
                            {formatCurrency(p.price)}
                          </p>
                          <Button
                            variant="link"
                            size="xs"
                            className="text-xs h-auto p-0"
                            nativeButton={false}
                            render={
                              <Link
                                href={`/contact?property=${p.plot_number}&project=${project.slug}`}
                              />
                            }
                          >
                            Enquire
                          </Button>
                        </div>
                      </div>
                    ))}
                  {available > 12 && (
                    <div className="sm:col-span-2 text-center text-sm text-muted-foreground py-2">
                      +{available - 12} more available plots.{" "}
                      <Link
                        href={`/properties?project=${project.slug}`}
                        className="text-primary hover:underline"
                      >
                        View all
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-semibold">Project Summary</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">{properties.length}</p>
                  <p className="text-xs text-muted-foreground">Total Plots</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-emerald-500">
                    {available}
                  </p>
                  <p className="text-xs text-muted-foreground">Available</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-amber-500">
                    {reserved}
                  </p>
                  <p className="text-xs text-muted-foreground">Reserved</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-red-500">{sold}</p>
                  <p className="text-xs text-muted-foreground">Sold</p>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden flex">
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{
                    width: `${(available / properties.length) * 100}%`,
                  }}
                />
                <div
                  className="h-full bg-amber-500 transition-all"
                  style={{
                    width: `${(reserved / properties.length) * 100}%`,
                  }}
                />
                <div
                  className="h-full bg-red-500 transition-all"
                  style={{
                    width: `${(sold / properties.length) * 100}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>
                  {Math.round((available / properties.length) * 100)}% avail
                </span>
                <span>
                  {Math.round((reserved / properties.length) * 100)}% reserved
                </span>
                <span>
                  {Math.round((sold / properties.length) * 100)}% sold
                </span>
              </div>
            </CardContent>
          </Card>

          {project.amenities.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Amenities</h3>
                <div className="space-y-2">
                  {project.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 text-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

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
                  {project.location}, {project.city}, {project.state}
                </p>
              </CardContent>
            </Card>
          )}

          <ProjectApplyCTA
            projectName={project.name}
            projectId={project.id}
          />
        </div>
      </div>
    </div>
  );
}
