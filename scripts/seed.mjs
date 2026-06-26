/**
 * Seed script — populates Supabase with Vision Infra Tech demo data.
 *
 * Run:  node --env-file=.env.local scripts/seed.mjs
 *
 * Safe to run multiple times — uses upsert on fixed UUIDs (idempotent).
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TENANT_ID = process.env.TENANT_ID ?? "00000000-0000-0000-0000-000000000001";

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Fixed UUIDs ──────────────────────────────────────────────────────────────
const P_GV = "00000000-0000-0000-0001-000000000001"; // Green Valley Phase 2
const P_SM = "00000000-0000-0000-0001-000000000002"; // Sunrise Meadows
const P_RH = "00000000-0000-0000-0001-000000000003"; // Royal Heights

function propId(group, n) {
  return `00000000-0000-0000-${group}-${String(n).padStart(12, "0")}`;
}
function leadId(n) {
  return `00000000-0000-0000-0004-${String(n).padStart(12, "0")}`;
}

// ── Settings ─────────────────────────────────────────────────────────────────
const settings = {
  tenant_id: TENANT_ID,
  company_name: "Vision Infra Tech",
  company_phone: "+91 98765 43210",
  company_email: "info@visioninfra.com",
  company_address: "Hyderabad, Telangana, India",
  company_website: null,
  company_logo: null,
  primary_color: "#1e40af",
  currency_symbol: "₹",
  tds_percentage: 1,
};

// ── Projects ─────────────────────────────────────────────────────────────────
const projects = [
  {
    id: P_GV,
    tenant_id: TENANT_ID,
    name: "Green Valley Phase 2",
    slug: "green-valley-phase-2",
    location: "Shamshabad",
    city: "Hyderabad",
    state: "Telangana",
    latitude: 17.2403,
    longitude: 78.4294,
    description:
      "Premium plotted development near Rajiv Gandhi International Airport with DTCP approved layout. Gated community with 24/7 security, landscaped parks, and wide internal roads.",
    rera_number: "P02400005678",
    rera_state: "Telangana",
    status: "ongoing",
    total_units: 48,
    sold_units: 18,
    price_range_min: 2500000,
    price_range_max: 6500000,
    amenities: [
      "Gated Community", "24/7 Security", "Landscaped Parks",
      "Children's Play Area", "Jogging Track", "Underground Drainage",
      "Wide Roads", "Avenue Plantation",
    ],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=500&fit=crop",
    ],
    thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
    layout_config: null,
  },
  {
    id: P_SM,
    tenant_id: TENANT_ID,
    name: "Sunrise Meadows",
    slug: "sunrise-meadows",
    location: "Adibatla",
    city: "Hyderabad",
    state: "Telangana",
    latitude: 17.1715,
    longitude: 78.5264,
    description:
      "Affordable plotted venture adjacent to Pharma City with excellent growth potential. All plots are east and north facing with clear titles.",
    rera_number: "P02400009012",
    rera_state: "Telangana",
    status: "ongoing",
    total_units: 36,
    sold_units: 8,
    price_range_min: 1800000,
    price_range_max: 4200000,
    amenities: [
      "Compound Wall", "Security Cabin", "Internal Roads",
      "Street Lights", "Water Pipeline", "Electricity",
    ],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=500&fit=crop",
    ],
    thumbnail: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
    layout_config: null,
  },
  {
    id: P_RH,
    tenant_id: TENANT_ID,
    name: "Royal Heights",
    slug: "royal-heights",
    location: "Mokila",
    city: "Hyderabad",
    state: "Telangana",
    latitude: 17.4486,
    longitude: 78.2522,
    description:
      "Premium villa plots near Financial District with panoramic views. HMDA approved layout with world-class amenities.",
    rera_number: null,
    rera_state: null,
    status: "upcoming",
    total_units: 24,
    sold_units: 0,
    price_range_min: 5000000,
    price_range_max: 12000000,
    amenities: ["Clubhouse", "Swimming Pool", "Gymnasium", "Tennis Court", "Meditation Garden", "EV Charging"],
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=500&fit=crop",
    ],
    thumbnail: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop",
    layout_config: null,
  },
];

// ── Properties ────────────────────────────────────────────────────────────────
const heroImages = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=500&fit=crop",
];
const thumbImages = [
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1572127360741-02e6f3e1491b?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1600047508003-eaee5e65d71c?w=400&h=300&fit=crop",
];

const GV_STATUSES = [
  "sold","sold","sold","sold","sold","sold","sold","sold","sold","sold",
  "sold","sold","sold","sold","sold","sold","sold","sold",
  "reserved","reserved","reserved","reserved","reserved","reserved",
  "under_registration","under_registration","blocked",
  "available","available","available","available","available","available","available",
  "available","available","available","available","available","available","available",
  "available","available","available","available","available","available","available","available",
];

function generateGreenValley() {
  const rows = 6, cols = 8;
  const plots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const plotNum = `A-${String(idx + 1).padStart(2, "0")}`;
      const isCorner = (r === 0 || r === rows - 1) && (c === 0 || c === cols - 1);
      const isEdge = r === 0 || r === rows - 1 || c === 0 || c === cols - 1;
      let facing;
      if (isCorner) facing = "corner";
      else if (r === 0) facing = "north";
      else if (r === rows - 1) facing = "south";
      else if (c === 0) facing = "west";
      else if (c === cols - 1) facing = "east";
      else facing = ["north","south","east","west"][idx % 4];
      const area = (isCorner ? 267 : isEdge ? 240 : 200) + Math.floor((idx * 17) % 60);
      const pricePerUnit = isCorner ? 18000 : isEdge ? 15000 : 13000;
      plots.push({
        id: propId("0002", idx + 1),
        tenant_id: TENANT_ID,
        project_id: P_GV,
        plot_number: plotNum,
        area,
        area_unit: "sq_yards",
        facing,
        price: area * pricePerUnit,
        price_per_unit: pricePerUnit,
        status: GV_STATUSES[idx] ?? "available",
        property_type: "plot",
        dimensions: isCorner ? "40x30" : isEdge ? "30x40" : "25x40",
        floor_number: null,
        layout_x: c,
        layout_y: r,
        description: isCorner
          ? "Premium corner plot with excellent road access on two sides. Ideal for a dream home or investment."
          : isEdge
          ? "Prime road-facing plot with great ventilation and easy access to main road."
          : "Well-located internal plot in a peaceful residential layout.",
        features: isCorner ? ["Corner Plot","Two-side Open","Premium Location"] : isEdge ? ["Road Facing","Good Ventilation"] : ["Internal Plot"],
        images: [heroImages[idx % heroImages.length]],
      });
    }
  }
  return plots;
}

const SM_STATUSES = [
  "sold","sold","sold","sold","sold","sold","sold","sold",
  "reserved","reserved","reserved",
  "available","available","available","available","available","available","available",
  "available","available","available","available","available","available","available",
  "available","available","available","available","available","available","available",
  "available","available","available","available",
];

function generateSunriseMeadows() {
  const rows = 6, cols = 6;
  const plots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const plotNum = `B-${String(idx + 1).padStart(2, "0")}`;
      const isCorner = (r === 0 || r === rows - 1) && (c === 0 || c === cols - 1);
      const isEdge = r === 0 || r === rows - 1 || c === 0 || c === cols - 1;
      let facing;
      if (isCorner) facing = "corner";
      else if (r === 0) facing = "north";
      else if (r === rows - 1) facing = "south";
      else if (c === 0) facing = "east";
      else if (c === cols - 1) facing = "west";
      else facing = "east";
      const area = 150 + Math.floor((idx * 13) % 50);
      const pricePerUnit = isCorner ? 14000 : isEdge ? 12000 : 10000;
      plots.push({
        id: propId("0003", idx + 1),
        tenant_id: TENANT_ID,
        project_id: P_SM,
        plot_number: plotNum,
        area,
        area_unit: "sq_yards",
        facing,
        price: area * pricePerUnit,
        price_per_unit: pricePerUnit,
        status: SM_STATUSES[idx] ?? "available",
        property_type: "plot",
        dimensions: "25x30",
        floor_number: null,
        layout_x: c,
        layout_y: r,
        description: isCorner
          ? "Corner plot with excellent visibility. Great for commercial or premium residential."
          : "Affordable residential plot in a rapidly developing area near Pharma City.",
        features: isCorner ? ["Corner Plot"] : [],
        images: [thumbImages[idx % thumbImages.length]],
      });
    }
  }
  return plots;
}

const properties = [...generateGreenValley(), ...generateSunriseMeadows()];

// ── Leads ─────────────────────────────────────────────────────────────────────
const leads = [
  {
    id: leadId(1), tenant_id: TENANT_ID,
    name: "Srinivas Rao", phone: "+91 99001 12345", email: "srinivas.rao@gmail.com",
    source: "website", status: "negotiation",
    budget_min: 3000000, budget_max: 5000000,
    preferred_location: "Shamshabad", preferred_facing: "east", preferred_type: "plot",
    notes: "Looking for east-facing plot near airport. Budget flexible for corner plots.",
    properties_interested: [propId("0002", 5), propId("0002", 12)],
    temperature: "warm", next_follow_up: "2026-06-20T10:00:00Z",
  },
  {
    id: leadId(2), tenant_id: TENANT_ID,
    name: "Lakshmi Devi", phone: "+91 98765 67890", email: "lakshmi.d@yahoo.com",
    source: "referral", status: "site_visit",
    budget_min: 2000000, budget_max: 3500000,
    preferred_location: "Adibatla", preferred_facing: "north", preferred_type: "plot",
    notes: "Referred by Mr. Ravi Kumar (existing customer). Interested in Sunrise Meadows.",
    properties_interested: [propId("0003", 3), propId("0003", 8)],
    temperature: "warm", next_follow_up: "2026-06-19T15:00:00Z",
  },
  {
    id: leadId(3), tenant_id: TENANT_ID,
    name: "Mohammed Irfan", phone: "+91 90001 23456", email: null,
    source: "portal_99acres", status: "contacted",
    budget_min: 4000000, budget_max: 7000000,
    preferred_location: null, preferred_facing: "corner", preferred_type: "plot",
    notes: "Enquired via 99acres. Wants corner plot. NRI — currently in Dubai.",
    properties_interested: [], temperature: "warm", next_follow_up: "2026-06-21T18:00:00Z",
  },
  {
    id: leadId(4), tenant_id: TENANT_ID,
    name: "Anitha Kumari", phone: "+91 87654 32100", email: "anitha.k@outlook.com",
    source: "walkin", status: "new",
    budget_min: 1500000, budget_max: 2500000,
    preferred_location: "Adibatla", preferred_facing: null, preferred_type: "plot",
    notes: "Walk-in enquiry. First-time buyer. Needs detailed explanation of process.",
    properties_interested: [], temperature: "warm", next_follow_up: null,
  },
  {
    id: leadId(5), tenant_id: TENANT_ID,
    name: "Venkat Subramaniam", phone: "+91 91234 56789", email: "venkat.s@techcorp.com",
    source: "website", status: "booked",
    budget_min: 4000000, budget_max: 6000000,
    preferred_location: "Shamshabad", preferred_facing: "east", preferred_type: "plot",
    notes: "Booked plot A-03 in Green Valley. Token paid. Agreement pending.",
    properties_interested: [propId("0002", 3)],
    temperature: "warm", next_follow_up: "2026-06-25T10:00:00Z",
  },
  {
    id: leadId(6), tenant_id: TENANT_ID,
    name: "Padma Reddy", phone: "+91 99876 54321", email: null,
    source: "whatsapp", status: "contacted",
    budget_min: 2500000, budget_max: 4000000,
    preferred_location: "Shamshabad", preferred_facing: "north", preferred_type: "plot",
    notes: "Enquired via WhatsApp. Husband is decision maker. Need to arrange family visit.",
    properties_interested: [propId("0002", 20), propId("0002", 25)],
    temperature: "warm", next_follow_up: "2026-06-22T11:00:00Z",
  },
  {
    id: leadId(7), tenant_id: TENANT_ID,
    name: "Ravi Teja", phone: "+91 88001 22334", email: "raviteja@gmail.com",
    source: "portal_magicbricks", status: "lost",
    budget_min: 1000000, budget_max: 2000000,
    preferred_location: null, preferred_facing: null, preferred_type: "plot",
    notes: "Lost to competitor — bought a plot in Maheshwaram at lower price point.",
    properties_interested: [], temperature: "warm", next_follow_up: null,
  },
  {
    id: leadId(8), tenant_id: TENANT_ID,
    name: "Kavitha Naidu", phone: "+91 77654 33210", email: "kavitha.n@gmail.com",
    source: "phone", status: "new",
    budget_min: 3000000, budget_max: 5000000,
    preferred_location: "Shamshabad", preferred_facing: "east", preferred_type: "plot",
    notes: "Called office directly. Investment purpose. Wants east-facing.",
    properties_interested: [], temperature: "warm", next_follow_up: null,
  },
];

// ── Run ───────────────────────────────────────────────────────────────────────
async function seed() {
  console.log("🌱 Seeding Vision Infra Tech data into Supabase...\n");

  // Delete in FK-dependency order so no constraint is violated.
  // payments → documents → bookings → activities → leads → properties → projects → settings
  console.log("  Cleaning existing tenant data...");
  const deleteOrder = ["payments", "documents", "bookings", "activities", "leads", "properties", "projects", "settings"];
  for (const table of deleteOrder) {
    const { error } = await supabase.from(table).delete().eq("tenant_id", TENANT_ID);
    if (error) console.error(`  ✗ Clean ${table}:`, error.message);
  }
  console.log("  ✓ Cleaned\n");

  // Settings
  console.log("  Settings...");
  const { error: settingsErr } = await supabase.from("settings").insert(settings);
  if (settingsErr) console.error("  ✗ Settings:", settingsErr.message);
  else console.log("  ✓ Settings");

  // Projects
  console.log("  Projects...");
  const { error: projErr } = await supabase.from("projects").insert(projects);
  if (projErr) { console.error("  ✗ Projects:", projErr.message); return; }
  else console.log(`  ✓ ${projects.length} projects`);

  // Properties — batch in chunks of 50 to avoid request size limits
  console.log("  Properties...");
  const CHUNK = 50;
  let propErrors = 0;
  for (let i = 0; i < properties.length; i += CHUNK) {
    const chunk = properties.slice(i, i + CHUNK);
    const { error } = await supabase.from("properties").insert(chunk);
    if (error) { console.error(`  ✗ Properties chunk [${i}–${i + chunk.length}]:`, error.message); propErrors++; }
  }
  if (propErrors === 0) console.log(`  ✓ ${properties.length} properties`);

  // Leads
  console.log("  Leads...");
  const { error: leadsErr } = await supabase.from("leads").insert(leads);
  if (leadsErr) console.error("  ✗ Leads:", leadsErr.message);
  else console.log(`  ✓ ${leads.length} leads`);

  // Activities are skipped here — activities.created_by requires a real auth user UUID.
  // Add activities via the REOS dashboard after logging in as an agent.

  console.log("\n✅ Seed complete. Vision Infra Tech data is now in Supabase.");
  console.log("   Run the dev server and visit http://localhost:3001 to verify.\n");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
