import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLang } from "@/lib/i18n";
import { getRepository, useOwner } from "@/lib/plans";
import { newReference, type SavedPlan } from "@/lib/plans/types";
import { exportInvoicePdf } from "@/lib/invoicePdf";
import { calculateTotal, formatEUR, type WizardState } from "@/types/wizard";
import { toast } from "sonner";
import { BookmarkPlus, FileText, HandCoins, Send } from "lucide-react";

// =====================================================================
// PlanActions — save / submit (US 19) / demo deposit / demo invoice.
// Lives in the summary sidebar under Download PDF & Start over.
// =====================================================================

const ACTIVE_PLAN_KEY = "funeral-compass:active-plan-id";
const DEPOSIT_RATE = 0.1; // 10% booking deposit (demo)

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const OFFICES = [
  "Eppingen",
  "Sinsheim",
  "Gemmingen",
  "Schwaigern",
  "Trauerhalle Mühlbach",
];

interface Props {
  state: WizardState;
}

export const PlanActions = ({ state }: Props) => {
  const { t, lang } = useLang();
  const owner = useOwner();
  const repo = getRepository();

  const [activePlan, setActivePlan] = useState<SavedPlan | null>(null);

  // dialogs
  const [saveOpen, setSaveOpen] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);

  // save form
  const [planName, setPlanName] = useState("");
  // submit form
  const [cName, setCName] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [cPhone, setCPhone] = useState("");
  const [cOffice, setCOffice] = useState("");
  const [cMessage, setCMessage] = useState("");
  const [busy, setBusy] = useState(false);

  // restore the plan this wizard state belongs to (if it was saved before)
  useEffect(() => {
    try {
      const id = localStorage.getItem(ACTIVE_PLAN_KEY);
      if (id) repo.get(id).then((p) => setActivePlan(p));
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rememberActive = (plan: SavedPlan) => {
    setActivePlan(plan);
    try {
      localStorage.setItem(ACTIVE_PLAN_KEY, plan.id);
    } catch {
      // ignore
    }
  };

  const savePlan = async () => {
    const name = planName.trim();
    if (!name) return;
    setBusy(true);
    try {
      if (activePlan) {
        const updated = await repo.update(activePlan.id, { name, state });
        rememberActive(updated);
      } else {
        const created = await repo.create({ name, state, owner });
        rememberActive(created);
      }
      setSaveOpen(false);
      toast(t("sv_saved"), { description: t("sv_savedDesc") });
    } catch (e) {
      toast.error(t("sv_error"), { description: String(e) });
    } finally {
      setBusy(false);
    }
  };

  const submitPlan = async () => {
    if (!cName.trim() || !isValidEmail(cEmail)) {
      toast(t("sb_required"));
      return;
    }
    setBusy(true);
    try {
      // ensure the plan exists (auto-save if the user never saved)
      let plan = activePlan;
      if (!plan) {
        plan = await repo.create({ name: cName.trim(), state, owner });
      } else {
        plan = await repo.update(plan.id, { state });
      }
      const submission = {
        reference: newReference(),
        contactName: cName.trim(),
        contactEmail: cEmail.trim(),
        contactPhone: cPhone.trim() || undefined,
        office: cOffice || undefined,
        message: cMessage.trim() || undefined,
        submittedAt: new Date().toISOString(),
      };
      const updated = await repo.update(plan.id, { status: "submitted", submission });
      rememberActive(updated);
      setSubmitOpen(false);
      toast(t("sb_sent"), { description: t("sb_sentDesc", { ref: submission.reference }) });
    } catch (e) {
      toast.error(t("sb_error"), { description: String(e) });
    } finally {
      setBusy(false);
    }
  };

  const total = calculateTotal(state, lang);
  const deposit = Math.round(total * DEPOSIT_RATE);

  const confirmDeposit = async () => {
    if (!activePlan) return;
    setBusy(true);
    try {
      const payment = {
        reference: activePlan.submission?.reference ?? newReference(),
        amount: deposit,
        method: "demo" as const,
        confirmedAt: new Date().toISOString(),
      };
      const updated = await repo.update(activePlan.id, { status: "deposit_confirmed", payment });
      rememberActive(updated);
      setPayOpen(false);
      toast(t("pay_done"), { description: t("pay_doneDesc") });
    } finally {
      setBusy(false);
    }
  };

  const submitted = activePlan?.status === "submitted" || activePlan?.status === "deposit_confirmed";
  const paid = activePlan?.status === "deposit_confirmed";

  return (
    <div className="mt-2 space-y-2">
      {/* Save plan */}
      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            className="w-full gap-2"
            onClick={() => setPlanName(activePlan?.name ?? state.deceasedName ?? "")}
          >
            <BookmarkPlus className="h-4 w-4" /> {t("sv_save")}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("sv_title")}</DialogTitle>
            <DialogDescription>{t("sv_desc")}</DialogDescription>
          </DialogHeader>
          <label className="text-sm font-medium text-foreground" htmlFor="plan-name">
            {t("sv_nameLabel")}
          </label>
          <Input
            id="plan-name"
            value={planName}
            placeholder={t("sv_namePlaceholder")}
            onChange={(e) => setPlanName(e.target.value)}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveOpen(false)}>
              {t("sv_cancel")}
            </Button>
            <Button onClick={() => void savePlan()} disabled={busy || !planName.trim()}>
              {t("sv_confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit to funeral home (US 19) */}
      {!submitted ? (
        <Dialog open={submitOpen} onOpenChange={setSubmitOpen}>
          <DialogTrigger asChild>
            <Button className="w-full gap-2" variant="default">
              <Send className="h-4 w-4" /> {t("sb_submit")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("sb_title")}</DialogTitle>
              <DialogDescription>{t("sb_desc")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Input placeholder={t("sb_name")} value={cName} onChange={(e) => setCName(e.target.value)} />
              <Input
                type="email"
                placeholder={t("sb_email")}
                value={cEmail}
                onChange={(e) => setCEmail(e.target.value)}
              />
              <Input placeholder={t("sb_phone")} value={cPhone} onChange={(e) => setCPhone(e.target.value)} />
              <Select value={cOffice} onValueChange={setCOffice}>
                <SelectTrigger>
                  <SelectValue placeholder={t("sb_office")} />
                </SelectTrigger>
                <SelectContent>
                  {OFFICES.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                placeholder={t("sb_message")}
                value={cMessage}
                onChange={(e) => setCMessage(e.target.value)}
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSubmitOpen(false)}>
                {t("sv_cancel")}
              </Button>
              <Button onClick={() => void submitPlan()} disabled={busy}>
                {t("sb_confirm")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <p className="rounded-lg bg-primary/10 px-3 py-2 text-center text-xs font-medium text-primary">
          {t("sb_submittedBadge", { ref: activePlan?.submission?.reference ?? "" })}
        </p>
      )}

      {/* Demo deposit — only after submission, framed as confirmation via the funeral home */}
      {submitted && !paid && (
        <Dialog open={payOpen} onOpenChange={setPayOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" className="w-full gap-2">
              <HandCoins className="h-4 w-4" /> {t("pay_button")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <div className="-mx-6 -mt-6 mb-2 rounded-t-lg bg-destructive px-6 py-2 text-center text-xs font-semibold uppercase tracking-wide text-destructive-foreground">
              {t("pay_demoBanner")}
            </div>
            <DialogHeader>
              <DialogTitle>{t("pay_title")}</DialogTitle>
              <DialogDescription>{t("pay_desc")}</DialogDescription>
            </DialogHeader>
            <div className="flex items-baseline justify-between rounded-xl border border-border bg-muted/40 px-4 py-3">
              <span className="text-sm text-muted-foreground">{t("pay_amount")}</span>
              <span className="text-lg font-semibold text-foreground">{formatEUR(deposit, lang)}</span>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPayOpen(false)}>
                {t("sv_cancel")}
              </Button>
              <Button onClick={() => void confirmDeposit()} disabled={busy}>
                {t("pay_confirm")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Demo invoice — available once the deposit is confirmed */}
      {paid && activePlan && (
        <Button variant="outline" className="w-full gap-2" onClick={() => exportInvoicePdf(activePlan, lang)}>
          <FileText className="h-4 w-4" /> {t("inv_download")}
        </Button>
      )}
    </div>
  );
};
