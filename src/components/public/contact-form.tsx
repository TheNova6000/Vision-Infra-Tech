"use client";

import { useActionState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitContactForm } from "@/app/actions/leads";
import { CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, {
    success: false,
  });

  if (state.success) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="w-16 h-16 mx-auto text-emerald-500" />
            <h3 className="text-xl font-semibold">Enquiry Submitted!</h3>
            <p className="text-muted-foreground">
              Thank you for reaching out. Our team will contact you within 24
              hours.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send us a message</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Your name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+91 98765 43210"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label id="contact-interest-label">Interested In</Label>
            <Select name="interest">
              <SelectTrigger aria-labelledby="contact-interest-label">
                <SelectValue placeholder="What are you looking for?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plot">Plots</SelectItem>
                <SelectItem value="villa">Villas</SelectItem>
                <SelectItem value="apartment">Apartments</SelectItem>
                <SelectItem value="commercial">Commercial Space</SelectItem>
                <SelectItem value="farmland">Farmland</SelectItem>
                <SelectItem value="general">General Enquiry</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us about your requirements — budget, preferred location, type of property..."
              rows={4}
            />
          </div>
          {state.error && (
            <p className="text-sm text-red-500">{state.error}</p>
          )}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit Enquiry"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Your enquiry creates a lead in our system. An agent will contact you
            within 24 hours.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
