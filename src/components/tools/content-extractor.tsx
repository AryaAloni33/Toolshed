import { useState } from "react";
import { BookOpen, Loader2 } from "lucide-react";
import { CopyButton, ToolPanel, PrimaryButton, FieldLabel } from "./shared";
import { toast } from "sonner";

export function ContentExtractor() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExtract = async () => {
    if (!input.trim()) {
      toast.error("Please enter some text to analyze");
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
                  "You are a data extraction assistant. Extract key entities, dates, URLs, and main themes from the provided text. Return the result in a clean, structured format (using markdown headers and bullets).",
              },
              {
                role: "user",
                content: input,
              },
            ],
            temperature: 0.3,
            max_tokens: 1536,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || "Failed to fetch from Groq",
        );
      }

      const data = await response.json();
      setOutput(data.choices[0].message.content);
      toast.success("Content extracted!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <ToolPanel>
        <FieldLabel>Paste Content (Article, Email, or Text)</FieldLabel>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="block min-h-[200px] w-full resize-y rounded-md border border-border bg-background p-3 font-sans text-sm outline-none focus:border-foreground/30"
          placeholder="Paste text here to extract key info..."
        />
        <div className="mt-4 flex justify-end">
          <PrimaryButton onClick={handleExtract} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Extracting...
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4" />
                Extract Key Info
              </>
            )}
          </PrimaryButton>
        </div>
      </ToolPanel>

      {output && (
        <ToolPanel>
          <div className="mb-3 flex items-center justify-between">
            <FieldLabel>Extracted Insights</FieldLabel>
            <CopyButton value={output} />
          </div>
          <div className="rounded-md border border-border bg-background p-4 font-sans text-sm whitespace-pre-wrap leading-relaxed">
            {output}
          </div>
        </ToolPanel>
      )}
    </div>
  );
}
