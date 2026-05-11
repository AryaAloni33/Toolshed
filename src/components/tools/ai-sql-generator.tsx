import { useState } from "react";
import { Database, Loader2, Sparkles, Copy, Check, Table, MessageSquare } from "lucide-react";
import { ToolPanel, FieldLabel, PrimaryButton, GhostButton } from "./shared";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function AiSqlGenerator() {
  const [prompt, setPrompt] = useState("");
  const [schema, setSchema] = useState("");
  const [sql, setSql] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please describe what data you want to fetch");
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
                content: `You are an expert SQL generator. Convert the user's natural language request into a valid, optimized SQL query. 
                If a schema is provided, strictly follow it. If not, infer reasonable table and column names.
                Return ONLY the SQL code block. Do not provide any conversational text before or after the code.
                Format the SQL nicely with proper indentation.`,
              },
              {
                role: "user",
                content: `Request: ${prompt}\n\nSchema (Optional): ${schema || "Not provided"}`,
              },
            ],
            temperature: 0.1,
            max_tokens: 1024,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || "Failed to fetch from Groq");
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      // Clean up markdown code blocks if present
      const cleanedSql = content.replace(/```sql\n?|```/g, "").trim();
      setSql(cleanedSql);
      toast.success("SQL Query generated!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    toast.success("SQL copied to clipboard");
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
                <FieldLabel className="mb-0">Natural Language Request</FieldLabel>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="block min-h-[120px] w-full resize-none rounded-md border border-border bg-background p-3 font-sans text-sm outline-none focus:border-foreground/30"
                placeholder="e.g., Get the total revenue from orders placed in the last 30 days, grouped by category..."
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Table className="h-3.5 w-3.5 text-moss" />
                <FieldLabel className="mb-0">Table Schema (Optional)</FieldLabel>
              </div>
              <textarea
                value={schema}
                onChange={(e) => setSchema(e.target.value)}
                className="block min-h-[120px] w-full resize-none rounded-md border border-border bg-background p-3 font-mono text-[11px] outline-none focus:border-foreground/30"
                placeholder="e.g., Table orders (id, user_id, amount, status, created_at) ..."
              />
            </div>

            <div className="flex justify-end pt-2">
              <PrimaryButton onClick={handleGenerate} disabled={loading} className="w-full sm:w-auto">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate SQL
                  </>
                )}
              </PrimaryButton>
            </div>
          </ToolPanel>
        </div>

        <div className="space-y-4">
          <ToolPanel className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="h-3.5 w-3.5 text-ink" />
                <FieldLabel className="mb-0">Generated SQL Query</FieldLabel>
              </div>
              {sql && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-moss" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy SQL"}
                </button>
              )}
            </div>
            
            <div className="flex-1 rounded-lg bg-background p-4 border border-border font-mono text-sm leading-relaxed overflow-auto min-h-[300px] relative">
              {sql ? (
                <pre className="whitespace-pre-wrap">{sql}</pre>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/40 text-center p-8">
                  <Database className="h-12 w-12 mb-4 opacity-10" strokeWidth={1} />
                  <p className="text-sm">Your generated SQL will appear here</p>
                </div>
              )}
            </div>
          </ToolPanel>
        </div>
      </div>
    </div>
  );
}
