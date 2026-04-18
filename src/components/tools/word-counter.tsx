import { useMemo, useState } from "react";
import { ToolPanel } from "./shared";

export function WordCounter() {
  const [input, setInput] = useState("");

  const stats = useMemo(() => {
    const chars = input.length;
    const charsNoSpace = input.replace(/\s/g, "").length;
    const words = input.trim() ? input.trim().split(/\s+/).length : 0;
    const lines = input ? input.split(/\r?\n/).length : 0;
    const sentences = input.trim()
      ? (input.match(/[^.!?]+[.!?]+/g) || [input]).length
      : 0;
    const readingMin = Math.max(1, Math.round(words / 200));
    const speakingMin = Math.max(1, Math.round(words / 130));
    return {
      chars,
      charsNoSpace,
      words,
      lines,
      sentences,
      readingMin,
      speakingMin,
    };
  }, [input]);

  const items = [
    { label: "Words", value: stats.words },
    { label: "Characters", value: stats.chars },
    { label: "Without spaces", value: stats.charsNoSpace },
    { label: "Sentences", value: stats.sentences },
    { label: "Lines", value: stats.lines },
    { label: "Reading", value: `~${stats.readingMin}m` },
    { label: "Speaking", value: `~${stats.speakingMin}m` },
  ];

  return (
    <div className="space-y-4">
      <ToolPanel>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="block min-h-[280px] w-full resize-y rounded-md border border-border bg-background p-3 text-sm leading-relaxed outline-none focus:border-foreground/30"
          placeholder="Start typing or paste your text…"
        />
      </ToolPanel>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-border bg-card p-3"
          >
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {item.label}
            </div>
            <div className="mt-1 font-display text-2xl font-semibold tabular-nums">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
