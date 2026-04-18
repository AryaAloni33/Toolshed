import { useState } from "react";
import { toast } from "sonner";
import { Sparkles, Copy } from "lucide-react";
import {
  PrimaryButton,
  ToolPanel,
  GhostButton,
  CopyButton,
  FieldLabel,
} from "./shared";

export function TextSummarizer() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [sentenceCount, setSentenceCount] = useState(3);

  const summarize = () => {
    if (!text.trim()) return;

    // Simple extractive summarization: take the most "important" sentences
    // For this simple version, we'll just take the first N sentences or sentences containing keywords
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const result = sentences.slice(0, sentenceCount).join(" ").trim();

    setSummary(result);
    toast.success("Summarized text");
  };

  return (
    <div className="space-y-4">
      <ToolPanel>
        <div className="space-y-4">
          <div>
            <FieldLabel>Original Text</FieldLabel>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste long text here..."
              className="h-40 w-full rounded-md border border-border bg-background p-3 text-sm outline-none focus:border-foreground/30"
            />
          </div>

          <div className="flex items-end gap-4">
            <div className="flex-1">
              <FieldLabel>Number of Sentences</FieldLabel>
              <input
                type="number"
                min={1}
                max={20}
                value={sentenceCount}
                onChange={(e) => setSentenceCount(Number(e.target.value))}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/30"
              />
            </div>
            <PrimaryButton onClick={summarize}>
              <Sparkles className="h-4 w-4" />
              Summarize
            </PrimaryButton>
          </div>
        </div>
      </ToolPanel>

      {summary && (
        <ToolPanel className="border-accent/20 bg-accent/5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-accent">
              Summary
            </h3>
            <CopyButton value={summary} />
          </div>
          <p className="text-sm leading-relaxed">{summary}</p>
        </ToolPanel>
      )}
    </div>
  );
}
