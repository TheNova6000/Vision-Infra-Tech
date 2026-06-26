import Link from "next/link";
import { Building2, Phone, Mail, MapPin } from "lucide-react";
import { getTenantSettings } from "@/lib/supabase/queries";

export async function SiteFooter() {
  const settings = await getTenantSettings();
  const companyName = settings?.company_name ?? "Vision Infra Tech";
  const phone = settings?.company_phone ?? "+91 98765 43210";
  const email = settings?.company_email ?? "info@visioninfra.com";
  const address = settings?.company_address ?? "Hyderabad, Telangana, India";

  return (
    <footer className="border-t border-border/50 glass-subtle">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold">{companyName}</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Plots, villas, apartments, and commercial spaces across
              Hyderabad&apos;s high-growth corridors. RERA-registered projects only.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm">Explore</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/projects" className="hover:text-foreground transition-colors">All Projects</Link></li>
              <li><Link href="/properties" className="hover:text-foreground transition-colors">Browse Properties</Link></li>
              <li><Link href="/properties?type=plot" className="hover:text-foreground transition-colors">Plots</Link></li>
              <li><Link href="/properties?type=villa" className="hover:text-foreground transition-colors">Villas</Link></li>
              <li><Link href="/properties?type=apartment" className="hover:text-foreground transition-colors">Apartments</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Schedule a Visit</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm">Reach Us</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary/60" />
                {phone}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary/60" />
                {email}
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-primary/60" />
                {address}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {companyName}. All rights reserved.</p>
          <a href="https://reos-two.vercel.app" target="_blank" rel="noopener noreferrer" className="text-xs opacity-50 hover:opacity-80 transition-opacity">Powered by REOS</a>
        </div>
      </div>
    </footer>
  );
}
