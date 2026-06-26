import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AuroraBackground } from "@/components/effects/aurora-background";
import { AnimateOnScroll } from "@/components/effects/animate-on-scroll";
import { getProjects, getProperties, getPublicStats } from "@/lib/supabase/queries";
import {
  Building2, MapPin, Shield, Search, ArrowRight, Eye,
  Ruler, Compass, IndianRupee, Grid3X3, Layers,
} from "lucide-react";

export default async function HomePage() {
  const [activeProjects, allProperties, stats] = await Promise.all([
    getProjects(),
    getProperties(),
    getPublicStats(),
  ]);

  function getProjectStats(projectId: string) {
    const props = allProperties.filter((p) => p.project_id === projectId);
    return {
      total: props.length,
      available: props.filter((p) => p.status === "available").length,
      minPrice: props.length > 0 ? Math.min(...props.map((p) => p.price)) : 0,
      maxPrice: props.length > 0 ? Math.max(...props.map((p) => p.price)) : 0,
    };
  }

  const reraCount = activeProjects.filter((p) => p.rera_number).length;

  const availableProperties = allProperties.filter((p) => p.status === "available");
  const featuredProperties = availableProperties.slice(0, 6);

  const propertyTypes = [...new Set(allProperties.map((p) => p.property_type))];
  const cities = [...new Set(activeProjects.map((p) => p.city))];

  function formatPrice(price: number) {
    if (price >= 10000000) return `${(price / 10000000).toFixed(1)} Cr`;
    if (price >= 100000) return `${(price / 100000).toFixed(1)} L`;
    return `${price.toLocaleString("en-IN")}`;
  }

  return (
    <>
      {/* Hero — property focused */}
      <section className="relative py-24 md:py-40 overflow-hidden">
        <AuroraBackground />
        <div className="container mx-auto px-4">
          <AnimateOnScroll animation="fade-up" stagger={0.12}>
            <p className="text-sm font-medium text-primary mb-4 tracking-wide">
              {stats.activeProjects} Active Projects &middot; {stats.availableProperties} Properties Available
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-4xl [text-wrap:balance]">
              Plots, Villas & Apartments in{" "}
              <span className="text-primary">{cities.join(", ") || "Hyderabad"}</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl [text-wrap:pretty]">
              {stats.totalProperties}+ properties across {stats.activeProjects} RERA-registered projects.
              Browse interactive layout maps, check real-time availability, and find your next investment.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                nativeButton={false}
                render={<Link href="/properties" />}
                className="shadow-[0_0_24px_oklch(0.72_0.15_192_/_25%)]"
              >
                <Search className="w-4 h-4 mr-2" /> Browse All Properties
              </Button>
              <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/projects" />}>
                <Grid3X3 className="w-4 h-4 mr-2" /> View Projects
              </Button>
            </div>
          </AnimateOnScroll>

          {/* Stats strip */}
          <AnimateOnScroll animation="fade-up" delay={0.4}>
            <div className="mt-16 inline-flex flex-wrap items-center justify-center gap-6 md:gap-10 rounded-2xl glass px-8 py-5">
              <div className="text-center px-2">
                <div className="text-2xl font-bold">{stats.activeProjects}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Projects</div>
              </div>
              <div className="w-px h-10 bg-white/[0.08] hidden sm:block" />
              <div className="text-center px-2">
                <div className="text-2xl font-bold">{stats.totalProperties}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Total Properties</div>
              </div>
              <div className="w-px h-10 bg-white/[0.08] hidden sm:block" />
              <div className="text-center px-2">
                <div className="text-2xl font-bold text-emerald-400">{stats.availableProperties}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Available Now</div>
              </div>
              <div className="w-px h-10 bg-white/[0.08] hidden sm:block" />
              <div className="text-center px-2">
                <div className="text-2xl font-bold text-primary">{reraCount}</div>
                <div className="text-xs text-muted-foreground mt-0.5">RERA Approved</div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Projects — full cards with stats */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <AnimateOnScroll animation="fade-up">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-sm font-medium text-primary mb-1">Our Developments</p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Active Projects</h2>
              </div>
              <Button variant="outline" nativeButton={false} render={<Link href="/projects" />} className="hidden sm:flex">
                All Projects <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </AnimateOnScroll>

          <div className="grid md:grid-cols-3 gap-6">
            {activeProjects.slice(0, 3).map((project, i) => {
              const projStats = getProjectStats(project.id);
              return (
                <AnimateOnScroll key={project.id} animation="fade-up" delay={i * 0.12}>
                  <Card className="overflow-hidden group hover:ring-1 hover:ring-primary/30 transition-all duration-300 h-full flex flex-col">
                    <Link href={`/projects/${project.slug}`}>
                      <div className="aspect-[16/10] bg-muted overflow-hidden relative">
                        {project.thumbnail ? (
                          <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                            <Building2 className="w-10 h-10 text-primary/20" />
                          </div>
                        )}
                        {project.rera_number && (
                          <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-md px-2 py-1">
                            <Shield className="w-3 h-3 text-emerald-400" />
                            <span className="text-[10px] font-medium text-white">RERA</span>
                          </div>
                        )}
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 pt-10">
                          <h3 className="text-white font-semibold text-lg">{project.name}</h3>
                          <p className="text-white/70 text-xs flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" /> {project.location}, {project.city}
                          </p>
                        </div>
                      </div>
                    </Link>
                    <CardContent className="pt-4 flex-1 flex flex-col">
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{project.description}</p>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center rounded-lg bg-muted/50 py-2">
                          <div className="text-sm font-semibold">{projStats.total}</div>
                          <div className="text-[10px] text-muted-foreground">Total Units</div>
                        </div>
                        <div className="text-center rounded-lg bg-emerald-500/10 py-2">
                          <div className="text-sm font-semibold text-emerald-400">{projStats.available}</div>
                          <div className="text-[10px] text-muted-foreground">Available</div>
                        </div>
                        <div className="text-center rounded-lg bg-muted/50 py-2">
                          <div className="text-sm font-semibold">{projStats.minPrice > 0 ? formatPrice(projStats.minPrice) : "—"}</div>
                          <div className="text-[10px] text-muted-foreground">Starting</div>
                        </div>
                      </div>
                      <Button className="w-full" size="sm" nativeButton={false} render={<Link href={`/projects/${project.slug}`} />}>
                        <Eye className="w-3.5 h-3.5 mr-1.5" /> View Project & Layout Map
                      </Button>
                    </CardContent>
                  </Card>
                </AnimateOnScroll>
              );
            })}
          </div>

          <div className="mt-6 sm:hidden text-center">
            <Button variant="outline" nativeButton={false} render={<Link href="/projects" />}>
              All Projects <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      {featuredProperties.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <AnimateOnScroll animation="fade-up">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-sm font-medium text-primary mb-1">Available Now</p>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Featured Properties</h2>
                </div>
                <Button variant="outline" nativeButton={false} render={<Link href="/properties" />} className="hidden sm:flex">
                  Browse All <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </AnimateOnScroll>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredProperties.map((property, i) => {
                const project = activeProjects.find((p) => p.id === property.project_id);
                return (
                  <AnimateOnScroll key={property.id} animation="fade-up" delay={i * 0.08}>
                    <Link href={`/properties/${property.id}`}>
                      <Card className="group hover:ring-1 hover:ring-primary/30 transition-all duration-300 h-full">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-primary bg-primary/10 rounded-md px-2 py-0.5">
                              {property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1)}
                            </span>
                            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 rounded-md px-2 py-0.5">
                              Available
                            </span>
                          </div>

                          <h3 className="font-semibold group-hover:text-primary transition-colors">
                            {property.plot_number}
                          </h3>
                          {project && (
                            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                              <Layers className="w-3 h-3" /> {project.name}
                            </p>
                          )}

                          <div className="grid grid-cols-3 gap-2 mt-4">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Ruler className="w-3 h-3 text-primary/50" />
                              {property.area} {property.area_unit === "sq_ft" ? "sq.ft" : property.area_unit}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Compass className="w-3 h-3 text-primary/50" />
                              {property.facing.charAt(0).toUpperCase() + property.facing.slice(1).replace("_", " ")}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <IndianRupee className="w-3 h-3 text-primary/50" />
                              {formatPrice(property.price)}
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                            <span className="text-lg font-bold">
                              ₹{formatPrice(property.price)}
                            </span>
                            <span className="text-xs text-primary font-medium group-hover:underline flex items-center gap-0.5">
                              View Details <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </AnimateOnScroll>
                );
              })}
            </div>

            <div className="mt-6 sm:hidden text-center">
              <Button variant="outline" nativeButton={false} render={<Link href="/properties" />}>
                Browse All Properties <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Property types quick links */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <AnimateOnScroll animation="fade-up">
            <div className="text-center mb-12">
              <p className="text-sm font-medium text-primary mb-1">What Are You Looking For?</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Browse by Type</h2>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {[
              { type: "plot", label: "Plots", icon: Grid3X3, count: allProperties.filter((p) => p.property_type === "plot").length },
              { type: "villa", label: "Villas", icon: Building2, count: allProperties.filter((p) => p.property_type === "villa").length },
              { type: "apartment", label: "Apartments", icon: Layers, count: allProperties.filter((p) => p.property_type === "apartment").length },
              { type: "commercial", label: "Commercial", icon: Building2, count: allProperties.filter((p) => p.property_type === "commercial").length },
              { type: "farmland", label: "Farmland", icon: Compass, count: allProperties.filter((p) => p.property_type === "farmland").length },
            ].filter((t) => t.count > 0).map((type, i) => (
              <AnimateOnScroll key={type.type} animation="fade-up" delay={i * 0.08}>
                <Link href={`/properties?type=${type.type}`}>
                  <Card className="group hover:ring-1 hover:ring-primary/30 hover:bg-primary/5 transition-all duration-300 text-center">
                    <CardContent className="pt-5 pb-4">
                      <type.icon className="w-6 h-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <h3 className="font-semibold text-sm">{type.label}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{type.count} properties</p>
                    </CardContent>
                  </Card>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <AnimateOnScroll animation="scale-up">
            <div className="max-w-2xl mx-auto text-center rounded-3xl glass-strong px-8 py-14 relative overflow-hidden">
              <div
                className="absolute inset-0 -z-10"
                style={{
                  background: "radial-gradient(ellipse at 50% 0%, oklch(0.72 0.15 192 / 10%) 0%, transparent 60%)",
                }}
              />
              <p className="text-sm font-medium text-primary mb-3">
                {stats.availableProperties} properties available right now
              </p>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Looking for a specific requirement?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Tell us your budget, preferred location, and property type.
                We&apos;ll match you with the best available options across all our projects.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button size="lg" nativeButton={false} render={<Link href="/contact" />} className="shadow-[0_0_24px_oklch(0.72_0.15_192_/_25%)]">
                  Share Your Requirements
                </Button>
                <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/properties" />}>
                  <Search className="w-4 h-4 mr-2" /> Search Yourself
                </Button>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
