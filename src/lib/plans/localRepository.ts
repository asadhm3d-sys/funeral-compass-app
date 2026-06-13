import type { WizardState } from "@/types/wizard";
import { newPlanId, type PlanRepository, type SavedPlan } from "./types";

// =====================================================================
// LocalRepository — persists plans in the browser's localStorage.
// Used when no Supabase project is configured (default / demo mode).
// =====================================================================

const KEY = "funeral-compass:plans:v1";

const readAll = (): SavedPlan[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedPlan[]) : [];
  } catch {
    return [];
  }
};

const writeAll = (plans: SavedPlan[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(plans));
  } catch {
    // storage full / blocked — silently ignore, matching app conventions
  }
};

export class LocalRepository implements PlanRepository {
  readonly backend = "local" as const;

  async list(owner: string): Promise<SavedPlan[]> {
    return readAll()
      .filter((p) => p.owner === owner)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async get(id: string): Promise<SavedPlan | null> {
    return readAll().find((p) => p.id === id) ?? null;
  }

  async create(input: { name: string; state: WizardState; owner: string }): Promise<SavedPlan> {
    const now = new Date().toISOString();
    const plan: SavedPlan = {
      id: newPlanId(),
      name: input.name,
      status: "draft",
      state: input.state,
      owner: input.owner,
      createdAt: now,
      updatedAt: now,
    };
    writeAll([plan, ...readAll()]);
    return plan;
  }

  async update(
    id: string,
    patch: Partial<Pick<SavedPlan, "name" | "state" | "status" | "submission" | "payment">>,
  ): Promise<SavedPlan> {
    const all = readAll();
    const idx = all.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error(`Plan not found: ${id}`);
    const updated: SavedPlan = { ...all[idx], ...patch, updatedAt: new Date().toISOString() };
    all[idx] = updated;
    writeAll(all);
    return updated;
  }

  async remove(id: string): Promise<void> {
    writeAll(readAll().filter((p) => p.id !== id));
  }
}
