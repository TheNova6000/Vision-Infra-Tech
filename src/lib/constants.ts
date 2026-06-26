export const APP_NAME = "REOS";
export const APP_DESCRIPTION = "Real Estate Operating System";

export const PROPERTY_STATUS_LABELS: Record<string, string> = {
  available: "Available",
  reserved: "Reserved",
  sold: "Sold",
  blocked: "Blocked",
  under_registration: "Under Registration",
};

export const PROPERTY_STATUS_COLORS: Record<string, string> = {
  available: "bg-emerald-500",
  reserved: "bg-amber-500",
  sold: "bg-red-500",
  blocked: "bg-gray-500",
  under_registration: "bg-blue-500",
};

interface StatusStyle {
  badge: string;
  outline: string;
  icon: string;
  dot: string;
  borderTop: string;
}

const SEMANTIC_COLORS: Record<string, StatusStyle> = {
  emerald: {
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400",
    outline: "border-emerald-500 text-emerald-600 dark:text-emerald-400",
    icon: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    dot: "bg-emerald-500",
    borderTop: "border-t-emerald-500",
  },
  amber: {
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400",
    outline: "border-amber-500 text-amber-600 dark:text-amber-400",
    icon: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    dot: "bg-amber-500",
    borderTop: "border-t-amber-500",
  },
  red: {
    badge: "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400",
    outline: "border-red-500 text-red-600 dark:text-red-400",
    icon: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
    dot: "bg-red-500",
    borderTop: "border-t-red-500",
  },
  blue: {
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400",
    outline: "border-blue-500 text-blue-600 dark:text-blue-400",
    icon: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
    dot: "bg-blue-500",
    borderTop: "border-t-blue-500",
  },
  cyan: {
    badge: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-400",
    outline: "border-cyan-500 text-cyan-600 dark:text-cyan-400",
    icon: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400",
    dot: "bg-cyan-500",
    borderTop: "border-t-cyan-500",
  },
  violet: {
    badge: "bg-violet-100 text-violet-800 dark:bg-violet-950/40 dark:text-violet-400",
    outline: "border-violet-500 text-violet-600 dark:text-violet-400",
    icon: "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400",
    dot: "bg-violet-500",
    borderTop: "border-t-violet-500",
  },
  rose: {
    badge: "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400",
    outline: "border-rose-500 text-rose-600 dark:text-rose-400",
    icon: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
    dot: "bg-rose-500",
    borderTop: "border-t-rose-500",
  },
  orange: {
    badge: "bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-400",
    outline: "border-orange-500 text-orange-600 dark:text-orange-400",
    icon: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
    dot: "bg-orange-500",
    borderTop: "border-t-orange-500",
  },
  gray: {
    badge: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    outline: "border-gray-400 text-gray-500 dark:text-gray-400",
    icon: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    dot: "bg-gray-400",
    borderTop: "border-t-gray-400",
  },
  indigo: {
    badge: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400",
    outline: "border-indigo-500 text-indigo-600 dark:text-indigo-400",
    icon: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400",
    dot: "bg-indigo-500",
    borderTop: "border-t-indigo-500",
  },
};

export const PROPERTY_STATUS_STYLES: Record<string, StatusStyle> = {
  available: SEMANTIC_COLORS.emerald,
  reserved: SEMANTIC_COLORS.amber,
  sold: SEMANTIC_COLORS.red,
  blocked: SEMANTIC_COLORS.gray,
  under_registration: SEMANTIC_COLORS.blue,
};

export const LEAD_STATUS_STYLES: Record<string, StatusStyle> = {
  new: SEMANTIC_COLORS.blue,
  contacted: SEMANTIC_COLORS.cyan,
  property_shared: SEMANTIC_COLORS.indigo,
  site_visit: SEMANTIC_COLORS.violet,
  negotiation: SEMANTIC_COLORS.amber,
  booked: SEMANTIC_COLORS.emerald,
  registration: SEMANTIC_COLORS.orange,
  possession: SEMANTIC_COLORS.emerald,
  lost: SEMANTIC_COLORS.gray,
};

export const BOOKING_STATUS_STYLES: Record<string, StatusStyle> = {
  pending: SEMANTIC_COLORS.amber,
  confirmed: SEMANTIC_COLORS.emerald,
  cancelled: SEMANTIC_COLORS.red,
  registered: SEMANTIC_COLORS.blue,
};

export const ACTIVITY_TYPE_STYLES: Record<string, StatusStyle> = {
  call: SEMANTIC_COLORS.blue,
  whatsapp: SEMANTIC_COLORS.emerald,
  site_visit: SEMANTIC_COLORS.violet,
  note: SEMANTIC_COLORS.amber,
  email: SEMANTIC_COLORS.cyan,
  meeting: SEMANTIC_COLORS.rose,
  follow_up: SEMANTIC_COLORS.orange,
  property_shared: SEMANTIC_COLORS.blue,
};

export const PROPERTY_FACING_LABELS: Record<string, string> = {
  north: "North",
  south: "South",
  east: "East",
  west: "West",
  north_east: "North East",
  north_west: "North West",
  south_east: "South East",
  south_west: "South West",
  corner: "Corner",
};

export const LEAD_STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  property_shared: "Property Shared",
  site_visit: "Site Visit",
  negotiation: "Negotiation",
  booked: "Booked",
  registration: "Registration",
  possession: "Possession",
  lost: "Lost",
};

export const LEAD_STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500",
  contacted: "bg-cyan-500",
  property_shared: "bg-indigo-500",
  site_visit: "bg-violet-500",
  negotiation: "bg-amber-500",
  booked: "bg-emerald-500",
  registration: "bg-orange-500",
  possession: "bg-emerald-600",
  lost: "bg-gray-400",
};

export const LEAD_TEMPERATURE_STYLES: Record<string, { bg: string; text: string }> = {
  hot: { bg: "bg-red-500/15", text: "text-red-400" },
  warm: { bg: "bg-amber-500/15", text: "text-amber-400" },
  cold: { bg: "bg-blue-500/15", text: "text-blue-400" },
};

export type { StatusStyle };

export const LEAD_SOURCE_LABELS: Record<string, string> = {
  website: "Website",
  walkin: "Walk-in",
  referral: "Referral",
  portal_99acres: "99acres",
  portal_magicbricks: "MagicBricks",
  whatsapp: "WhatsApp",
  phone: "Phone Call",
  other: "Other",
};

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  sale_deed: "Sale Deed",
  dtcp_approval: "DTCP Approval",
  rera_certificate: "RERA Certificate",
  layout_plan: "Layout Plan",
  brochure: "Brochure",
  kyc: "KYC Document",
  agreement: "Agreement",
  receipt: "Receipt",
  other: "Other",
};

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Inventory", href: "/inventory", icon: "Building2" },
  { label: "Leads", href: "/leads", icon: "Users" },
  { label: "Documents", href: "/documents", icon: "FileText" },
  { label: "Analytics", href: "/analytics", icon: "BarChart3" },
  { label: "Compliance", href: "/compliance", icon: "ShieldCheck" },
  { label: "Settings", href: "/settings", icon: "Settings" },
] as const;

export const CURRENCY = {
  symbol: "₹",
  code: "INR",
  locale: "en-IN",
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(CURRENCY.locale, {
    style: "currency",
    currency: CURRENCY.code,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatArea(area: number, unit: string): string {
  const unitLabels: Record<string, string> = {
    sq_ft: "sq.ft",
    sq_yards: "sq.yd",
    sq_meters: "sq.m",
    acres: "acres",
    cents: "cents",
    guntas: "guntas",
  };
  return `${area.toLocaleString("en-IN")} ${unitLabels[unit] || unit}`;
}
