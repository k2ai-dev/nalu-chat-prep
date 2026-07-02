import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronUp,
  Flag,
  Highlighter as HighlighterIcon,
  StickyNote,
  MoreHorizontal,
  Pause,
  Play,
  Clock,
  Timer,
  EyeOff,
  Eye,
  Lightbulb,
  Calculator,
  BookMarked,
  Maximize,
  Moon,
  Sun,
  LogOut,
  Bug,
  Strikethrough,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { MODULES, QUESTIONS_BY_MODULE, STUDENT_NAME, type Choice } from "@/data/mock";
import { getPendingTest } from "@/lib/testStore";
import { PassageHighlighter } from "@/components/highlight/PassageHighlighter";
import { DesmosCalculator } from "@/components/test/DesmosCalculator";
import { ReferenceSheet } from "@/components/test/ReferenceSheet";
import { BugReportModal } from "@/components/test/BugReportModal";
import { ScoreResults, type ScoreData } from "@/components/test/ScoreResults";

type Label = Choice["label"];

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function TestPlayer() {
  const navigate = useNavigate();
  const config = getPendingTest();

  const [moduleIdx, setModuleIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [phase, setPhase] = useState<"question" | "review" | "break">("question");
  const [answers, setAnswers] = useState<Record<string, Label>>({});
  const [marked, setMarked] = useState<Record<string, boolean>>({});
  const [eliminated, setEliminated] = useState<Record<string, Label[]>>({});
  const [eliminateMode, setEliminateMode] = useState(false);
  const [results, setResults] = useState<ScoreData | null>(null);

  const mod = MODULES[moduleIdx];
  const questions = QUESTIONS_BY_MODULE[moduleIdx];
  const q = questions[qIdx];
  const moduleMinutes =
    config.timeMode === "custom" && mod.subject === "Reading & Writing"
      ? config.customMinutes
      : mod.minutes;

  const [secondsLeft, setSecondsLeft] = useState(moduleMinutes * 60);
  const [paused, setPaused] = useState(false);
  const [hideTime, setHideTime] = useState(false);
  const [breakLeft, setBreakLeft] = useState(600);

  // UI toggles
  const [directionsOpen, setDirectionsOpen] = useState(false);
  const [highlightTool, setHighlightTool] = useState(true);
  const [notesOpen, setNotesOpen] = useState(false);
  const [globalNote, setGlobalNote] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);
  const [gridOpen, setGridOpen] = useState(false);
  const [showExpl, setShowExpl] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [refOpen, setRefOpen] = useState(false);
  const [bugOpen, setBugOpen] = useState(false);
  const [dark, setDark] = useState(false);


  // Reset timer + local UI on module change
  useEffect(() => {
    setSecondsLeft(moduleMinutes * 60);
    setShowExpl(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleIdx]);

  // Countdown
  useEffect(() => {
    if (phase !== "question" || paused) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          setPhase("review");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase, paused]);

  // Break countdown
  useEffect(() => {
    if (phase !== "break") return;
    const t = setInterval(() => setBreakLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    return () => document.documentElement.classList.remove("dark");
  }, [dark]);

  function select(label: Label) {
    if (eliminateMode) {
      setEliminated((prev) => {
        const cur = new Set(prev[q.id] ?? []);
        cur.has(label) ? cur.delete(label) : cur.add(label);
        return { ...prev, [q.id]: [...cur] };
      });
      setAnswers((prev) => {
        if (prev[q.id] === label) {
          const n = { ...prev };
          delete n[q.id];
          return n;
        }
        return prev;
      });
      return;
    }
    setAnswers((prev) => ({ ...prev, [q.id]: label }));
  }

  function next() {
    setShowExpl(false);
    if (qIdx < questions.length - 1) setQIdx(qIdx + 1);
    else setPhase("review");
  }
  function back() {
    setShowExpl(false);
    if (qIdx > 0) setQIdx(qIdx - 1);
  }

  function computeScore(): ScoreData {
    let rwCorrect = 0;
    let mathCorrect = 0;
    let rwTotal = 0;
    let mathTotal = 0;
    for (const m of MODULES) {
      for (const question of QUESTIONS_BY_MODULE[m.index]) {
        const correct = answers[question.id] === question.correct;
        if (m.subject === "Math") {
          mathTotal++;
          if (correct) mathCorrect++;
        } else {
          rwTotal++;
          if (correct) rwCorrect++;
        }
      }
    }
    // Give a realistic floor so the demo always looks plausible.
    const scale = (c: number, t: number) => 200 + Math.round((0.35 + (c / t) * 0.65) * 600);
    const rw = Math.min(800, scale(rwCorrect, rwTotal));
    const math = Math.min(800, scale(mathCorrect, mathTotal));
    return {
      total: rw + math,
      rw,
      math,
      skills: [
        { label: "Algebra", pct: 78 },
        { label: "Geometry", pct: 64 },
        { label: "Advanced Math", pct: 71 },
        { label: "Craft and Structure", pct: 83 },
        { label: "Expression of Ideas", pct: 69 },
      ],
    };
  }

  function continueFromReview() {
    if (moduleIdx === 3) {
      setResults(computeScore());
    } else if (moduleIdx === 1) {
      setBreakLeft(600);
      setPhase("break");
    } else {
      setModuleIdx(moduleIdx + 1);
      setQIdx(0);
      setPhase("question");
    }
  }

  function resumeFromBreak() {
    setModuleIdx(2);
    setQIdx(0);
    setPhase("question");
  }

  if (results) return <ScoreResults score={results} />;

  const answeredCount = questions.filter((qq) => answers[qq.id]).length;

  // ---------- BREAK SCREEN ----------
  if (phase === "break") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Section Break</p>
        <h1 className="mt-2 text-3xl font-extrabold">Take a 10-minute break</h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          You've finished the Reading and Writing section. Stretch, hydrate, and get ready for Math.
        </p>
        <div className="my-8 text-6xl font-extrabold tabular-nums text-primary">{fmt(breakLeft)}</div>
        <button
          onClick={resumeFromBreak}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90"
        >
          Resume Testing <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // ---------- REVIEW (Check Your Work) ----------
  if (phase === "review") {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <div className="border-b border-border px-6 py-4">
          <h1 className="text-lg font-bold">Check Your Work</h1>
          <p className="text-sm text-muted-foreground">{mod.title}</p>
        </div>
        <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-8">
          <p className="mb-4 text-sm text-muted-foreground">
            {answeredCount} of {questions.length} answered ·{" "}
            {Object.keys(marked).filter((k) => marked[k] && k.startsWith(`m${moduleIdx}`)).length}{" "}
            marked for review
          </p>
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-9">
            {questions.map((qq, i) => {
              const isAnswered = !!answers[qq.id];
              const isMarked = marked[qq.id];
              return (
                <button
                  key={qq.id}
                  onClick={() => {
                    setQIdx(i);
                    setPhase("question");
                  }}
                  className={`relative flex h-10 items-center justify-center rounded-lg border text-sm font-semibold ${
                    isAnswered
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-dashed border-border bg-background text-muted-foreground"
                  }`}
                >
                  {i + 1}
                  {isMarked && (
                    <Flag className="absolute -right-1 -top-1 h-3 w-3 fill-amber-400 text-amber-500" />
                  )}
                </button>
              );
            })}
          </div>
          <button
            onClick={continueFromReview}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90"
          >
            {moduleIdx === 3 ? "Finish & See Score" : `Continue to ${MODULES[moduleIdx + 1].subject === "Math" && moduleIdx === 1 ? "Break" : "Module " + (moduleIdx + 2)}`}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // ---------- QUESTION PLAYER ----------
  const isMath = mod.subject === "Math";
  const elimSet = new Set(eliminated[q.id] ?? []);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* HEADER */}
      <header className="flex items-center gap-3 border-b border-border px-4 py-2.5">
        {/* Left: title + directions */}
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{mod.title}</p>
          <button
            onClick={() => setDirectionsOpen((v) => !v)}
            className="flex items-center gap-1 text-xs font-semibold text-primary"
          >
            Directions {directionsOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>

        {/* Center utilities */}
        <div className="mx-auto flex items-center gap-2">
          {config.pauseEnabled && (
            <HdrBtn onClick={() => setPaused((v) => !v)}>
              {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              {paused ? "Resume" : "Pause"}
            </HdrBtn>
          )}
          <div className="flex h-9 min-w-[112px] items-center justify-center gap-2 rounded-lg border border-border px-3 text-sm font-bold tabular-nums">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {hideTime ? "•••" : fmt(secondsLeft)}
          </div>
          <HdrBtn onClick={() => setHideTime((v) => !v)}>
            {hideTime ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {hideTime ? "Show" : "Hide"}
          </HdrBtn>
          <HdrBtn onClick={() => setSecondsLeft(moduleMinutes * 60)}>
            <Timer className="h-4 w-4" /> Set Limit
          </HdrBtn>
        </div>

        {/* Right utilities */}
        <div className="flex items-center gap-2">
          {config.practiceMode && (
            <HdrBtn onClick={() => setShowExpl(true)}>
              <Lightbulb className="h-4 w-4" /> Hint
            </HdrBtn>
          )}
          {isMath && mod.calculator && (
            <HdrBtn onClick={() => setCalcOpen((v) => !v)} active={calcOpen}>
              <Calculator className="h-4 w-4" /> Calc
            </HdrBtn>
          )}
          {isMath && (
            <HdrBtn onClick={() => setRefOpen(true)}>
              <BookMarked className="h-4 w-4" /> Reference
            </HdrBtn>
          )}
          <HdrBtn onClick={() => setHighlightTool((v) => !v)} active={highlightTool}>
            <HighlighterIcon className="h-4 w-4" /> Highlights
          </HdrBtn>
          <HdrBtn onClick={() => setNotesOpen((v) => !v)} active={notesOpen}>
            <StickyNote className="h-4 w-4" /> Notes
          </HdrBtn>
          <div className="relative">
            <HdrBtn onClick={() => setMoreOpen((v) => !v)}>
              <MoreHorizontal className="h-4 w-4" /> More
            </HdrBtn>
            {moreOpen && (
              <div
                className="absolute right-0 top-11 z-40 w-52 overflow-hidden rounded-xl border border-border bg-popover shadow-[var(--shadow-float)]"
                onMouseLeave={() => setMoreOpen(false)}
              >
                <MenuItem icon={Maximize} onClick={() => document.documentElement.requestFullscreen?.()}>
                  Fullscreen
                </MenuItem>
                <MenuItem icon={dark ? Sun : Moon} onClick={() => setDark((v) => !v)}>
                  {dark ? "Light theme" : "Dark theme"}
                </MenuItem>
                <MenuItem icon={LogOut} onClick={() => navigate({ to: "/" })}>
                  Save and Exit
                </MenuItem>
                <MenuItem icon={Bug} onClick={() => { setBugOpen(true); setMoreOpen(false); }}>
                  Report a Bug
                </MenuItem>
              </div>
            )}
          </div>
        </div>
      </header>

      {directionsOpen && (
        <div className="border-b border-border bg-accent/40 px-6 py-3 text-sm text-foreground/80">
          The questions in this section address a number of important skills. Read each passage or
          prompt carefully and choose the best answer. You may highlight text, mark questions for
          review, and navigate freely within the module.
        </div>
      )}

      {/* BODY */}
      <div className={`flex flex-1 ${isMath ? "" : "divide-x divide-border"}`}>
        {/* Left pane (passage) */}
        {!isMath && (
          <section className="w-1/2 overflow-y-auto px-8 py-6 no-scrollbar" style={{ maxHeight: "calc(100vh - 130px)" }}>
            <PassageHighlighter
              key={q.id}
              enabled={highlightTool}
              html={q.passage ?? ""}
            />
            {notesOpen && (
              <textarea
                value={globalNote}
                onChange={(e) => setGlobalNote(e.target.value)}
                placeholder="Scratch notes for this passage…"
                className="mt-4 h-24 w-full resize-none rounded-xl border border-input bg-background p-3 text-sm outline-none focus:border-primary"
              />
            )}
          </section>
        )}

        {/* Right pane (question + answers) */}
        <section
          className={`${isMath ? "mx-auto max-w-2xl w-full" : "w-1/2"} overflow-y-auto px-8 py-6 no-scrollbar`}
          style={{ maxHeight: "calc(100vh - 130px)" }}
        >
          {/* Sub-header: index + mark for review (adjacent) ...... ABC elimination */}
          <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-1.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-sm font-bold text-background">
                {qIdx + 1}
              </span>
              <button
                onClick={() => setMarked((prev) => ({ ...prev, [q.id]: !prev[q.id] }))}
                className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold transition-colors ${
                  marked[q.id] ? "text-amber-600" : "text-muted-foreground hover:bg-accent"
                }`}
              >
                <Flag className={`h-4 w-4 ${marked[q.id] ? "fill-amber-400 text-amber-500" : ""}`} />
                Mark for Review
              </button>
            </div>
            <button
              onClick={() => setEliminateMode((v) => !v)}
              className={`flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-bold transition-colors ${
                eliminateMode ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"
              }`}
              title="Answer elimination"
            >
              <Strikethrough className="h-4 w-4" /> ABC
            </button>
          </div>

          {isMath && (
            <div className="mb-3 flex gap-2">
              <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                {q.topic}
              </span>
            </div>
          )}

          <p className="font-serif text-[17px] font-semibold leading-relaxed">{q.prompt}</p>

          <div className="mt-5 space-y-2.5">
            {q.choices.map((c) => {
              const isSel = answers[q.id] === c.label;
              const isElim = elimSet.has(c.label);
              return (
                <button
                  key={c.label}
                  onClick={() => select(c.label)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                    isSel
                      ? "border-primary bg-accent"
                      : "border-border hover:border-primary/40"
                  } ${isElim ? "strike-off" : ""}`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                      isSel ? "border-primary bg-primary text-primary-foreground" : "border-border"
                    }`}
                  >
                    {c.label}
                  </span>
                  <span>{c.text}</span>
                </button>
              );
            })}
          </div>

          {config.practiceMode && (
            <div className="mt-5">
              <button
                onClick={() => setShowExpl((v) => !v)}
                className="flex w-full items-center justify-between rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground"
              >
                <span className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" /> Explanation
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showExpl ? "rotate-180" : ""}`} />
              </button>
              {showExpl && (
                <div className="mt-2 rounded-xl border border-success/30 bg-success/5 p-4 text-sm">
                  <p className="flex items-center gap-1.5 font-bold text-success">
                    <CheckCircle2 className="h-4 w-4" /> Correct answer: {q.correct}
                  </p>
                  <p className="mt-1.5 text-foreground/80">{q.explanation}</p>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* FOOTER */}
      <footer className="relative flex items-center justify-between border-t border-border bg-white px-5 py-3">
        <p className="hidden text-sm font-bold sm:block">{STUDENT_NAME}</p>

        <div className="relative">
          <button
            onClick={() => setGridOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-bold text-background"
          >
            Question {qIdx + 1} of {questions.length}
            {gridOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
          {gridOpen && (
            <div className="absolute bottom-12 left-1/2 z-40 w-[320px] -translate-x-1/2 rounded-2xl border border-border bg-popover p-4 shadow-[var(--shadow-float)]">
              <p className="mb-3 text-sm font-bold">{mod.title.split(":")[0]}</p>
              <div className="grid grid-cols-7 gap-1.5">
                {questions.map((qq, i) => {
                  const isAnswered = !!answers[qq.id];
                  const isMarked = marked[qq.id];
                  const isCurrent = i === qIdx;
                  return (
                    <button
                      key={qq.id}
                      onClick={() => {
                        setQIdx(i);
                        setGridOpen(false);
                      }}
                      className={`relative flex h-9 items-center justify-center rounded-md border text-xs font-semibold ${
                        isCurrent
                          ? "border-primary ring-2 ring-primary"
                          : isAnswered
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-dashed border-border text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                      {isMarked && (
                        <Flag className="absolute -right-1 -top-1 h-2.5 w-2.5 fill-amber-400 text-amber-500" />
                      )}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => {
                  setGridOpen(false);
                  setPhase("review");
                }}
                className="mt-4 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90"
              >
                Go to Review Page
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={back}
            disabled={qIdx === 0}
            className="inline-flex items-center gap-1 rounded-lg border border-border px-4 py-2 text-sm font-bold disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <button
            onClick={next}
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-5 py-2 text-sm font-bold text-primary-foreground hover:opacity-90"
          >
            Next <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </footer>

      {calcOpen && <DesmosCalculator onClose={() => setCalcOpen(false)} />}
      {refOpen && <ReferenceSheet onClose={() => setRefOpen(false)} />}
      {bugOpen && <BugReportModal onClose={() => setBugOpen(false)} questionIndex={qIdx + 1} />}

      {paused && config.pauseEnabled && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 text-center backdrop-blur">
          <Pause className="h-10 w-10 text-primary" />
          <h2 className="mt-4 text-2xl font-extrabold">Test Paused</h2>
          <p className="mt-1 text-muted-foreground">Your timer is stopped.</p>
          <button
            onClick={() => setPaused(false)}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
          >
            <Play className="h-4 w-4" /> Resume Test
          </button>
        </div>
      )}
    </div>
  );
}

function HdrBtn({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-bold transition-colors ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border hover:bg-accent"
      }`}
    >
      {children}
    </button>
  );
}

function MenuItem({
  icon: Icon,
  children,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium hover:bg-accent"
    >
      <Icon className="h-4 w-4 text-muted-foreground" /> {children}
    </button>
  );
}
