import { useState } from "react";
import { Database, Loader2, Sparkles, Copy, Check, Table, MessageSquare, Download } from "lucide-react";
import { ToolPanel, FieldLabel, PrimaryButton, GhostButton } from "./shared";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function AiDataGenerator() {
  const [prompt, setPrompt] = useState("");
  const [count, setCount] = useState(10);
  const [format, setFormat] = useState<"json" | "csv">("json");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please describe what data you want to generate");
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
                content: `You are an expert mock data architect. Generate realistic, high-quality mock data based on the user's request. 
                - If JSON is requested, return a valid JSON array of objects.
                - If CSV is requested, return a valid CSV with headers.
                - Ensure the data is diverse and realistic (e.g., real-sounding names, addresses, emails).
                - Return ONLY the data. Do not provide any conversational text.
                - Maximize realism and logical consistency between fields.`,
              },
              {
                role: "user",
                content: `Request: Generate ${count} records of ${prompt} in ${format.toUpperCase()} format.`,
              },
            ],
            temperature: 0.7,
            max_tokens: 4096,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to generate data. Check your API key.");
      }

      const data = await response.json();
      let content = data.choices[0].message.content;
      
      // Clean up markdown blocks
      content = content.replace(/```(?:json|csv)?\n?|```/g, "").trim();
      
      setResult(content);
      toast.success("Mock data generated!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([result], { type: format === "json" ? "application/json" : "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mock-data.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <ToolPanel className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-3.5 w-3.5 text-rust" />
                <FieldLabel className="mb-0">Describe your dataset</FieldLabel>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="block min-h-[140px] w-full resize-none rounded-md border border-border bg-background p-3 font-sans text-sm outline-none focus:border-foreground/30"
                placeholder="e.g., Users for a SaaS app with name, role (Admin/Editor/Viewer), last login date, and a profile bio about their tech stack..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Record Count</FieldLabel>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                  className="block w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/30"
                />
              </div>
              <div>
                <FieldLabel>Export Format</FieldLabel>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="block w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/30"
                >
                  <option value="json">JSON Array</option>
                  <option value="csv">CSV Table</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <PrimaryButton onClick={handleGenerate} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Architecting Data...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Dataset
                  </>
                )}
              </PrimaryButton>
            </div>
          </ToolPanel>
        </div>

        <div className="space-y-4">
          <ToolPanel className="h-full flex flex-col min-h-[400px]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="h-3.5 w-3.5 text-ink" />
                <FieldLabel className="mb-0">Generated Output</FieldLabel>
              </div>
              <div className="flex items-center gap-2">
                {result && (
                  <>
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </button>
                    <div className="w-px h-3 bg-border mx-1" />
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-moss" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex-1 rounded-lg bg-background p-4 border border-border font-mono text-[12px] leading-relaxed overflow-auto relative group">
              {result ? (
                <pre className="whitespace-pre-wrap">{result}</pre>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/30 text-center p-8">
                  <Table className="h-12 w-12 mb-4 opacity-10" strokeWidth={1} />
                  <p className="text-sm">Your realistic mock data will appear here</p>
                </div>
              )}
            </div>
          </ToolPanel>
        </div>
      </div>
    </div>
  );
}
