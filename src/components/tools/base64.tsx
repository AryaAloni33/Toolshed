import { useMemo, useState } from "react";
import { CopyButton, ToolPanel } from "./shared";

export function Base64Tool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");

  const output = useMemo(() => {
    if (!input) return "";
    try {
      if (mode === "encode") {
        return btoa(unescape(encodeURIComponent(input)));
      }
      return decodeURIComponent(escape(atob(input)));
    } catch {
      return "⚠️ Invalid input for selected mode";
    }
  }, [mode, input]);

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-md border border-border bg-card p-0.5">
        {(["encode", "decode"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === m ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {m === "encode" ? "Encode" : "Decode"}
          </button>
        ))}
      </div>

      <ToolPanel>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          className="block min-h-[140px] w-full resize-y rounded-md border border-border bg-background p-3 font-mono text-sm outline-none focus:border-foreground/30"
          placeholder={mode === "encode" ? "Plain text…" : "Base64 string…"}
        />
      </ToolPanel>

      <ToolPanel>
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Result
          </span>
          {output && <CopyButton value={output} />}
        </div>
        <pre className="max-h-[300px] overflow-auto rounded-md border border-border bg-background p-3 font-mono text-sm break-all whitespace-pre-wrap">
          {output || "—"}
        </pre>
      </ToolPanel>
    </div>
  );
}
