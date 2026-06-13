import type { WizardState } from "@/types/wizard";

// =====================================================================
// Funeral Compass — saved plans, submission, mock payment
// Storage-agnostic types shared by the local and Supabase repositories.
// =====================================================================

export type PlanStatus = "draft" | "submitted" | "deposit_confirmed";

export interface SubmissionInfo {
  /** Human reference, e.g. FC-2026-XK3M9 */
  reference: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  /** Preferred office/location of the funeral home */
  office?: string;
  message?: string;
  submittedAt: string; // ISO
}

export interface MockPaymentInfo {
  /** Always a demo payment — never real money. */
  reference: string;
  amount: number; // EUR, gross
  method: "demo";
  confirmedAt: string; // ISO
}

export interface SavedPlan {
  id: string;
  /** User-given name, e.g. "Plan für Mutter" */
  name: string;
  status: PlanStatus;
  state: WizardState;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  submission?: SubmissionInfo;
  payment?: MockPaymentInfo;
  /** Owner (email in local mode, user id in Supabase mode). Empty = guest. */
  owner: string;
}

export interface PlanRepository {
  /** Which backend is active — surfaced in the UI so demo mode is honest. */
  readonly backend: "local" | "supabase";
  list(owner: string): Promise<SavedPlan[]>;
  get(id: string): Promise<SavedPlan | null>;
  create(input: { name: string; state: WizardState; owner: string }): Promise<SavedPlan>;
  update(
    id: string,
    patch: Partial<Pick<SavedPlan, "name" | "state" | "status" | "submission" | "payment">>,
  ): Promise<SavedPlan>;
  remove(id: string): Promise<void>;
}

export const newPlanId = () =>
  (crypto?.randomUUID ? crypto.randomUUID() : `plan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

export const newReference = () => {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no easily-confused chars
  let suffix = "";
  for (let i = 0; i < 5; i++) suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `FC-${new Date().getFullYear()}-${suffix}`;
};
