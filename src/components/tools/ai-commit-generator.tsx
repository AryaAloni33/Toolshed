import { useState } from "react";
import { GitCommit, Loader2, Brain } from "lucide-react";
import { CopyButton, ToolPanel, PrimaryButton, FieldLabel } from "./shared";
import { toast } from "sonner";

export function AiCommitGenerator() {
  const [diff, setDiff] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const generateCommit = async () => {
    if (!diff.trim()) {
      toast.error("Please paste a git diff");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content:
                  "You are a developer assistant. Analyze the provided git diff and generate a professional, concise 'Conventional Commit' message. Include a subject line and, if changes are significant, a brief bulleted description. Focus on the WHY and WHAT changed.",
              },
              {
                role: "user",
                content: `Generate a commit message for this diff:\n\n${diff}`,
              },
            ],
            temperature: 0.4,
          }),
        },
      );

      const data = await response.json();
      setMessage(data.choices[0].message.content.trim());
      toast.success("Commit message ready!");
    } catch (error) {
      toast.error("Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <ToolPanel>
        <FieldLabel>Git Diff</FieldLabel>
        <textarea
          value={diff}
          onChange={(e) => setDiff(e.target.value)}
          className="mt-1 block min-h-[250px] w-full resize-y rounded-md border border-border bg-background p-3 font-mono text-xs outline-none focus:border-foreground/30"
          placeholder="Paste your git diff here (e.g., git diff --cached)..."
        />
        <div className="mt-4 flex justify-end">
          <PrimaryButton onClick={generateCommit} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GitCommit className="h-4 w-4" />}
            Generate Commit
          </PrimaryButton>
        </div>
      </ToolPanel>

      {message && (
        <ToolPanel>
          <div className="mb-3 flex items-center justify-between">
            <FieldLabel>Commit Message</FieldLabel>
            <CopyButton value={message} />
          </div>
          <div className="rounded-md border border-border bg-background p-4 font-sans text-sm whitespace-pre-wrap leading-relaxed">
            {message}
          </div>
          <div className="mt-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            Tip: Use `git commit -m "$(pbpaste)"` to quickly commit this.
          </div>
        </ToolPanel>
      )}
    </div>
  );
}
