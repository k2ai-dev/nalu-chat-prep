import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { X, ShieldAlert, Check, ChevronRight, Clock, Pause } from "lucide-react";
import type { Exam } from "@/data/mock";
import { setPendingTest } from "@/lib/testStore";

export function SetupWizard({ exam, onClose }: { exam: Exam; onClose: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [pauseEnabled, setPauseEnabled] = useState(false);
  const [timeMode, setTimeMode] = useState<"regular" | "custom">("regular");
  const [customMinutes, setCustomMinutes] = useState(32);

  function launch() {
    setPendingTest({
      exam,
      pauseEnabled,
      timeMode,
      customMinutes,
      practiceMode: false,
      reviewMode: false,
    });
    navigate({ to: "/test" });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-float)]">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Test Setup · Step {step} of 2
            </p>
            <h2 className="text-lg font-bold">{exam.name}</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-accent">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold">Enable Pause Feature for this test session?</h3>
              <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  <strong>Caution:</strong> Your time will not stop on the actual SAT test if you go to
                  the toilet or anywhere else. Practicing without pauses builds real stamina.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => setPauseEnabled(true)}
                  className={`flex flex-col items-start gap-1 rounded-2xl border-2 p-4 text-left transition-colors ${
                    pauseEnabled ? "border-primary bg-accent" : "border-border hover:border-primary/40"
                  }`}
                >
                  <Pause className="h-5 w-5 text-primary" />
                  <span className="font-bold">Yes, Enable Pause</span>
                  <span className="text-xs text-muted-foreground">Relaxed practice mode</span>
                </button>
                <button
                  onClick={() => setPauseEnabled(false)}
                  className={`flex flex-col items-start gap-1 rounded-2xl border-2 p-4 text-left transition-colors ${
                    !pauseEnabled ? "border-primary bg-accent" : "border-border hover:border-primary/40"
                  }`}
                >
                  <ShieldAlert className="h-5 w-5 text-primary" />
                  <span className="font-bold">No, Keep it Strict</span>
                  <span className="text-xs text-muted-foreground">True exam conditions</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold">Custom Time Limits</h3>
              <p className="text-sm text-muted-foreground">
                Configure module duration parameters for this session.
              </p>
              <label className="block">
                <span className="text-sm font-semibold">Timing Mode</span>
                <select
                  value={timeMode}
                  onChange={(e) => setTimeMode(e.target.value as "regular" | "custom")}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                >
                  <option value="regular">Regular (Official SAT timing)</option>
                  <option value="custom">Custom (Set your own limits)</option>
                </select>
              </label>
              {timeMode === "custom" && (
                <label className="block">
                  <span className="text-sm font-semibold">Minutes per Reading &amp; Writing module</span>
                  <select
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                  >
                    {[15, 20, 25, 32, 40, 45].map((m) => (
                      <option key={m} value={m}>
                        {m} minutes
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <div className="flex items-center gap-2 rounded-xl bg-accent p-3 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span>
                  Pause: <strong>{pauseEnabled ? "Enabled" : "Strict"}</strong> · Timing:{" "}
                  <strong className="capitalize">{timeMode}</strong>
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <button
            onClick={() => (step === 1 ? onClose() : setStep(1))}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-accent"
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>
          {step === 1 ? (
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={launch}
              className="inline-flex items-center gap-1 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90"
            >
              <Check className="h-4 w-4" /> Begin Test
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
