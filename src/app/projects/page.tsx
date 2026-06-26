import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, ArrowRight, Eye } from "lucide-react";
import { getProjects, getAllProjects, getProperties } from "@/lib/supabase/queries";
import { AnimateOnScroll } from "@/components/effects/animate-on-scroll";
import type { Property } from "@/types/database";

export const metadata: Metadata = {
  title: "Our Projects",
  description:
    "Explore our portfolio of RERA-approved plotted development projects across prime locations in Hyderabad.",
};

export default async function ProjectsPage() {
  const [activeProjects, allProjects, allProperties] = await Promise.all([
    getProjects(),
    getAllProjects(),
    getProperties(),
  ]);

  const upcomingProjects = allProjects.filter((p) => p.status === "upcoming");

  function getProjectStats(projectId: string) {
    const props = allProperties.filter((p: Property) => p.project_id === projectId);
    return {
      total: props.length,
      available: props.filter((p: Property) => p.status === "available").length,
      sold: props.filter((p: Property) => p.status === "sold").length,
    };
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <AnimateOnScroll animation="fade-up">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Our Projects</h1>
          <p className="text-muted-foreground mt-2">Explore our portfolio of RERA-approved projects across prime locations.</p>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll animation="fade-up" stagger={0.12} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeProjects.length === 0 ? (
          <Card className="overflow-hidden border-dashed md:col-span-2 lg:col-span-3">
            <div className="aspect-video bg-muted/50 flex items-center justify-center">
              <Building2 className="w-12 h-12 text-muted-foreground/30" />
            </div>
            <CardContent className="pt-4 text-center">
              <Badge variant="outline" className="mb-2">Coming Soon</Badge>
              <h3 className="font-semibold text-lg">No projects listed yet</h3>
              <p className="text-sm text-muted-foreground mt-1">Projects will appear here once they are added to the system.</p>
            </CardContent>
          </Card>
        ) : (
          activeProjects.map((project) => {
            const stats = getProjectStats(project.id);
            return (
              <Card key={project.id} className="overflow-hidden group">
                <Link href={`/projects/${project.slug}`}>
                  <div className="aspect-video bg-muted overflow-hidden relative">
                    {project.thumbnail ? (
                      <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <Building2 className="w-12 h-12 text-primary/30" />
                      </div>
                    )}
                    <Badge className="absolute top-3 left-3" variant={project.status === "ongoing" ? "default" : "secondary"}>
                      {project.status === "ongoing" ? "Ongoing" : "Completed"}
                    </Badge>
                  </div>
                </Link>
                <CardContent className="pt-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{project.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" /> {project.location}, {project.city}, {project.state}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">{stats.available} Available</span>
                    <span className="text-muted-foreground">{stats.sold} Sold</span>
                    <span className="text-muted-foreground">{project.rera_number ? "RERA Approved" : ""}</span>
                  </div>
                  {project.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.amenities.slice(0, 4).map((a) => (
                        <span key={a} className="text-[11px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{a}</span>
                      ))}
                      {project.amenities.length > 4 && <span className="text-[11px] text-muted-foreground">+{project.amenities.length - 4} more</span>}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button className="flex-1" variant="outline" size="sm" nativeButton={false} render={<Link href={`/projects/${project.slug}`} />}>
                      <Eye className="w-3 h-3 mr-1" /> View Layout
                    </Button>
                    <Button className="flex-1" size="sm" nativeButton={false} render={<Link href={`/projects/${project.slug}`} />}>
                      Explore <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </AnimateOnScroll>

      {upcomingProjects.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Upcoming Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingProjects.map((project) => (
              <Card key={project.id} className="border-dashed opacity-70">
                <CardContent className="pt-6 space-y-2">
                  <Badge variant="outline">Coming Soon</Badge>
                  <h3 className="font-semibold text-lg">{project.name}</h3>
                  <p className="text-sm text-muted-foreground">{project.location}, {project.city}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
