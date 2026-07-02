import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, Lightbulb, CheckCircle2, Filter } from "lucide-react";
import { ALL_QUESTIONS, type Question } from "@/data/mock";

export const Route = createFileRoute("/_dash/question-bank")({
  head: () => ({
    meta: [
      { title: "Question Bank — NaluPrep" },
      { name: "description", content: "Practice SAT questions filtered by subject, topic, and difficulty with strategic explanations." },
    ],
  }),
  component: QuestionBank,
});

const SUBJECTS = ["All", "Reading & Writing", "Math"] as const;
const TOPICS = ["All", "Algebra", "Advanced Math", "Craft and Structure", "Expression of Ideas"];
const DIFFS = ["All", "Easy", "Medium", "Hard"] as const;

function QuestionBank() {
  const [subject, setSubject] = useState<(typeof SUBJECTS)[number]>("All");
  const [topic, setTopic] = useState("All");
  const [diff, setDiff] = useState<(typeof DIFFS)[number]>("All");

  const filtered = useMemo(() => {
    return ALL_QUESTIONS.filter((q) => {
      if (subject !== "All" && q.subject !== subject) return false;
      if (topic !== "All" && !q.topic.includes(topic)) return false;
      if (diff !== "All" && q.difficulty !== diff) return false;
      return true;
    }).slice(0, 24);
  }, [subject, topic, diff]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">Question Bank</h1>
        <p className="mt-1 text-muted-foreground">
          Targeted practice with instant, strategic explanations.
        </p>
      </header>

      <div className="space-y-4 rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Filter className="h-4 w-4" /> Filters
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase text-muted-foreground">Subject</p>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((s) => (
                <Chip key={s} active={subject === s} onClick={() => setSubject(s)}>
                  {s}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase text-muted-foreground">Difficulty</p>
            <div className="flex flex-wrap gap-2">
              {DIFFS.map((d) => (
                <Chip key={d} active={diff === d} onClick={() => setDiff(d)}>
                  {d}
                </Chip>
              ))}
            </div>
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase text-muted-foreground">Topic</p>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((t) => (
              <Chip key={t} active={topic === t} onClick={() => setTopic(t)}>
                {t}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} questions</p>

      <div className="space-y-4">
        {filtered.map((q, i) => (
          <PracticeCard key={q.id} q={q} index={i + 1} />
        ))}
        {filtered.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
            No questions match these filters.
          </p>
        )}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-muted-foreground hover:border-primary/40"
      }`}
    >
      {children}
    </button>
  );
}

function PracticeCard({ q, index }: { q: Question; index: number }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showExpl, setShowExpl] = useState(false);

  return (
    <div className="rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-xs font-semibold">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
          {index}
        </span>
        <span className="rounded-full bg-accent px-2 py-0.5 text-accent-foreground">{q.topic}</span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground">{q.difficulty}</span>
      </div>

      {q.passage && (
        <p className="mt-3 border-l-2 border-primary/30 pl-3 font-serif text-[15px] leading-relaxed text-foreground/90">
          {q.passage}
        </p>
      )}
      <p className="mt-3 font-semibold">{q.prompt}</p>

      <div className="mt-3 space-y-2">
        {q.choices.map((c) => {
          const isSel = selected === c.label;
          const isCorrect = showExpl && c.label === q.correct;
          return (
            <button
              key={c.label}
              onClick={() => setSelected(c.label)}
              className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                isCorrect
                  ? "border-success bg-success/10"
                  : isSel
                    ? "border-primary bg-accent"
                    : "border-border hover:border-primary/40"
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                  isCorrect
                    ? "border-success bg-success text-success-foreground"
                    : isSel
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border"
                }`}
              >
                {c.label}
              </span>
              <span>{c.text}</span>
              {isCorrect && <CheckCircle2 className="ml-auto h-4 w-4 text-success" />}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => setShowExpl((v) => !v)}
        className="mt-4 flex w-full items-center justify-between rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground"
      >
        <span className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4" /> Explanation
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${showExpl ? "rotate-180" : ""}`} />
      </button>
      {showExpl && (
        <div className="mt-2 rounded-xl border border-success/30 bg-success/5 p-4 text-sm">
          <p className="font-bold text-success">Correct answer: {q.correct}</p>
          <p className="mt-1.5 text-foreground/80">{q.explanation}</p>
        </div>
      )}
    </div>
  );
}
