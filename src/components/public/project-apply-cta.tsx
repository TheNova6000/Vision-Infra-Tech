"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlotApplicationForm } from "./plot-application-form";
import { Phone } from "lucide-react";

interface ProjectApplyCTAProps {
  projectName: string;
  projectId: string;
}

export function ProjectApplyCTA({ projectName, projectId }: ProjectApplyCTAProps) {
  const [applyOpen, setApplyOpen] = useState(false);

  return (
    <>
      <Card>
        <CardContent className="pt-6 space-y-3">
          <h3 className="font-semibold">Interested in {projectName}?</h3>
          <p className="text-sm text-muted-foreground">
            Apply for a plot and our team will contact you within 24 hours.
          </p>
          <Button className="w-full" onClick={() => setApplyOpen(true)}>
            Apply for a Plot
          </Button>
          <Button
            className="w-full"
            variant="outline"
            nativeButton={false}
            render={<Link href="/contact" />}
          >
            <Phone className="w-4 h-4 mr-2" />
            Contact Us
          </Button>
        </CardContent>
      </Card>

      <PlotApplicationForm
        open={applyOpen}
        onOpenChange={setApplyOpen}
        projectName={projectName}
        projectId={projectId}
      />
    </>
  );
}
