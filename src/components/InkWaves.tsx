/**
 * Three flowing water-ink SVG waves rendered behind all content.
 * Pure white base, deep-indigo -> vibrant-cyan gradient strokes,
 * heavy blur + very low opacity for a soft dissolving-ink look.
 */
export function InkWaves() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white"
    >
      <svg className="absolute h-0 w-0">
        <defs>
          <linearGradient id="ink-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
      </svg>

      <svg
        className="ink-wave-1 absolute -left-[10%] top-[8%] h-[60vh] w-[130%] blur-3xl"
        style={{ opacity: 0.06 }}
        viewBox="0 0 1200 300"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 150 C 200 40, 400 260, 600 150 S 1000 40, 1200 150"
          stroke="url(#ink-grad)"
          strokeWidth="90"
          strokeLinecap="round"
        />
      </svg>

      <svg
        className="ink-wave-2 absolute -left-[15%] top-[42%] h-[55vh] w-[135%] blur-3xl"
        style={{ opacity: 0.05 }}
        viewBox="0 0 1200 300"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 180 C 250 300, 450 60, 700 180 S 1050 300, 1200 160"
          stroke="url(#ink-grad)"
          strokeWidth="80"
          strokeLinecap="round"
        />
      </svg>

      <svg
        className="ink-wave-3 absolute -left-[8%] top-[70%] h-[55vh] w-[128%] blur-3xl"
        style={{ opacity: 0.07 }}
        viewBox="0 0 1200 300"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 120 C 300 220, 500 20, 750 140 S 1000 260, 1200 120"
          stroke="url(#ink-grad)"
          strokeWidth="100"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
