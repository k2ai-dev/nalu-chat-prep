import { useState } from "react";
import { X, UploadCloud, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function BugReportModal({
  onClose,
  questionIndex,
}: {
  onClose: () => void;
  questionIndex: number;
}) {
  const [fileName, setFileName] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Bug report submitted. Thank you!");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card shadow-[var(--shadow-float)]"
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card px-5 py-3">
          <h2 className="font-bold">Report a Bug</h2>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 hover:bg-accent">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <Field label="Email">
            <input type="email" required placeholder="you@example.com" className={inputCls} />
          </Field>

          <Field label="Description">
            <textarea
              required
              placeholder="Describe what went wrong…"
              className={`${inputCls} h-24 resize-none`}
            />
          </Field>

          <Field label="URL">
            <input type="url" placeholder="https://…" className={inputCls} defaultValue="/test" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Urgency">
              <select className={inputCls} defaultValue="medium">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </Field>
            <Field label="Category">
              <select className={inputCls} defaultValue="question">
                <option value="question">Question content</option>
                <option value="ui">UI / Layout</option>
                <option value="timer">Timer</option>
                <option value="calculator">Calculator</option>
                <option value="other">Other</option>
              </select>
            </Field>
          </div>

          <Field label="Question Index">
            <input type="number" className={inputCls} defaultValue={questionIndex} />
          </Field>

          <Field label="Attachment">
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border p-6 text-center text-sm text-muted-foreground hover:border-primary/40">
              <UploadCloud className="h-6 w-6" />
              {fileName ? (
                <span className="font-semibold text-foreground">{fileName}</span>
              ) : (
                <span>Drop a screenshot here or click to upload</span>
              )}
              <input
                type="file"
                className="hidden"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
              />
            </label>
          </Field>
        </div>

        <div className="sticky bottom-0 border-t border-border bg-card px-5 py-4">
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white hover:opacity-90"
          >
            Submit <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
    </label>
  );
}
