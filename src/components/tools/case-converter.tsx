import { useState } from "react";
import { CopyButton, ToolPanel } from "./shared";

const transforms: { id: string; label: string; fn: (s: string) => string }[] = [
  { id: "upper", label: "UPPER CASE", fn: (s) => s.toUpperCase() },
  { id: "lower", label: "lower case", fn: (s) => s.toLowerCase() },
  {
    id: "title",
    label: "Title Case",
    fn: (s) =>
      s.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()),
  },
  {
    id: "sentence",
    label: "Sentence case",
    fn: (s) =>
      s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
  },
  {
    id: "camel",
    label: "camelCase",
    fn: (s) =>
      s.toLowerCase().replace(/[^a-z0-9]+(.)/g, (_, c) => c.toUpperCase()),
  },
  {
    id: "snake",
    label: "snake_case",
    fn: (s) =>
      s
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_|_$/g, ""),
  },
  {
    id: "kebab",
    label: "kebab-case",
    fn: (s) =>
      s
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
  },
  {
    id: "reverse",
    label: "esreveR",
    fn: (s) => s.split("").reverse().join(""),
  },
];

export function CaseConverter() {
  const [input, setInput] = useState(
    "Convert me — I'm waiting in the toolshed.",
  );

  return (
    <div className="space-y-4">
      <ToolPanel>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="block min-h-[120px] w-full resize-y rounded-md border border-border bg-background p-3 text-sm outline-none focus:border-foreground/30"
          placeholder="Type or paste text…"
        />
      </ToolPanel>

      <div className="grid gap-3 md:grid-cols-2">
        {transforms.map((t) => {
          const out = t.fn(input);
          return (
            <ToolPanel key={t.id}>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {t.label}
                </span>
                <CopyButton value={out} />
              </div>
              <p className="break-words text-sm text-foreground/90">
                {out || "—"}
              </p>
            </ToolPanel>
          );
        })}
      </div>
    </div>
  );
}
