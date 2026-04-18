import { useState, useMemo } from "react";
import { CopyButton, GhostButton, ToolPanel, PrimaryButton, FieldLabel } from "./shared";
import { BookOpen, Brain, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function TextToLatex() {
    const [input, setInput] = useState("");
    const [wrapDoc, setWrapDoc] = useState(false);

    // AI Integration state
    const [aiPrompt, setAiPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [aiOutput, setAiOutput] = useState("");

    const escapedResult = useMemo(() => {
        if (!input) return "";

        // Basic LaTeX escaping algorithm
        let escaped = input
            .replace(/\\/g, "\\textbackslash{}")
            .replace(/\{/g, "\\{")
            .replace(/\}/g, "\\}")
            .replace(/\$/g, "\\$")
            .replace(/&/g, "\\&")
            .replace(/%/g, "\\%")
            .replace(/#/g, "\\#")
            .replace(/_/g, "\\_")
            .replace(/\^/g, "\\textasciicircum{}")
            .replace(/~/g, "\\textasciitilde{}")
            .replace(/</g, "\\textless{}")
            .replace(/>/g, "\\textgreater{}");

        if (wrapDoc) {
            return `\\documentclass{article}\n\\usepackage[utf8]{inputenc}\n\n\\begin{document}\n\n${escaped}\n\n\\end{document}`;
        }
        return escaped;
    }, [input, wrapDoc]);

    // Derived final output
    const texResult = aiOutput || escapedResult;

    const handleAiProcess = async () => {
        if (!input.trim() && !aiPrompt.trim()) {
            toast.error("Please provide some text or instructions for the AI.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
                            content: "You are a LaTeX expert. Convert the user's plain text into valid LaTeX code based on their instructions. Output ONLY the raw LaTeX string, without markdown formatting blocks (no ```latex) or explanations. Just the raw code. Do NOT wrap in document structure unless specified.",
                        },
                        {
                            role: "user",
                            content: `Instructions: ${aiPrompt || "Convert to correct LaTeX"}\n\nText:\n${input}`,
                        },
                    ],
                    temperature: 0.2,
                    max_tokens: 2048,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch from AI");
            }

            const data = await response.json();
            let aiTex = data.choices[0].message.content.trim();
            // Remove any leftover markdown ticks just in case
            aiTex = aiTex.replace(/^```(latex|tex)?\n?/i, "").replace(/\n?```$/i, "");

            if (wrapDoc) {
                aiTex = `\\documentclass{article}\n\\usepackage[utf8]{inputenc}\n\\usepackage{amsmath}\n\n\\begin{document}\n\n${aiTex}\n\n\\end{document}`;
            }

            setAiOutput(aiTex);
            toast.success("AI generated LaTeX successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to process with AI.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <ToolPanel>
                <div className="mb-3 flex items-center justify-between">
                    <FieldLabel>Plain Text / Input Data</FieldLabel>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
                            <input
                                type="checkbox"
                                checked={wrapDoc}
                                onChange={(e) => {
                                    setWrapDoc(e.target.checked);
                                    setAiOutput(""); // Clear AI output to re-trigger wrap
                                }}
                                className="accent-foreground"
                            />
                            Wrap in document structure
                        </label>
                        <GhostButton onClick={() => {
                            setInput("");
                            setAiOutput("");
                        }}>Clear</GhostButton>
                    </div>
                </div>
                <textarea
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        if (aiOutput) setAiOutput(""); // Reset AI override when user types
                    }}
                    spellCheck={false}
                    className="block min-h-[160px] w-full resize-y rounded-md border border-border bg-background p-3 font-sans text-sm outline-none focus:border-foreground/30 text-foreground"
                    placeholder="Paste raw text or math equations here..."
                />

                <div className="mt-4 flex gap-3 items-center rounded-md border border-purple-500/30 bg-purple-500/10 p-3">
                    <Brain className="h-5 w-5 text-purple-400 shrink-0" />
                    <input
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="Ask AI to format it (e.g. 'Turn this into a LaTeX table' or 'Format math expression')"
                        className="flex-1 bg-transparent border-none text-sm outline-none placeholder:text-purple-400/50 text-foreground min-w-0"
                        onKeyDown={(e) => e.key === "Enter" && handleAiProcess()}
                    />
                    <PrimaryButton
                        onClick={handleAiProcess}
                        disabled={loading}
                        className="bg-purple-600 hover:bg-purple-700 text-white shrink-0 shadow-sm border border-purple-800"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <BookOpen className="h-4 w-4 mr-1.5" />}
                        Generate LaTeX
                    </PrimaryButton>
                </div>
            </ToolPanel>

            <ToolPanel>
                <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FieldLabel>LaTeX Output</FieldLabel>
                        {aiOutput && <span className="text-[10px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">AI Generated</span>}
                    </div>
                    {texResult && <CopyButton value={texResult} />}
                </div>
                <pre className="block min-h-[160px] max-h-[400px] overflow-auto whitespace-pre-wrap rounded-md border border-border bg-muted/10 p-4 font-mono text-sm leading-relaxed text-foreground">
                    {texResult || "Waiting for input..."}
                </pre>
            </ToolPanel>
        </div>
    );
}
