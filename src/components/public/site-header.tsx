import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2, Menu, Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getTenantSettings } from "@/lib/supabase/queries";

const navLinks = [
  { label: "Projects", href: "/projects" },
  { label: "Properties", href: "/properties" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export async function SiteHeader() {
  const settings = await getTenantSettings();
  const companyName = settings?.company_name ?? "Vision Infra Tech";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/60 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_12px_oklch(0.72_0.15_192_/_20%)]">
            <Building2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight">{companyName}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-foreground/[0.05] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Button size="sm" className="ml-3 shadow-[0_0_16px_oklch(0.72_0.15_192_/_20%)]" nativeButton={false} render={<Link href="/properties" />}>
            <Search className="w-3.5 h-3.5 mr-1.5" />
            Find Property
          </Button>
        </nav>

        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col gap-4 mt-8">
              <Link href="/" className="text-lg font-medium">Home</Link>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <Button className="mt-4" nativeButton={false} render={<Link href="/properties" />}>
                <Search className="w-4 h-4 mr-2" />
                Find Property
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
