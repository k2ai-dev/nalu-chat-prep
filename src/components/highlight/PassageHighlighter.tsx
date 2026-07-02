import { useCallback, useEffect, useRef, useState } from "react";
import { Underline, StickyNote, Trash2 } from "lucide-react";

type HColor = "yellow" | "blue" | "pink";
type HDeco = "none" | "solid" | "dashed" | "dotted";
type HMeta = { id: string; color: HColor; deco: HDeco; note: string };

const COLORS: { key: HColor; hex: string }[] = [
  { key: "yellow", hex: "#facc15" },
  { key: "blue", hex: "#38bdf8" },
  { key: "pink", hex: "#f472b6" },
];

/**
 * Contextual highlighter using the browser Selection API.
 * Highlights ONLY the exact selected DOM slice (no global string replacement).
 */
export function PassageHighlighter({
  html,
  enabled,
}: {
  html: string;
  enabled: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [meta, setMeta] = useState<Record<string, HMeta>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [noteOpen, setNoteOpen] = useState(false);

  const applyStyle = useCallback((m: HMeta) => {
    const el = containerRef.current?.querySelector<HTMLElement>(`mark[data-hid="${m.id}"]`);
    if (!el) return;
    el.dataset.color = m.color;
    el.dataset.deco = m.deco;
    el.dataset.note = m.note ? "1" : "0";
    el.title = m.note ? `Note: ${m.note}` : "";
  }, []);

  const openFor = useCallback((id: string, rect: DOMRect) => {
    setActiveId(id);
    setNoteOpen(false);
    setPos({ x: rect.left + rect.width / 2, y: rect.top });
  }, []);

  const onMouseUp = useCallback(() => {
    if (!enabled) return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const container = containerRef.current;
    if (!container || !container.contains(range.commonAncestorContainer)) return;
    if (!range.toString().trim()) return;

    const id = `h_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const mark = document.createElement("mark");
    mark.dataset.hid = id;
    mark.dataset.color = "yellow";
    mark.dataset.deco = "none";
    mark.dataset.note = "0";
    try {
      range.surroundContents(mark);
    } catch {
      mark.appendChild(range.extractContents());
      range.insertNode(mark);
    }
    const rect = mark.getBoundingClientRect();
    setMeta((prev) => ({ ...prev, [id]: { id, color: "yellow", deco: "none", note: "" } }));
    openFor(id, rect);
    sel.removeAllRanges();
  }, [enabled, openFor]);

  // Delegate clicks on existing marks to reopen the tooltip
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest?.("mark[data-hid]") as HTMLElement | null;
      if (target?.dataset.hid) {
        e.stopPropagation();
        openFor(target.dataset.hid, target.getBoundingClientRect());
      }
    };
    container.addEventListener("click", handler);
    return () => container.removeEventListener("click", handler);
  }, [openFor]);

  // Close tooltip on outside click
  useEffect(() => {
    const close = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("[data-hl-tooltip]") || t.closest("mark[data-hid]")) return;
      setActiveId(null);
      setPos(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  function update(patch: Partial<HMeta>) {
    if (!activeId) return;
    setMeta((prev) => {
      const next = { ...prev[activeId], ...patch };
      applyStyle(next);
      return { ...prev, [activeId]: next };
    });
  }

  function cycleDeco() {
    if (!activeId) return;
    const order: HDeco[] = ["none", "solid", "dashed", "dotted"];
    const cur = meta[activeId]?.deco ?? "none";
    update({ deco: order[(order.indexOf(cur) + 1) % order.length] });
  }

  function remove() {
    if (!activeId) return;
    const el = containerRef.current?.querySelector<HTMLElement>(`mark[data-hid="${activeId}"]`);
    if (el?.parentNode) {
      const parent = el.parentNode;
      while (el.firstChild) parent.insertBefore(el.firstChild, el);
      parent.removeChild(el);
      parent.normalize();
    }
    setMeta((prev) => {
      const n = { ...prev };
      delete n[activeId];
      return n;
    });
    setActiveId(null);
    setPos(null);
  }

  const active = activeId ? meta[activeId] : null;

  return (
    <>
      <div
        ref={containerRef}
        onMouseUp={onMouseUp}
        className="passage-prose select-text font-serif text-[17px] leading-8 text-foreground/90"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {active && pos && (
        <div
          data-hl-tooltip
          style={{ left: pos.x, top: pos.y - 12 }}
          className="fixed z-50 -translate-x-1/2 -translate-y-full"
        >
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-popover p-2 shadow-[var(--shadow-float)]">
            <div className="flex items-center gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.key}
                  onClick={() => update({ color: c.key })}
                  style={{ backgroundColor: c.hex }}
                  className={`h-6 w-6 rounded-full ring-offset-2 ring-offset-popover transition-transform hover:scale-110 ${
                    active.color === c.key ? "ring-2 ring-foreground" : ""
                  }`}
                  aria-label={`Highlight ${c.key}`}
                />
              ))}
              <span className="mx-0.5 h-6 w-px bg-border" />
              <button
                onClick={cycleDeco}
                className={`flex h-7 w-7 items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                  active.deco !== "none" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                }`}
                title={`Underline: ${active.deco}`}
              >
                <Underline className="h-4 w-4" />
              </button>
              <button
                onClick={() => setNoteOpen((v) => !v)}
                className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                  noteOpen || active.note ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                }`}
                title="Add a note"
              >
                <StickyNote className="h-4 w-4" />
              </button>
              <button
                onClick={remove}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive/10"
                title="Delete highlight"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {noteOpen && (
              <textarea
                autoFocus
                value={active.note}
                onChange={(e) => update({ note: e.target.value })}
                placeholder="Add a note... e.g. means smth"
                className="h-16 w-56 resize-none rounded-lg border border-input bg-background p-2 text-sm outline-none focus:border-primary"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
