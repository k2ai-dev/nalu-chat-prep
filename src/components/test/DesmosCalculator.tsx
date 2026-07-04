import { useEffect, useRef, useState } from "react";
import { X, Calculator } from "lucide-react";

declare global {
  interface Window {
    Desmos?: {
      GraphingCalculator: (el: HTMLElement, opts?: Record<string, unknown>) => {
        resize: () => void;
        destroy: () => void;
      };
    };
  }
}

// TODO: swap for our own key from desmos.com/api before scaling — this is Desmos's shared public demo key
const DESMOS_SRC =
  "https://www.desmos.com/api/v1.10/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6";

export function DesmosCalculator({ onClose }: { onClose: () => void }) {
  const graphRef = useRef<HTMLDivElement>(null);
  const calcRef = useRef<{ resize: () => void; destroy: () => void } | null>(null);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [retry, setRetry] = useState(0);

  // Load the official Desmos script and initialise the calculator.
  useEffect(() => {
    let cancelled = false;
    function init() {
      if (cancelled || !graphRef.current || !window.Desmos) return;
      calcRef.current = window.Desmos.GraphingCalculator(graphRef.current, {
        expressions: true,
        settingsMenu: false,
      });
      setReady(true);
      requestAnimationFrame(() => calcRef.current?.resize());
    }
    if (window.Desmos) {
      init();
    } else {
      let script = document.querySelector<HTMLScriptElement>(`script[data-desmos]`);
      if (!script) {
        script = document.createElement("script");
        script.src = DESMOS_SRC;
        script.async = true;
        script.dataset.desmos = "true";
        script.onerror = () => setLoadError(true);
        document.body.appendChild(script);
      }
      script.addEventListener("load", init);
    }
    // Fail if the calculator hasn't become ready within 8 seconds.
    const timeout = window.setTimeout(() => {
      if (!cancelled && !calcRef.current) setLoadError(true);
    }, 8000);
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      calcRef.current?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retry]);

  return (
    <div className="relative w-[520px] overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-float)]">
      <div className="flex items-center justify-between border-b border-border bg-primary px-3 py-2 text-primary-foreground">
        <span className="flex items-center gap-2 text-sm font-bold">
          <Calculator className="h-4 w-4" /> Desmos Graphing Calculator
        </span>
        <div className="flex items-center gap-1">
          <button onClick={onClose} className="rounded p-1 hover:bg-white/20">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div ref={graphRef} className="h-[520px] w-full bg-white" />
      {!ready && !loadError && (
        <div className="absolute inset-x-0 bottom-3 text-center text-xs text-muted-foreground">
          Loading calculator…
        </div>
      )}
      {loadError && (
        <div className="absolute inset-x-0 bottom-3 flex flex-col items-center gap-2 px-4 text-center text-xs text-destructive">
          <span>Calculator failed to load — check your connection or ad-blocker</span>
          <button
            onClick={() => {
              setLoadError(false);
              setReady(false);
              setRetry((v) => v + 1);
            }}
            className="rounded-lg bg-primary px-3 py-1 text-xs font-bold text-primary-foreground hover:opacity-90"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
