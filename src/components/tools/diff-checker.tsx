import { useState } from "react";
import { diffLines, Change } from "diff";
import { Copy, Columns, ArrowRight } from "lucide-react";
import { ToolPanel, PrimaryButton, GhostButton, FieldLabel } from "./shared";
import { cn } from "@/lib/utils";

export function DiffChecker() {
  const [oldText, setOldText] = useState("");
  const [newText, setNewText] = useState("");
  const [diffs, setDiffs] = useState<Change[] | null>(null);

  const compare = () => {
    const result = diffLines(oldText, newText);
    setDiffs(result);
  };

  return (
    <div className="space-y-4">
      <ToolPanel>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <FieldLabel>Original Text</FieldLabel>
            <textarea
              value={oldText}
              onChange={(e) => setOldText(e.target.value)}
              placeholder="Paste original text here..."
              className="h-48 w-full rounded-md border border-border bg-background p-3 font-mono text-xs outline-none focus:border-foreground/30"
            />
          </div>
          <div>
            <FieldLabel>New Text</FieldLabel>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Paste modified text here..."
              className="h-48 w-full rounded-md border border-border bg-background p-3 font-mono text-xs outline-none focus:border-foreground/30"
            />
          </div>
        </div>
        <PrimaryButton onClick={compare} className="mt-4 w-full">
          Compare Texts
        </PrimaryButton>
      </ToolPanel>

      {diffs && (
        <ToolPanel className="bg-muted/10 p-0 overflow-hidden">
          <div className="border-b border-border bg-muted/30 px-4 py-2 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Comparison Result
            </h3>
            <div className="flex gap-4 text-[10px]">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-red-400/20 border border-red-500/50" />{" "}
                Removed
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-400/20 border border-green-500/50" />{" "}
                Added
              </span>
            </div>
          </div>
          <div className="max-h-[500px] overflow-y-auto p-4 font-mono text-xs leading-relaxed">
            {diffs.map((part, i) => (
              <div
                key={i}
                className={cn(
                  "p-0.5 whitespace-pre-wrap rounded",
                  part.added
                    ? "bg-green-500/10 text-green-700 border-l-2 border-green-500 pl-2"
                    : part.removed
                      ? "bg-red-500/10 text-red-700 border-l-2 border-red-500 pl-2 opacity-70"
                      : "text-muted-foreground",
                )}
              >
                {part.added ? "+ " : part.removed ? "- " : "  "}
                {part.value}
              </div>
            ))}
          </div>
        </ToolPanel>
      )}
    </div>
  );
}
