import { useState } from "react";
import { Sparkles, Loader2, Copy, Check, MessageSquare, Terminal } from "lucide-react";
import { ToolPanel, FieldLabel, PrimaryButton } from "./shared";
import { toast } from "sonner";

export function AiSystemPromptBuilder() {
  const [prompt, setPrompt] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a basic prompt or idea");
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
                content: `You are a master Prompt Engineer. Your task is to transform a simple user idea into a hyper-specific, high-performance system prompt.
                
                Guidelines:
                - Use a direct, first-person instruction style (e.g., "You are a UI/UX developer...", "Your goal is to...", "Always follow these rules...").
                - Avoid using document-style tags like <identity> or <context>. Use natural headings if needed, but favor direct instructions.
                - Be extremely precise about the AI's role, expertise, and specific constraints.
                - Ensure the tone and communication style of the generated prompt are clearly defined.
                - The prompt should be ready to be pasted directly into a "system" role of an LLM.
                
                Return ONLY the final system prompt text without any conversational prefix or suffix.`,
              },
              {
                role: "user",
                content: `Build a detailed system prompt for: ${prompt}`,
              },
            ],
            temperature: 0.3,
            max_tokens: 2048,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || "Failed to fetch from Groq");
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      setSystemPrompt(content.trim());
      toast.success("System prompt built!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(systemPrompt);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <ToolPanel className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-3.5 w-3.5 text-rust" />
                <FieldLabel className="mb-0">Your Idea or Simple Prompt</FieldLabel>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="block min-h-[160px] w-full resize-none rounded-md border border-border bg-background p-3 font-sans text-sm outline-none focus:border-foreground/30"
                placeholder="e.g., A helpful coding assistant for Python..."
              />
            </div>

            <div className="flex justify-end pt-2">
              <PrimaryButton onClick={handleGenerate} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Building Prompt...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Build Detailed System Prompt
                  </>
                )}
              </PrimaryButton>
            </div>
            
            <div className="rounded-lg bg-rust/5 border border-rust/10 p-4 text-xs text-rust/80">
              <p className="font-semibold mb-1">Pro Tip:</p>
              <p>The more context you give, the better the system prompt will be. Mention specific frameworks, tones, or output styles.</p>
            </div>
          </ToolPanel>
        </div>

        <div className="space-y-4">
          <ToolPanel className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-ink" />
                <FieldLabel className="mb-0">Generated System Prompt</FieldLabel>
              </div>
              {systemPrompt && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-moss" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              )}
            </div>
            
            <div className="flex-1 rounded-lg bg-background p-4 border border-border font-mono text-sm leading-relaxed overflow-auto min-h-[400px] relative">
              {systemPrompt ? (
                <pre className="whitespace-pre-wrap">{systemPrompt}</pre>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/40 text-center p-8">
                  <Sparkles className="h-12 w-12 mb-4 opacity-10" strokeWidth={1} />
                  <p className="text-sm">Your detailed system prompt will appear here</p>
                </div>
              )}
            </div>
          </ToolPanel>
        </div>
      </div>
    </div>
  );
}
