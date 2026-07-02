import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Home, BarChart3, Trophy, X } from "lucide-react";
import { STUDENT_NAME } from "@/data/mock";

export type ScoreData = {
  total: number;
  rw: number;
  math: number;
  skills: { label: string; pct: number }[];
};

export function ScoreResults({ score }: { score: ScoreData }) {
  const navigate = useNavigate();
  const [analyze, setAnalyze] = useState(false);

  return (
    <div className="relative min-h-screen bg-white px-4 py-10">
      <button
        onClick={() => navigate({ to: "/" })}
        className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-bold hover:bg-accent"
      >
        <Home className="h-4 w-4" /> Home
      </button>

      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-[var(--shadow-float)]">
            <Trophy className="h-8 w-8" />
          </div>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Test Complete · {STUDENT_NAME}
          </p>
          <p className="mt-6 text-lg font-semibold text-muted-foreground">Overall Score:</p>
          <p className="text-7xl font-extrabold tracking-tight text-primary">{score.total}</p>
          <p className="text-sm text-muted-foreground">out of 1600</p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-sm font-semibold text-muted-foreground">Reading and Writing:</p>
            <p className="mt-1 text-4xl font-extrabold">{score.rw}</p>
            <p className="text-xs text-muted-foreground">200 – 800</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-sm font-semibold text-muted-foreground">Math:</p>
            <p className="mt-1 text-4xl font-extrabold">{score.math}</p>
            <p className="text-xs text-muted-foreground">200 – 800</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setAnalyze(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90"
          >
            <BarChart3 className="h-4 w-4" /> Analyze Your Score
          </button>
          <button
            onClick={() => navigate({ to: "/" })}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-bold hover:bg-accent"
          >
            <Home className="h-4 w-4" /> Home
          </button>
        </div>
      </div>

      {analyze && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-float)]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Skill Breakdown</h2>
              <button onClick={() => setAnalyze(false)} className="rounded-full p-1.5 hover:bg-accent">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5 space-y-4">
              {score.skills.map((s) => (
                <div key={s.label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-semibold">{s.label}</span>
                    <span className="text-muted-foreground">{s.pct}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
