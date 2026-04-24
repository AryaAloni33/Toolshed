import { useState } from "react";
import { Code2, Loader2, Copy, Check, Sparkles } from "lucide-react";
import { ToolPanel, PrimaryButton, FieldLabel } from "./shared";
import { toast } from "sonner";

export function SvgToJsx() {
    const [svg, setSvg] = useState("");
    const [jsx, setJsx] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(jsx);
        setCopied(true);
        toast.success("JSX copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    const convertWithAi = async () => {
        if (!svg.trim()) return;
        setLoading(true);

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {
                            role: "system",
                            content: `You are a specialist SVG to React converter.
              Clean the provided SVG:
              1. Convert attributes to camelCase (stroke-width -> strokeWidth).
              2. Remove fixed width/height but keep viewBox.
              3. Replace hardcoded fills/strokes with 'currentColor' where appropriate.
              4. Return ONLY a functional React component using TypeScript.
              5. Do NOT include any markdown formatting, just the code.`
                        },
                        {
                            role: "user",
                            content: svg
                        }
                    ]
                })
            });

            const data = await response.json();
            const result = data.choices[0].message.content.trim();
            setJsx(result);
        } catch (error) {
            toast.error("AI conversion failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
                <ToolPanel>
                    <FieldLabel>Paste Raw SVG</FieldLabel>
                    <textarea
                        value={svg}
                        onChange={(e) => setSvg(e.target.value)}
                        placeholder="<svg ...>...</svg>"
                        className="mt-2 h-[400px] w-full rounded-lg border border-border bg-background p-4 font-mono text-xs outline-none focus:border-foreground/20"
                    />
                    <PrimaryButton
                        onClick={convertWithAi}
                        disabled={loading || !svg}
                        className="mt-4 w-full"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Cleaning with AI...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-4 w-4" />
                                Convert to Clean JSX
                            </>
                        )}
                    </PrimaryButton>
                </ToolPanel>

                <ToolPanel>
                    <div className="flex items-center justify-between">
                        <FieldLabel>React Component</FieldLabel>
                        {jsx && (
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                            >
                                {copied ? <Check className="h-3.5 w-3.5 text-moss" /> : <Copy className="h-3.5 w-3.5" />}
                                {copied ? "Copied" : "Copy"}
                            </button>
                        )}
                    </div>
                    <div className="relative mt-2 h-[400px] w-full overflow-hidden rounded-lg border border-border bg-muted/30">
                        {jsx ? (
                            <pre className="h-full overflow-auto p-4 font-mono text-xs leading-relaxed">
                                {jsx}
                            </pre>
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center text-center p-8 text-muted-foreground">
                                <Code2 className="h-8 w-8 opacity-20 mb-2" />
                                <p className="text-xs">Your optimized React component will appear here.</p>
                            </div>
                        )}
                    </div>
                </ToolPanel>
            </div>
        </div>
    );
}
