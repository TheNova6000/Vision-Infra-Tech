import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollProvider } from "@/components/providers/scroll-provider";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { WireframeMesh } from "@/components/effects/wireframe-mesh";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#1e40af",
};

export const metadata: Metadata = {
  title: {
    default: "Vision Infra Tech — Real Estate",
    template: "%s | Vision Infra Tech",
  },
  description:
    "Transparent deals, RERA-approved projects, and a seamless buying experience. Explore plots, villas, and apartments across prime locations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          <ScrollProvider>
            <div className="flex min-h-screen flex-col">
              <WireframeMesh />
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
          </ScrollProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
