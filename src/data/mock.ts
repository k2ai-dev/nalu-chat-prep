export type Choice = { label: "A" | "B" | "C" | "D"; text: string };

export type Question = {
  id: string;
  module: number;
  subject: "Reading & Writing" | "Math";
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  passage?: string;
  prompt: string;
  choices: Choice[];
  correct: "A" | "B" | "C" | "D";
  explanation: string;
};

export type ModuleConfig = {
  index: number;
  title: string;
  subject: "Reading & Writing" | "Math";
  count: number;
  minutes: number;
  calculator: boolean;
};

export const MODULES: ModuleConfig[] = [
  { index: 0, title: "Section 1, Module 1: Reading and Writing", subject: "Reading & Writing", count: 27, minutes: 32, calculator: false },
  { index: 1, title: "Section 1, Module 2: Reading and Writing", subject: "Reading & Writing", count: 27, minutes: 32, calculator: false },
  { index: 2, title: "Section 2, Module 1: Math (No Calculator)", subject: "Math", count: 22, minutes: 35, calculator: false },
  { index: 3, title: "Section 2, Module 2: Math (Calculator)", subject: "Math", count: 22, minutes: 35, calculator: true },
];

const RW_TOPICS = ["Craft and Structure", "Information and Ideas", "Expression of Ideas", "Standard English Conventions"];
const MATH_TOPICS = ["Algebra", "Advanced Math", "Problem-Solving and Data Analysis", "Geometry and Trigonometry"];
const DIFFS: Question["difficulty"][] = ["Easy", "Medium", "Hard"];

const PASSAGES = [
  `The naturalist Maria Sibylla Merian, working in the late seventeenth century, transformed the study of insects. Rather than depicting specimens in isolation, she painted them within the ecosystems they inhabited—caterpillars beside the leaves they consumed, moths hovering near the flowers that sustained them. Her insistence on observing living organisms, rather than preserved husks, allowed her to document metamorphosis with a precision that eluded many of her contemporaries.`,
  `Recent excavations at the site have complicated earlier assumptions about the settlement's decline. Archaeologists once attributed its abandonment to a single catastrophic drought. However, layered sediment analysis suggests a more gradual process: the community adapted repeatedly to shifting rainfall before finally dispersing. This revised timeline invites scholars to reconsider the resilience of ancient agricultural societies.`,
  `In her essay, the critic argues that the novel's fragmented structure is not a flaw but its central achievement. By refusing a linear chronology, the author compels readers to assemble meaning actively, mirroring the protagonist's own struggle to reconcile memory with the present. The disorientation the reader feels, then, is inseparable from the book's emotional logic.`,
  `Marine biologists studying bioluminescence have discovered that certain deep-sea organisms produce light not merely for camouflage but for communication. Pulses of blue-green light, varying in rhythm and intensity, appear to coordinate the movements of schooling fish in total darkness. These findings suggest that light functions as a language in environments where sound and sight would otherwise fail.`,
];

function passageFor(i: number) {
  return PASSAGES[i % PASSAGES.length];
}

function makeChoices(seed: number): Choice[] {
  const banks = [
    ["reinforces the claim made earlier", "contradicts the preceding evidence", "introduces an unrelated anecdote", "restates the counterargument"],
    ["Therefore", "Nevertheless", "For example", "In contrast"],
    ["its", "it's", "their", "there"],
    ["a gradual, adaptive process", "a single sudden event", "an unexplained mystery", "a deliberate migration"],
  ];
  const bank = banks[seed % banks.length];
  return bank.map((t, idx) => ({ label: ["A", "B", "C", "D"][idx] as Choice["label"], text: t }));
}

function makeMathChoices(seed: number): Choice[] {
  const base = (seed % 7) + 2;
  const vals = [base * 2, base * 2 + 3, base * 2 - 1, base * 2 + 7];
  return vals.map((v, idx) => ({ label: ["A", "B", "C", "D"][idx] as Choice["label"], text: String(v) }));
}

function buildModule(m: ModuleConfig): Question[] {
  const questions: Question[] = [];
  for (let n = 0; n < m.count; n++) {
    const isMath = m.subject === "Math";
    const topic = isMath ? MATH_TOPICS[n % MATH_TOPICS.length] : RW_TOPICS[n % RW_TOPICS.length];
    const difficulty = DIFFS[n % DIFFS.length];
    const correct = (["A", "B", "C", "D"] as const)[n % 4];
    questions.push({
      id: `m${m.index}-q${n}`,
      module: m.index,
      subject: m.subject,
      topic,
      difficulty,
      passage: isMath ? undefined : passageFor(n),
      prompt: isMath
        ? `If ${(n % 5) + 2}x + ${(n % 3) + 1} = ${((n % 5) + 2) * ((n % 7) + 2) + ((n % 3) + 1)}, what is the value of the expression 2x + ${(n % 4) + 1}?`
        : "Which choice completes the text with the most logical and precise word or phrase?",
      choices: isMath ? makeMathChoices(n) : makeChoices(n),
      correct,
      explanation: isMath
        ? "Isolate x by subtracting the constant from both sides, then divide by the coefficient. Substitute x back into the target expression to evaluate it directly."
        : "The correct choice maintains the logical relationship established by the passage. Eliminate options that reverse the intended meaning or introduce information not supported by the context.",
    });
  }
  return questions;
}

export const QUESTIONS_BY_MODULE: Record<number, Question[]> = {
  0: buildModule(MODULES[0]),
  1: buildModule(MODULES[1]),
  2: buildModule(MODULES[2]),
  3: buildModule(MODULES[3]),
};

export const ALL_QUESTIONS: Question[] = Object.values(QUESTIONS_BY_MODULE).flat();

// ---- Exams ----
export type ExamProvider = "Official College Board" | "Princeton Review" | "NaluPrep Originals";
export type Exam = {
  id: string;
  name: string;
  provider: ExamProvider;
  questions: number;
  minutes: number;
  color: string;
};

export const EXAMS: Exam[] = [
  { id: "cb-1", name: "SAT Practice Test #1", provider: "Official College Board", questions: 98, minutes: 134, color: "from-indigo-500 to-blue-500" },
  { id: "cb-2", name: "SAT Practice Test #2", provider: "Official College Board", questions: 98, minutes: 134, color: "from-indigo-500 to-cyan-500" },
  { id: "cb-4", name: "SAT Practice Test #4", provider: "Official College Board", questions: 98, minutes: 134, color: "from-blue-600 to-indigo-500" },
  { id: "pr-1", name: "Princeton Diagnostic A", provider: "Princeton Review", questions: 98, minutes: 134, color: "from-sky-500 to-indigo-500" },
  { id: "pr-2", name: "Princeton Challenge B", provider: "Princeton Review", questions: 98, minutes: 134, color: "from-cyan-500 to-indigo-600" },
  { id: "np-1", name: "NaluPrep Adaptive Alpha", provider: "NaluPrep Originals", questions: 98, minutes: 134, color: "from-indigo-600 to-cyan-400" },
  { id: "np-2", name: "NaluPrep Focus Sprint", provider: "NaluPrep Originals", questions: 98, minutes: 134, color: "from-violet-500 to-cyan-500" },
  { id: "np-3", name: "NaluPrep Final Boss", provider: "NaluPrep Originals", questions: 98, minutes: 134, color: "from-indigo-500 to-sky-400" },
];

// ---- Past Scores ----
export type PastScore = {
  id: string;
  name: string;
  date: string;
  total: number;
  rw: number;
  math: number;
};

export const PAST_SCORES: PastScore[] = [
  { id: "s1", name: "SAT Practice Test #1", date: "Jun 24, 2026", total: 1420, rw: 710, math: 710 },
  { id: "s2", name: "NaluPrep Adaptive Alpha", date: "Jun 18, 2026", total: 1350, rw: 680, math: 670 },
  { id: "s3", name: "Princeton Diagnostic A", date: "Jun 11, 2026", total: 1290, rw: 640, math: 650 },
  { id: "s4", name: "SAT Practice Test #2", date: "Jun 03, 2026", total: 1480, rw: 730, math: 750 },
  { id: "s5", name: "NaluPrep Focus Sprint", date: "May 27, 2026", total: 1230, rw: 610, math: 620 },
  { id: "s6", name: "Princeton Challenge B", date: "May 19, 2026", total: 1180, rw: 600, math: 580 },
];

export const STUDENT_NAME = "Kassym Omerzhan";
