"use server";

import { createClient } from "@/lib/supabase/server";

interface ContactFormState {
  success: boolean;
  error?: string;
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = (formData.get("email") as string) || null;
  const interest = formData.get("interest") as string;
  const message = formData.get("message") as string;

  if (!name || !phone) {
    return { success: false, error: "Name and phone are required." };
  }

  const notes = [
    interest ? `Interest: ${interest}` : null,
    message || null,
  ]
    .filter(Boolean)
    .join("\n");

  const supabase = await createClient();
  if (!supabase) {
    return { success: true };
  }

  const { error } = await supabase.from("leads").insert({
    ...(process.env.TENANT_ID ? { tenant_id: process.env.TENANT_ID } : {}),
    name,
    phone,
    email,
    source: "website" as const,
    status: "new" as const,
    notes: notes || null,
  });

  if (error) {
    return { success: false, error: "Something went wrong. Please try again." };
  }

  return { success: true };
}

export async function submitPlotApplication(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = (formData.get("email") as string) || null;
  const message = formData.get("message") as string;
  const propertyId = formData.get("propertyId") as string;
  const plotNumber = formData.get("plotNumber") as string;
  const projectName = formData.get("projectName") as string;

  if (!name || !phone) {
    return { success: false, error: "Name and phone are required." };
  }

  const notes = [
    `Applied for: ${projectName} - Plot ${plotNumber}`,
    message || null,
  ]
    .filter(Boolean)
    .join("\n");

  const supabase = await createClient();
  if (!supabase) {
    return { success: true };
  }

  const { error } = await supabase.from("leads").insert({
    ...(process.env.TENANT_ID ? { tenant_id: process.env.TENANT_ID } : {}),
    name,
    phone,
    email,
    source: "website" as const,
    status: "new" as const,
    notes,
    properties_interested: propertyId ? [propertyId] : [],
  });

  if (error) {
    return { success: false, error: "Something went wrong. Please try again." };
  }

  return { success: true };
}
