import { useState } from "react";
import { Code2, Loader2, Sparkles, Send } from "lucide-react";
import { CopyButton, ToolPanel, PrimaryButton, FieldLabel } from "./shared";
import { toast } from "sonner";

export function HtmlToJsx() {
  const [html, setHtml] = useState("");
  const [jsx, setJsx] = useState("");
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [editing, setEditing] = useState(false);

  const convertHtml = async (inputHtml: string) => {
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
                  "You are a React expert. Convert the provided HTML to clean JSX/TSX. Replace 'class' with 'className', ensure all tags are closed, and convert inline styles to objects. Return ONLY the code, no explanation.",
              },
              {
                role: "user",
                content: inputHtml,
              },
            ],
            temperature: 0.2,
          }),
        },
      );

      const data = await response.json();
      setJsx(data.choices[0].message.content.replace(/```(jsx|tsx|html)?/g, "").trim());
      toast.success("Converted to JSX!");
    } catch (error) {
      toast.error("Conversion failed");
    } finally {
      setLoading(false);
    }
  };

  const refineJsx = async () => {
    if (!prompt.trim()) return;
    setEditing(true);
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
                  "You are a React refactoring expert. Modify the provided JSX based on the user's instructions. Keep the overall structure but apply the requested changes. Return ONLY the code.",
              },
              {
                role: "user",
                content: `Base JSX:\n${jsx}\n\nInstruction: ${prompt}`,
              },
            ],
            temperature: 0.2,
          }),
        },
      );

      const data = await response.json();
      setJsx(data.choices[0].message.content.replace(/```(jsx|tsx|html)?/g, "").trim());
      setPrompt("");
      toast.success("JSX Updated!");
    } catch (error) {
      toast.error("Refinement failed");
    } finally {
      setEditing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="space-y-4">
        <ToolPanel>
          <FieldLabel>HTML Input</FieldLabel>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="mt-1 block min-h-[400px] w-full resize-none rounded-md border border-border bg-background p-3 font-mono text-xs outline-none focus:border-foreground/30"
            placeholder="<div class='btn'>Click me</div>"
          />
          <div className="mt-4 flex justify-end">
            <PrimaryButton onClick={() => convertHtml(html)} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Code2 className="h-4 w-4" />}
              Convert to JSX
            </PrimaryButton>
          </div>
        </ToolPanel>
      </div>

      <div className="space-y-4">
        <ToolPanel className="min-h-[400px] flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <FieldLabel>JSX/TSX Output</FieldLabel>
            <CopyButton value={jsx} />
          </div>
          <div className="flex-1 overflow-auto rounded-md border border-border bg-muted/30 p-3 font-mono text-xs whitespace-pre">
            {jsx || "// Converted code will appear here..."}
          </div>

          {jsx && (
            <div className="mt-4 space-y-2">
              <FieldLabel className="flex items-center gap-1.5 grayscale opacity-70">
                <Sparkles className="h-3 w-3" />
                Refine with AI
              </FieldLabel>
              <div className="flex gap-2">
                <input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && refineJsx()}
                  placeholder="e.g., 'Make it a functional component with a click handler'..."
                  className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-foreground/30"
                />
                <button
                  onClick={refineJsx}
                  disabled={editing || !prompt.trim()}
                  className="rounded-md bg-foreground px-3 py-1.5 text-background hover:opacity-90 disabled:opacity-50"
                >
                  {editing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                </button>
              </div>
            </div>
          )}
        </ToolPanel>
      </div>
    </div>
  );
}
