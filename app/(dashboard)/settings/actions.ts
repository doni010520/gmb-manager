"use server";

import { createClient } from "@/lib/supabase/server";

export async function getUserProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Nao autenticado");

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("auth_id", user.id)
    .single();

  if (!data) throw new Error("Usuario nao encontrado");
  return data;
}

export async function updateUserProfile(payload: {
  name?: string;
  office_name?: string;
  phone?: string;
  slug?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Nao autenticado");

  const { data, error } = await supabase
    .from("users")
    .update(payload)
    .eq("auth_id", user.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
