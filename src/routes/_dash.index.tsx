import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Flame,
  Target,
  TrendingUp,
  Clock,
  ArrowRight,
  FileText,
  Library,
  History,
} from "lucide-react";
import { STUDENT_NAME, PAST_SCORES } from "@/data/mock";

export const Route = createFileRoute("/_dash/")({
  head: () => ({
    meta: [
      { title: "Dashboard — NaluPrep" },
      { name: "description", content: "Your SAT prep command center: performance overview, streaks, and quick actions." },
    ],
  }),
  component: Dashboard,
});

const STATS = [
  { label: "Best Score", value: "1480", icon: Target, hint: "+90 this month" },
  { label: "Avg. Score", value: "1325", icon: TrendingUp, hint: "6 tests taken" },
  { label: "Study Streak", value: "12 days", icon: Flame, hint: "Keep it up!" },
  { label: "Hours Studied", value: "47h", icon: Clock, hint: "This month" },
];

const QUICK = [
  { to: "/exams", label: "Start a Full Exam", desc: "98 questions · 4 modules", icon: FileText },
  { to: "/question-bank", label: "Practice Questions", desc: "Filter by topic & difficulty", icon: Library },
  { to: "/history", label: "Review Past Scores", desc: "Analyze your mistakes", icon: History },
] as const;

function Dashboard() {
  const first = STUDENT_NAME.split(" ")[0];
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-indigo-600 to-cyan-500 p-8 text-white shadow-[var(--shadow-float)]">
        <p className="text-sm font-medium text-white/80">Welcome back,</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-4xl">{first} 👋</h1>
        <p className="mt-2 max-w-lg text-white/85">
          You're on a 12-day streak. Ready to push past 1500? Jump into a full-length simulation or
          sharpen a weak topic.
        </p>
        <Link
          to="/exams"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-indigo-700 transition-transform hover:scale-[1.02]"
        >
          Start a Full-Length Exam <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-extrabold tracking-tight">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {QUICK.map((q) => (
          <Link
            key={q.to}
            to={q.to}
            className="group rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-[var(--shadow-soft)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <q.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 flex items-center gap-1 font-bold">
              {q.label}
              <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{q.desc}</p>
          </Link>
        ))}
      </section>

      <section className="rounded-2xl border border-border bg-card/80 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Recent Results</h2>
          <Link to="/history" className="text-sm font-semibold text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-4 divide-y divide-border">
          {PAST_SCORES.slice(0, 4).map((s) => (
            <div key={s.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-semibold">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.date}</p>
              </div>
              <span className="rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 px-3 py-1 text-sm font-bold text-white">
                {s.total}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
