import { useState } from "react";
import { Palette, Loader2, Sparkles, Copy, Check, RefreshCw } from "lucide-react";
import { ToolPanel, PrimaryButton, FieldLabel } from "./shared";
import { toast } from "sonner";

interface Color {
    hex: string;
    name: string;
}

export function AiColorScout() {
    const [prompt, setPrompt] = useState("");
    const [palette, setPalette] = useState<Color[]>([]);
    const [loading, setLoading] = useState(false);

    const generatePalette = async () => {
        if (!prompt.trim() || loading) return;
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
                            content: `You are a professional color theorist and UI designer.
              Given a mood, description, or brand idea, generate a cohesive color palette of 5 colors.
              Include HEX codes and a creative name for each color.
              Return ONLY a valid JSON object with this structure:
              {"palette": [{"hex": "#FFFFFF", "name": "Snowy Peak"}]}`
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    response_format: { type: "json_object" }
                })
            });

            const data = await response.json();
            const content = JSON.parse(data.choices[0].message.content);
            setPalette(content.palette || []);
            toast.success("New palette generated!");
        } catch (error) {
            toast.error("Failed to generate palette");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (hex: string) => {
        navigator.clipboard.writeText(hex);
        toast.success(`Copied ${hex}`);
    };

    return (
        <div className="space-y-4">
            <ToolPanel>
                <FieldLabel>Describe the vibe or brand</FieldLabel>
                <div className="mt-2 flex gap-2">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && generatePalette()}
                        placeholder="e.g. 'A futuristic cyberpunk city at night' or 'Organic earthy skincare brand'..."
                        className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-foreground/20"
                    />
                    <PrimaryButton onClick={generatePalette} disabled={loading || !prompt.trim()}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        Scout Colors
                    </PrimaryButton>
                </div>

                {palette.length > 0 && (
                    <div className="mt-8">
                        <div className="flex h-48 w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                            {palette.map((color, i) => (
                                <button
                                    key={color.hex + i}
                                    onClick={() => copyToClipboard(color.hex)}
                                    style={{ backgroundColor: color.hex }}
                                    className="group relative flex-1 transition-all hover:flex-[1.5]"
                                >
                                    <div className="absolute inset-x-0 bottom-0 flex flex-col p-3 text-white mix-blend-difference opacity-0 transition-opacity group-hover:opacity-100">
                                        <span className="text-[10px] font-bold uppercase tracking-wider">{color.name}</span>
                                        <span className="font-mono text-sm">{color.hex}</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-5 text-center">
                            {palette.map((color, i) => (
                                <div key={color.hex + i} className="space-y-1">
                                    <div className="mx-auto h-4 w-4 rounded-full border border-border" style={{ backgroundColor: color.hex }} />
                                    <div className="text-[10px] font-semibold uppercase">{color.name}</div>
                                    <div className="font-mono text-[10px] text-muted-foreground">{color.hex}</div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={generatePalette}
                                className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                            >
                                <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
                                Regenerate with same prompt
                            </button>
                        </div>
                    </div>
                )}

                {!palette.length && !loading && (
                    <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
                        <Palette className="h-8 w-8 opacity-10 mb-2" />
                        <p className="text-sm text-muted-foreground">Type a prompt above to start scouting for colors.</p>
                    </div>
                )}
            </ToolPanel>
        </div>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}
