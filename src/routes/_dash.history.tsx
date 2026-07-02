import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, BookOpen, Calculator, Search } from "lucide-react";
import { PAST_SCORES } from "@/data/mock";

export const Route = createFileRoute("/_dash/history")({
  head: () => ({
    meta: [
      { title: "Performance History — NaluPrep" },
      { name: "description", content: "Review all your completed SAT exams, section breakdowns, and score history." },
    ],
  }),
  component: HistoryPage,
});

function scoreColor(total: number) {
  if (total >= 1400) return "from-emerald-500 to-cyan-500";
  if (total >= 1300) return "from-indigo-500 to-cyan-500";
  return "from-amber-500 to-indigo-500";
}

function HistoryPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">Performance History</h1>
        <p className="mt-1 text-muted-foreground">Every completed exam, with section breakdowns.</p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PAST_SCORES.map((s) => (
          <div
            key={s.id}
            className="flex flex-col rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-sm transition-all hover:shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold leading-tight">{s.name}</h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> {s.date}
                </p>
              </div>
              <span
                className={`rounded-xl bg-gradient-to-br ${scoreColor(
                  s.total,
                )} px-3 py-1.5 text-lg font-extrabold text-white shadow-[var(--shadow-soft)]`}
              >
                {s.total}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-accent/60 p-3">
                <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5" /> R&amp;W
                </p>
                <p className="mt-0.5 text-lg font-bold">{s.rw}</p>
              </div>
              <div className="rounded-xl bg-accent/60 p-3">
                <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  <Calculator className="h-3.5 w-3.5" /> Math
                </p>
                <p className="mt-0.5 text-lg font-bold">{s.math}</p>
              </div>
            </div>

            <Link
              to="/review/$scoreId"
              params={{ scoreId: s.id }}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <Search className="h-4 w-4" /> Review Mistakes
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
