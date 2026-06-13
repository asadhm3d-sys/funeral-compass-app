import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { WizardState } from "@/types/wizard";
import type { PlanRepository, SavedPlan } from "./types";

// =====================================================================
// SupabaseRepository — used automatically when the project is configured:
//   VITE_SUPABASE_URL=...      VITE_SUPABASE_ANON_KEY=...
// Schema + RLS policies: see supabase/schema.sql in the repo root.
// =====================================================================

type Row = {
  id: string;
  name: string;
  status: SavedPlan["status"];
  state: WizardState;
  submission: SavedPlan["submission"] | null;
  payment: SavedPlan["payment"] | null;
  owner: string;
  created_at: string;
  updated_at: string;
};

const toPlan = (r: Row): SavedPlan => ({
  id: r.id,
  name: r.name,
  status: r.status,
  state: r.state,
  submission: r.submission ?? undefined,
  payment: r.payment ?? undefined,
  owner: r.owner,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

export const supabaseEnv = () => {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  return url && key ? { url, key } : null;
};

let cached: SupabaseClient | null = null;
export const getSupabase = (): SupabaseClient | null => {
  const env = supabaseEnv();
  if (!env) return null;
  if (!cached) cached = createClient(env.url, env.key);
  return cached;
};

export class SupabaseRepository implements PlanRepository {
  readonly backend = "supabase" as const;
  constructor(private client: SupabaseClient) {}

  async list(owner: string): Promise<SavedPlan[]> {
    const { data, error } = await this.client
      .from("plans")
      .select("*")
      .eq("owner", owner)
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return (data as Row[]).map(toPlan);
  }

  async get(id: string): Promise<SavedPlan | null> {
    const { data, error } = await this.client.from("plans").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? toPlan(data as Row) : null;
  }

  async create(input: { name: string; state: WizardState; owner: string }): Promise<SavedPlan> {
    const { data, error } = await this.client
      .from("plans")
      .insert({ name: input.name, state: input.state, owner: input.owner, status: "draft" })
      .select()
      .single();
    if (error) throw error;
    return toPlan(data as Row);
  }

  async update(
    id: string,
    patch: Partial<Pick<SavedPlan, "name" | "state" | "status" | "submission" | "payment">>,
  ): Promise<SavedPlan> {
    const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (patch.name !== undefined) row.name = patch.name;
    if (patch.state !== undefined) row.state = patch.state;
    if (patch.status !== undefined) row.status = patch.status;
    if (patch.submission !== undefined) row.submission = patch.submission;
    if (patch.payment !== undefined) row.payment = patch.payment;
    const { data, error } = await this.client.from("plans").update(row).eq("id", id).select().single();
    if (error) throw error;
    return toPlan(data as Row);
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.client.from("plans").delete().eq("id", id);
    if (error) throw error;
  }
}
