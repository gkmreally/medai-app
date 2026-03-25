import { supabase, hasSupabaseEnv } from "./supabase";

export async function listAppointments() {
  if (!hasSupabaseEnv) {
    return { data: [], error: new Error("缺少 Supabase 环境变量，请先配置 frontend/.env") };
  }
  return await supabase
    .from("appointments")
    .select("id, patient_name, visit_date, visit_type, note, created_at")
    .order("visit_date", { ascending: true });
}
