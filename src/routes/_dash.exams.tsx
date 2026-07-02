import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, ListChecks, Play } from "lucide-react";
import { EXAMS, type Exam, type ExamProvider } from "@/data/mock";
import { SetupWizard } from "@/components/SetupWizard";

export const Route = createFileRoute("/_dash/exams")({
  head: () => ({
    meta: [
      { title: "Full-Length Exams — NaluPrep" },
      { name: "description", content: "Browse full-length SAT practice exams from College Board, Princeton Review, and NaluPrep Originals." },
    ],
  }),
  component: ExamsPage,
});

const PROVIDERS: (ExamProvider | "All")[] = [
  "All",
  "Official College Board",
  "Princeton Review",
  "NaluPrep Originals",
];

function ExamsPage() {
  const [filter, setFilter] = useState<ExamProvider | "All">("All");
  const [active, setActive] = useState<Exam | null>(null);

  const exams = filter === "All" ? EXAMS : EXAMS.filter((e) => e.provider === filter);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">Full-Length Exams</h1>
        <p className="mt-1 text-muted-foreground">
          Simulate the real digital SAT — 4 adaptive modules, official timing.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {PROVIDERS.map((p) => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
              filter === p
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card/80 backdrop-blur-sm transition-all hover:shadow-[var(--shadow-soft)]"
          >
            <div className={`h-24 bg-gradient-to-br ${exam.color}`} />
            <div className="flex flex-1 flex-col p-5">
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                {exam.provider}
              </span>
              <h3 className="mt-1 text-lg font-bold">{exam.name}</h3>
              <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ListChecks className="h-4 w-4" /> {exam.questions} Qs
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {exam.minutes} min
                </span>
              </div>
              <button
                onClick={() => setActive(exam)}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Play className="h-4 w-4" /> Start Test
              </button>
            </div>
          </div>
        ))}
      </div>

      {active && <SetupWizard exam={active} onClose={() => setActive(null)} />}
    </div>
  );
}
