import { X } from "lucide-react";

export function ReferenceSheet({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-float)]">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="font-bold">Reference Sheet</h2>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-accent">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-6">
          <svg viewBox="0 0 700 320" className="w-full text-foreground">
            <g fill="none" stroke="currentColor" strokeWidth="2">
              {/* Circle */}
              <circle cx="80" cy="70" r="45" />
              <line x1="80" y1="70" x2="125" y2="70" />
              <text x="95" y="62" fontSize="14" fill="currentColor" stroke="none">r</text>
              <text x="45" y="145" fontSize="13" fill="currentColor" stroke="none">A = πr²</text>
              <text x="42" y="162" fontSize="13" fill="currentColor" stroke="none">C = 2πr</text>

              {/* Rectangle */}
              <rect x="200" y="35" width="110" height="70" />
              <text x="205" y="145" fontSize="13" fill="currentColor" stroke="none">A = ℓw</text>

              {/* Triangle */}
              <polygon points="400,105 470,105 435,35" />
              <text x="392" y="145" fontSize="13" fill="currentColor" stroke="none">A = ½bh</text>

              {/* Right triangle - Pythagorean */}
              <polygon points="560,105 660,105 560,45" />
              <text x="600" y="145" fontSize="13" fill="currentColor" stroke="none">a² + b² = c²</text>

              {/* Cylinder */}
              <ellipse cx="90" cy="205" rx="45" ry="14" />
              <path d="M45 205 V285 A45 14 0 0 0 135 285 V205" />
              <text x="45" y="315" fontSize="13" fill="currentColor" stroke="none">V = πr²h</text>

              {/* Cone */}
              <ellipse cx="280" cy="290" rx="45" ry="14" />
              <path d="M235 290 L280 200 L325 290" />
              <text x="235" y="315" fontSize="13" fill="currentColor" stroke="none">V = ⅓πr²h</text>

              {/* Sphere */}
              <circle cx="470" cy="245" r="45" />
              <ellipse cx="470" cy="245" rx="45" ry="14" />
              <text x="430" y="315" fontSize="13" fill="currentColor" stroke="none">V = 4⁄3 πr³</text>

              {/* Rectangular prism */}
              <path d="M580 220 h80 v55 h-80 z M580 220 l25 -20 h80 l-25 20 M660 220 l25 -20 v55 l-25 20" />
              <text x="580" y="315" fontSize="13" fill="currentColor" stroke="none">V = ℓwh</text>
            </g>
          </svg>
          <div className="mt-4 grid gap-2 rounded-xl bg-accent/50 p-4 text-sm text-foreground/80">
            <p>The number of degrees of arc in a circle is 360.</p>
            <p>The number of radians of arc in a circle is 2π.</p>
            <p>The sum of the measures in degrees of the angles of a triangle is 180.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
