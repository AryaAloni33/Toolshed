import { useMemo, useState } from "react";
import { CopyButton, ToolPanel } from "./shared";

export function TextCleanup() {
  const [input, setInput] = useState("");
  const [opts, setOpts] = useState({
    trimLines: true,
    collapseSpaces: true,
    removeEmptyLines: true,
    removeTabs: false,
    smartQuotes: false,
  });

  const output = useMemo(() => {
    let s = input;
    if (opts.removeTabs) s = s.replace(/\t/g, " ");
    if (opts.collapseSpaces) s = s.replace(/[ \t]+/g, " ");
    if (opts.trimLines)
      s = s
        .split("\n")
        .map((l) => l.trim())
        .join("\n");
    if (opts.removeEmptyLines) s = s.split(/\n+/).filter(Boolean).join("\n");
    if (opts.smartQuotes)
      s = s.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
    return s;
  }, [input, opts]);

  const toggles: { key: keyof typeof opts; label: string }[] = [
    { key: "trimLines", label: "Trim lines" },
    { key: "collapseSpaces", label: "Collapse spaces" },
    { key: "removeEmptyLines", label: "Remove empty lines" },
    { key: "removeTabs", label: "Tabs → spaces" },
    { key: "smartQuotes", label: "Straighten quotes" },
  ];

  return (
    <div className="space-y-4">
      <ToolPanel>
        <div className="mb-3 flex flex-wrap gap-2">
          {toggles.map((t) => (
            <button
              key={t.key}
              onClick={() => setOpts((p) => ({ ...p, [t.key]: !p[t.key] }))}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                opts[t.key]
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="block min-h-[180px] w-full resize-y rounded-md border border-border bg-background p-3 font-mono text-sm outline-none focus:border-foreground/30"
          placeholder="Paste messy text…"
        />
      </ToolPanel>

      <ToolPanel>
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Cleaned
          </span>
          {output && <CopyButton value={output} />}
        </div>
        <pre className="max-h-[400px] overflow-auto rounded-md border border-border bg-background p-3 font-mono text-sm whitespace-pre-wrap">
          {output || "—"}
        </pre>
      </ToolPanel>
    </div>
  );
}
