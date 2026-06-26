import type { Metadata } from "next";
import { getProperties, getProjects } from "@/lib/supabase/queries";
import { AnimateOnScroll } from "@/components/effects/animate-on-scroll";
import { PropertySearch } from "@/components/public/property-search";

export const metadata: Metadata = {
  title: "Find Properties",
  description:
    "Browse available plots, villas, and apartments across prime locations in Hyderabad. Filter by budget, facing, and property type.",
};

export default async function PropertiesPage() {
  const [availableProperties, projects] = await Promise.all([
    getProperties({ status: "available" }),
    getProjects(),
  ]);

  return (
    <div className="container mx-auto px-4 py-16">
      <AnimateOnScroll animation="fade-up">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Find Properties</h1>
          <p className="text-muted-foreground mt-2">
            Browse {availableProperties.length} available properties across{" "}
            {projects.length} projects.
          </p>
        </div>
      </AnimateOnScroll>

      <PropertySearch
        initialProperties={availableProperties}
        projects={projects}
      />
    </div>
  );
}
