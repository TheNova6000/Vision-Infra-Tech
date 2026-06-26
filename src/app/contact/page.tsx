import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, Building2 } from "lucide-react";
import { AnimateOnScroll } from "@/components/effects/animate-on-scroll";
import { ContactForm } from "@/components/public/contact-form";
import { getPublicStats, getTenantSettings } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Enquire about plots, villas, and apartments. Schedule a site visit or share your property requirements with Vision Infra Tech.",
};

export default async function ContactPage() {
  const [stats, settings] = await Promise.all([getPublicStats(), getTenantSettings()]);

  const companyName = settings?.company_name ?? "Vision Infra Tech";
  const phone = settings?.company_phone ?? "+91 98765 43210";
  const email = settings?.company_email ?? "info@visioninfra.com";
  const address = settings?.company_address ?? "Hyderabad, Telangana, India";

  const contactCards = [
    { icon: Phone, title: "Phone", lines: [phone] },
    { icon: Mail, title: "Email", lines: [email] },
    { icon: MapPin, title: "Office", lines: [companyName, address] },
    { icon: Clock, title: "Working Hours", lines: ["Mon – Sat: 9:00 AM – 7:00 PM", "Sunday: By Appointment"] },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <AnimateOnScroll animation="fade-up">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-medium text-primary mb-2">Get in Touch</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Tell us what you&apos;re looking for
          </h1>
          <p className="text-muted-foreground text-lg">
            Share your budget, preferred location, and property type.
            We&apos;ll match you with available options across our {stats.activeProjects} active projects.
          </p>
        </div>
      </AnimateOnScroll>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl">
        <AnimateOnScroll animation="fade-up" delay={0.1} className="md:col-span-2">
          <ContactForm />
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-right" stagger={0.1} className="space-y-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium text-sm">Currently Available</h3>
                  <p className="text-2xl font-bold mt-1">{stats.availableProperties}</p>
                  <p className="text-xs text-muted-foreground">properties across {stats.activeProjects} projects</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {contactCards.map((item) => (
            <Card key={item.title}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <item.icon className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm">{item.title}</h3>
                    {item.lines.map((line) => (
                      <p key={line} className="text-sm text-muted-foreground">{line}</p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </AnimateOnScroll>
      </div>
    </div>
  );
}
