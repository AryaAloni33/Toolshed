import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { CopyButton, GhostButton, PrimaryButton, ToolPanel } from "./shared";

function uuidv4() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function UuidGenerator() {
  const [count, setCount] = useState(8);
  const [ids, setIds] = useState<string[]>(() => Array.from({ length: 8 }, uuidv4));

  const regenerate = () => setIds(Array.from({ length: count }, uuidv4));

  return (
    <div className="space-y-4">
      <ToolPanel>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              How many?
            </span>
            <div className="mt-1.5 flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={100}
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
                className="w-20 rounded-md border border-border bg-background px-3 py-2 text-sm font-mono outline-none focus:border-foreground/30"
              />
              <PrimaryButton onClick={regenerate}>
                <RefreshCw className="h-4 w-4" /> Generate
              </PrimaryButton>
            </div>
          </div>
          <CopyButton value={ids.join("\n")} label="Copy all" />
        </div>
      </ToolPanel>

      <ToolPanel>
        <ul className="divide-y divide-border">
          {ids.map((id, i) => (
            <li key={i} className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0">
              <code className="font-mono text-sm text-foreground/90">{id}</code>
              <GhostButton onClick={() => navigator.clipboard.writeText(id)}>Copy</GhostButton>
            </li>
          ))}
        </ul>
      </ToolPanel>
    </div>
  );
}
