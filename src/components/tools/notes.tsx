import { useEffect, useState } from "react";
import { ToolPanel } from "./shared";

const KEY = "toolshed-notes";

export function Notes() {
  const [text, setText] = useState("");
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    if (stored) setText(stored);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem(KEY, text);
      setSavedAt(new Date());
    }, 350);
    return () => clearTimeout(t);
  }, [text]);

  return (
    <ToolPanel>
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          Always saved locally
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {savedAt ? `Saved at ${savedAt.toLocaleTimeString()}` : "—"}
        </span>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing. Stays here between visits."
        className="block min-h-[420px] w-full resize-y rounded-md border border-border bg-background p-4 font-serif text-base leading-relaxed outline-none focus:border-foreground/30"
        style={{ fontFamily: "var(--font-serif)" }}
      />
      <div className="mt-3 flex justify-between font-mono text-xs text-muted-foreground">
        <span>{text.length} characters</span>
        <span>{text.trim() ? text.trim().split(/\s+/).length : 0} words</span>
      </div>
    </ToolPanel>
  );
}
