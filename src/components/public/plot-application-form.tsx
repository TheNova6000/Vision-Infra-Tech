"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { submitPlotApplication } from "@/app/actions/leads";
import { CheckCircle2 } from "lucide-react";

interface PlotApplicationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName?: string;
  plotNumber?: string;
  projectId?: string;
  propertyId?: string;
}

export function PlotApplicationForm({
  open,
  onOpenChange,
  projectName,
  plotNumber,
  projectId: _projectId,
  propertyId,
}: PlotApplicationFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(undefined);

    const formData = new FormData();
    formData.set("name", name);
    formData.set("phone", phone);
    formData.set("email", email);
    formData.set("message", message);
    formData.set("propertyId", propertyId ?? "");
    formData.set("plotNumber", plotNumber ?? "");
    formData.set("projectName", projectName ?? "");

    const result = await submitPlotApplication({ success: false }, formData);
    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }

  function handleClose() {
    setSubmitted(false);
    setName("");
    setPhone("");
    setEmail("");
    setMessage("");
    setError(undefined);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="w-16 h-16 mx-auto text-emerald-500" />
            <DialogHeader>
              <DialogTitle>Application Submitted!</DialogTitle>
              <DialogDescription>
                Thank you, {name}. Our team will contact you at{" "}
                <span className="font-medium">{phone}</span> within 24 hours.
              </DialogDescription>
            </DialogHeader>
            <Button onClick={handleClose}>Done</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Apply for Plot</DialogTitle>
              <DialogDescription>
                {projectName && plotNumber
                  ? `Interested in ${projectName} — ${plotNumber}`
                  : projectName
                    ? `Interested in ${projectName}`
                    : "Fill in your details and our team will reach out."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="app-name">Full Name *</Label>
                <Input
                  id="app-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="app-phone">Phone Number *</Label>
                <Input
                  id="app-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="app-email">Email</Label>
                <Input
                  id="app-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="app-message">Message (optional)</Label>
                <Textarea
                  id="app-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Any specific requirements or questions..."
                  rows={3}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Our team will reach out within 24 hours to discuss your requirements.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
