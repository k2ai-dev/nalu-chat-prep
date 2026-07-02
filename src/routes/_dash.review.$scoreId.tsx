import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, XCircle, CheckCircle2, Lightbulb } from "lucide-react";
import { PAST_SCORES, ALL_QUESTIONS } from "@/data/mock";

export const Route = createFileRoute("/_dash/review/$scoreId")({
  head: () => ({
    meta: [
      { title: "Review Mistakes — NaluPrep" },
      { name: "description", content: "Inspect incorrect responses with detailed explanation panels." },
    ],
  }),
  loader: ({ params }) => {
    const score = PAST_SCORES.find((s) => s.id === params.scoreId);
    if (!score) throw notFound();
    return { score };
  },
  component: ReviewMistakes,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl p-8 text-center">
      <p className="text-lg font-bold">Exam not found</p>
      <Link to="/history" className="mt-3 inline-block text-primary hover:underline">
        Back to history
      </Link>
    </div>
  ),
});

// Deterministic set of "missed" questions for review.
const MISSED = ALL_QUESTIONS.filter((_, i) => i % 9 === 0).slice(0, 8);
const WRONG_PICK = ["B", "A", "D", "C"] as const;

function ReviewMistakes() {
  const { score } = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        to="/history"
        className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Performance History
      </Link>

      <header className="rounded-2xl border border-border bg-card/80 p-6 backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Mistake Review</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight">{score.name}</h1>
        <p className="mt-1 text-muted-foreground">
          {score.date} · Score {score.total} · {MISSED.length} incorrect responses to review
        </p>
      </header>

      <div className="space-y-4">
        {MISSED.map((q, i) => {
          const wrong = WRONG_PICK[i % WRONG_PICK.length];
          return (
            <div key={q.id} className="rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
                  {i + 1}
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
                  const isCorrect = c.label === q.correct;
                  const isWrong = c.label === wrong && wrong !== q.correct;
                  return (
                    <div
                      key={c.label}
                      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm ${
                        isCorrect
                          ? "border-success bg-success/10"
                          : isWrong
                            ? "border-destructive bg-destructive/10"
                            : "border-border"
                      }`}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-xs font-bold">
                        {c.label}
                      </span>
                      <span>{c.text}</span>
                      {isCorrect && <CheckCircle2 className="ml-auto h-4 w-4 text-success" />}
                      {isWrong && <XCircle className="ml-auto h-4 w-4 text-destructive" />}
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 rounded-xl border border-primary/20 bg-accent/50 p-4 text-sm">
                <p className="flex items-center gap-2 font-bold text-primary">
                  <Lightbulb className="h-4 w-4" /> Why {q.correct} is correct
                </p>
                <p className="mt-1.5 text-foreground/80">{q.explanation}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
