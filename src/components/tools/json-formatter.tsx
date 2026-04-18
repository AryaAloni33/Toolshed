import { useMemo, useState } from "react";
import { CopyButton, DownloadButton, GhostButton, ToolPanel } from "./shared";

export function JsonFormatter() {
  const [input, setInput] = useState(`{"hello":"world","numbers":[1,2,3],"nested":{"ok":true}}`);
  const [indent, setIndent] = useState(2);

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true, value: "" };
    try {
      const parsed = JSON.parse(input);
      return { ok: true as const, value: JSON.stringify(parsed, null, indent) };
    } catch (e) {
      return { ok: false as const, value: (e as Error).message };
    }
  }, [input, indent]);

  return (
    <div className="space-y-4">
      <ToolPanel>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Indent</span>
            {[2, 4, 0].map((n) => (
              <button
                key={n}
                onClick={() => setIndent(n)}
                className={`rounded-md border px-2 py-1 font-mono text-xs transition-colors ${
                  indent === n
                    ? "border-foreground/40 bg-muted"
                    : "border-border hover:border-foreground/20"
                }`}
              >
                {n === 0 ? "min" : n}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <GhostButton onClick={() => setInput("")}>Clear</GhostButton>
          </div>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          className="block min-h-[160px] w-full resize-y rounded-md border border-border bg-background p-3 font-mono text-sm outline-none focus:border-foreground/30"
          placeholder="Paste JSON here…"
        />
      </ToolPanel>

      <ToolPanel>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${result.ok ? "bg-moss" : "bg-destructive"}`} />
            <span className="text-sm font-medium">
              {result.ok ? (input.trim() ? "Valid JSON" : "Awaiting input") : "Invalid JSON"}
            </span>
          </div>
          {result.ok && result.value && (
            <div className="flex gap-2">
              <CopyButton value={result.value} />
              <DownloadButton data={result.value} filename="formatted.json" mimeType="application/json" />
            </div>
          )}
        </div>
        <pre className="max-h-[420px] overflow-auto rounded-md border border-border bg-background p-3 font-mono text-sm leading-relaxed">
          {result.ok ? result.value || "—" : <span className="text-destructive">{result.value}</span>}
        </pre>
      </ToolPanel>
    </div>
  );
}
