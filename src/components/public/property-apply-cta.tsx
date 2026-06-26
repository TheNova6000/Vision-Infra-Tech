"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlotApplicationForm } from "./plot-application-form";

interface PropertyApplyCTAProps {
  projectName: string;
  projectId: string;
  projectSlug: string;
  plotNumber: string;
  propertyId: string;
}

export function PropertyApplyCTA({
  projectName,
  projectId,
  projectSlug,
  plotNumber,
  propertyId,
}: PropertyApplyCTAProps) {
  const [applyOpen, setApplyOpen] = useState(false);

  return (
    <>
      <Card>
        <CardContent className="pt-6 space-y-3">
          <h3 className="font-semibold">Interested in this property?</h3>
          <p className="text-sm text-muted-foreground">
            Apply for this plot and our team will contact you within 24 hours.
          </p>
          <Button className="w-full" onClick={() => setApplyOpen(true)}>
            Apply for this Plot
          </Button>
          <Button
            className="w-full"
            variant="outline"
            nativeButton={false}
            render={<Link href={`/projects/${projectSlug}`} />}
          >
            View Layout Map
          </Button>
        </CardContent>
      </Card>

      <PlotApplicationForm
        open={applyOpen}
        onOpenChange={setApplyOpen}
        projectName={projectName}
        plotNumber={plotNumber}
        projectId={projectId}
        propertyId={propertyId}
      />
    </>
  );
}
