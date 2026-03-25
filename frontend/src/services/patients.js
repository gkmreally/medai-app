import { supabase, hasSupabaseEnv } from "./supabase";

export async function listPatients() {
  if (!hasSupabaseEnv) {
    return { data: [], error: new Error("缺少 Supabase 环境变量，请先配置 frontend/.env") };
  }
  return await supabase
    .from("patients")
    .select("*")
    .order("created_at", { ascending: false });
}

export async function createPatient(payload) {
  if (!hasSupabaseEnv) {
    return { data: null, error: new Error("缺少 Supabase 环境变量，请先配置 frontend/.env") };
  }
  return await supabase.from("patients").insert([payload]).select().single();
}

export async function deletePatient(id) {
  if (!hasSupabaseEnv) {
    return { error: new Error("缺少 Supabase 环境变量，请先配置 frontend/.env") };
  }
  return await supabase.from("patients").delete().eq("id", id);
}
