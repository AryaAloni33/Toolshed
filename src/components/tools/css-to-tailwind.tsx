import { useState } from "react";
import { Wind, Loader2, Sparkles } from "lucide-react";
import { CopyButton, ToolPanel, PrimaryButton, FieldLabel } from "./shared";
import { toast } from "sonner";

export function CssToTailwind() {
    const [css, setCss] = useState("");
    const [tailwind, setTailwind] = useState("");
    const [loading, setLoading] = useState(false);

    const handleConvert = async () => {
        if (!css.trim()) return;
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
                                    "You are a Tailwind CSS expert. Convert the provided CSS rules into equivalent Tailwind utility classes. If there's a direct mapping, provide it. For complex styles, use arbitrary values if necessary. Return the output as a list of class strings for each selector.",
                            },
                            {
                                role: "user",
                                content: css,
                            },
                        ],
                        temperature: 0.2,
                    }),
                },
            );

            const data = await response.json();
            setTailwind(data.choices[0].message.content.trim());
            toast.success("Converted to Tailwind!");
        } catch (error) {
            toast.error("Conversion failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <ToolPanel>
                <FieldLabel>Standard CSS</FieldLabel>
                <textarea
                    value={css}
                    onChange={(e) => setCss(e.target.value)}
                    className="mt-1 block min-h-[200px] w-full resize-y rounded-md border border-border bg-background p-3 font-mono text-sm outline-none focus:border-foreground/30"
                    placeholder=".card { display: flex; padding: 1rem; background: #fff; }"
                />
                <div className="mt-4 flex justify-end">
                    <PrimaryButton onClick={handleConvert} disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wind className="h-4 w-4" />}
                        Convert to Tailwind
                    </PrimaryButton>
                </div>
            </ToolPanel>

            {tailwind && (
                <ToolPanel>
                    <div className="mb-3 flex items-center justify-between">
                        <FieldLabel className="flex items-center gap-1.5">
                            <Sparkles className="h-3 w-3 text-rust" />
                            Tailwind Mapping
                        </FieldLabel>
                        <CopyButton value={tailwind} />
                    </div>
                    <div className="rounded-md border border-border bg-muted/30 p-4 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                        {tailwind}
                    </div>
                </ToolPanel>
            )}
        </div>
    );
}
