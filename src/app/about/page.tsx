import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimateOnScroll } from "@/components/effects/animate-on-scroll";
import { getProjects, getProperties, getPublicStats } from "@/lib/supabase/queries";
import {
  Building2, MapPin, ArrowRight, Grid3X3, Layers, Ruler,
  Shield, Search,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Vision Infra Tech — plots, villas, apartments, and commercial properties across Hyderabad. RERA-registered developments with interactive layout maps.",
};

export default async function AboutPage() {
  const [projects, properties, stats] = await Promise.all([
    getProjects(),
    getProperties(),
    getPublicStats(),
  ]);

  const reraCount = projects.filter((p) => p.rera_number).length;
  const totalArea = properties.reduce((sum, p) => sum + p.area, 0);
  const cities = [...new Set(projects.map((p) => p.city))];
  const types = [...new Set(properties.map((p) => p.property_type))];

  function formatArea(area: number) {
    if (area >= 100000) return `${(area / 100000).toFixed(0)}L+ sq.ft`;
    if (area >= 1000) return `${(area / 1000).toFixed(0)}K+ sq.ft`;
    return `${area} sq.ft`;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <AnimateOnScroll animation="fade-up">
          <p className="text-sm font-medium text-primary mb-2">About Vision Infra Tech</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            We develop properties.<br />
            <span className="text-primary">You pick the one you want.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-12">
            Vision Infra Tech is a Hyderabad-based real estate developer focused on
            plotted developments, villas, and residential projects across the city&apos;s
            fastest-growing corridors. Every project is RERA-registered.
          </p>
        </AnimateOnScroll>

        {/* Numbers */}
        <AnimateOnScroll animation="fade-up" delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { value: stats.activeProjects, label: "Active Projects" },
              { value: stats.totalProperties, label: "Total Properties" },
              { value: reraCount, label: "RERA Registered" },
              { value: formatArea(totalArea), label: "Total Development" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl glass text-center py-5 px-3">
                <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </AnimateOnScroll>

        {/* What we develop */}
        <AnimateOnScroll animation="fade-up">
          <p className="text-sm font-medium text-primary mb-2">Our Portfolio</p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">What we develop</h2>
        </AnimateOnScroll>

        <div className="grid sm:grid-cols-2 gap-4 mb-16">
          {[
            { icon: Grid3X3, title: "Plotted Developments", desc: "Open plots in gated layouts with roads, drainage, electricity, and landscaping. Sizes from 150 to 500 sq. yards across multiple projects." },
            { icon: Building2, title: "Villas & Independent Houses", desc: "Ready-to-move and under-construction villas in premium locations. East and north-facing options available." },
            { icon: Layers, title: "Apartments & Flats", desc: "2BHK and 3BHK apartments in multi-story complexes with amenities — parking, security, community spaces." },
            { icon: Ruler, title: "Commercial Properties", desc: "Shop spaces, office plots, and commercial land near arterial roads and growth corridors." },
          ].map((item, i) => (
            <AnimateOnScroll key={item.title} animation="fade-up" delay={i * 0.1}>
              <Card className="h-full hover:ring-1 hover:ring-primary/20 transition-all">
                <CardContent className="pt-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1.5">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Where we build */}
        <AnimateOnScroll animation="fade-up">
          <p className="text-sm font-medium text-primary mb-2">Locations</p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Where we build</h2>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-up" delay={0.1}>
          <div className="rounded-2xl glass-strong p-6 md:p-8 mb-16">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our projects are concentrated in Hyderabad&apos;s high-growth zones — areas
                  with upcoming infrastructure, IT corridor proximity, and strong appreciation potential.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Every location is chosen for connectivity to highways, proximity to
                  employment hubs, and access to schools, hospitals, and daily essentials.
                </p>
              </div>
              <div className="space-y-3">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.slug}`}
                    className="flex items-center justify-between rounded-lg bg-background/50 px-4 py-3 hover:bg-primary/5 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-primary/60" />
                      <div>
                        <div className="text-sm font-medium group-hover:text-primary transition-colors">{project.name}</div>
                        <div className="text-xs text-muted-foreground">{project.location}, {project.city}</div>
                      </div>
                    </div>
                    {project.rera_number && (
                      <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Every project is RERA */}
        <AnimateOnScroll animation="fade-up">
          <p className="text-sm font-medium text-primary mb-2">Compliance</p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">RERA-registered developments</h2>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-up" delay={0.1}>
          <div className="rounded-2xl glass p-6 mb-16">
            <p className="text-muted-foreground leading-relaxed mb-4">
              {reraCount} of our {stats.activeProjects} active projects are registered with RERA
              (Real Estate Regulatory Authority). Registration numbers, project details, and
              approval documents are available for verification on the respective state RERA portals.
            </p>
            <div className="flex flex-wrap gap-3">
              {projects.filter((p) => p.rera_number).map((p) => (
                <div key={p.id} className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5">
                  <div className="text-xs font-medium text-emerald-400">{p.name}</div>
                  <div className="text-[10px] text-muted-foreground">{p.rera_number}</div>
                </div>
              ))}
            </div>
          </div>
        </AnimateOnScroll>

        {/* CTA */}
        <AnimateOnScroll animation="scale-up">
          <div className="text-center rounded-2xl glass-strong px-8 py-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              {stats.availableProperties} properties available right now
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Browse our full inventory with filters for budget, facing, area, and property type.
              Every listing shows real-time availability.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" nativeButton={false} render={<Link href="/properties" />} className="shadow-[0_0_24px_oklch(0.72_0.15_192_/_25%)]">
                <Search className="w-4 h-4 mr-2" /> Browse Properties
              </Button>
              <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/contact" />}>
                Share Requirements <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  );
}
