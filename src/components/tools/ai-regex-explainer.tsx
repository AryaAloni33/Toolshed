import { useState } from "react";
import { Brain, Loader2, Search } from "lucide-react";
import { CopyButton, ToolPanel, PrimaryButton, FieldLabel } from "./shared";
import { toast } from "sonner";

export function AiRegexExplainer() {
  const [regex, setRegex] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExplain = async () => {
    if (!regex.trim()) {
      toast.error("Please enter a regular expression");
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
                  "You are a Regex Expert. Break down the provided regular expression step-by-step. Explain what each part does (groups, quantifiers, anchors, etc.) in a clear, easy-to-understand way. Use a list or bullet points.",
              },
              {
                role: "user",
                content: `Explain this regex: ${regex}`,
              },
            ],
            temperature: 0.3,
            max_tokens: 1024,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch from AI service");
      }

      const data = await response.json();
      setExplanation(data.choices[0].message.content);
      toast.success("Explanation generated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to explain regex");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <ToolPanel>
        <FieldLabel>Regular Expression</FieldLabel>
        <div className="relative mt-1">
          <input
            value={regex}
            onChange={(e) => setRegex(e.target.value)}
            className="block w-full rounded-md border border-border bg-background p-3 font-mono text-sm outline-none focus:border-foreground/30"
            placeholder="/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/"
          />
        </div>
        <div className="mt-4 flex justify-end">
          <PrimaryButton onClick={handleExplain} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Explaining...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4" />
                Explain Regex
              </>
            )}
          </PrimaryButton>
        </div>
      </ToolPanel>

      {explanation && (
        <ToolPanel>
          <div className="mb-3 flex items-center justify-between">
            <FieldLabel>Breakdown</FieldLabel>
            <CopyButton value={explanation} />
          </div>
          <div className="prose prose-sm prose-invert max-w-none rounded-md border border-border bg-background p-4 font-sans text-sm whitespace-pre-wrap leading-relaxed">
            {explanation}
          </div>
        </ToolPanel>
      )}
    </div>
  );
}
