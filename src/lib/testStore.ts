import type { Exam } from "@/data/mock";

export type TestConfig = {
  exam: Exam | null;
  pauseEnabled: boolean;
  timeMode: "regular" | "custom";
  customMinutes: number;
  practiceMode: boolean;
  reviewMode: boolean;
};

let pending: TestConfig = {
  exam: null,
  pauseEnabled: false,
  timeMode: "regular",
  customMinutes: 32,
  practiceMode: false,
  reviewMode: false,
};

export function setPendingTest(config: TestConfig) {
  pending = config;
}

export function getPendingTest(): TestConfig {
  return pending;
}
