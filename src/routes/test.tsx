import { createFileRoute } from "@tanstack/react-router";
import { TestPlayer } from "@/components/test/TestPlayer";

export const Route = createFileRoute("/test")({
  head: () => ({
    meta: [
      { title: "Test Simulation — NaluPrep" },
      { name: "description", content: "Full-length adaptive SAT test simulation." },
    ],
  }),
  component: TestPlayer,
});
