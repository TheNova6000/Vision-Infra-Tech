import { createAdminClient } from "./admin";
import type { Project, Property, Settings } from "@/types/database";

const TENANT_ID = process.env.TENANT_ID;

function tenantEq(query: any) {
  if (TENANT_ID) return query.eq("tenant_id", TENANT_ID);
  return query;
}

export async function getProjects(): Promise<Project[]> {
  const supabase = createAdminClient();
  if (!supabase || !TENANT_ID) return [];

  let query = supabase
    .from("projects")
    .select("*")
    .neq("status", "upcoming")
    .order("created_at", { ascending: false });
  query = tenantEq(query);

  const { data } = await query;
  return (data as Project[]) ?? [];
}

export async function getAllProjects(): Promise<Project[]> {
  const supabase = createAdminClient();
  if (!supabase || !TENANT_ID) return [];

  let query = supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  query = tenantEq(query);

  const { data } = await query;
  return (data as Project[]) ?? [];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = createAdminClient();
  if (!supabase || !TENANT_ID) return null;

  let query = supabase.from("projects").select("*").eq("slug", slug);
  query = tenantEq(query);

  const { data } = await query.single();
  return (data as Project) ?? null;
}

export async function getProperties(filters?: {
  status?: string;
  projectId?: string;
  propertyType?: string;
  facing?: string;
  budgetMin?: number;
  budgetMax?: number;
}): Promise<Property[]> {
  const supabase = createAdminClient();
  if (!supabase || !TENANT_ID) return [];

  let query = supabase.from("properties").select("*");
  query = tenantEq(query);

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.projectId) query = query.eq("project_id", filters.projectId);
  if (filters?.propertyType) query = query.eq("property_type", filters.propertyType);
  if (filters?.facing) query = query.eq("facing", filters.facing);
  if (filters?.budgetMin) query = query.gte("price", filters.budgetMin);
  if (filters?.budgetMax) query = query.lte("price", filters.budgetMax);

  const { data } = await query.order("plot_number");
  return (data as Property[]) ?? [];
}

export async function getPropertiesByProject(projectId: string): Promise<Property[]> {
  const supabase = createAdminClient();
  if (!supabase || !TENANT_ID) return [];

  let query = supabase
    .from("properties")
    .select("*")
    .eq("project_id", projectId)
    .order("plot_number");
  query = tenantEq(query);

  const { data } = await query;
  return (data as Property[]) ?? [];
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const supabase = createAdminClient();
  if (!supabase || !TENANT_ID) return null;

  let query = supabase.from("properties").select("*").eq("id", id);
  query = tenantEq(query);

  const { data } = await query.single();
  return (data as Property) ?? null;
}

export async function getPublicStats() {
  const empty = { activeProjects: 0, availableProperties: 0, soldProperties: 0, totalProperties: 0 };
  const supabase = createAdminClient();
  if (!supabase || !TENANT_ID) return empty;

  let projectsQuery = supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .neq("status", "upcoming");
  projectsQuery = tenantEq(projectsQuery);

  let propsQuery = supabase.from("properties").select("status");
  propsQuery = tenantEq(propsQuery);

  const [projectsRes, propertiesRes] = await Promise.all([projectsQuery, propsQuery]);

  const properties = (propertiesRes.data ?? []) as { status: string }[];
  return {
    activeProjects: projectsRes.count ?? 0,
    availableProperties: properties.filter((p) => p.status === "available").length,
    soldProperties: properties.filter((p) => p.status === "sold").length,
    totalProperties: properties.length,
  };
}

export async function getTenantSettings(): Promise<Settings | null> {
  const supabase = createAdminClient();
  if (!supabase || !TENANT_ID) return null;

  const { data } = await supabase
    .from("settings")
    .select("*")
    .eq("tenant_id", TENANT_ID)
    .single();
  return (data as Settings) ?? null;
}
