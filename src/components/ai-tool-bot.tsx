import { useState } from "react";
import { Sparkles, Loader2, ArrowRight, X } from "lucide-react";
import { tools } from "@/lib/tools";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

interface SuggestedTool {
    slug: string;
    name: string;
    reason: string;
}

export function AiToolBot() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<SuggestedTool[]>([]);
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!query.trim() || loading) return;

        setLoading(true);
        setSuggestions([]);

        try {
            const toolList = tools.map(t => ({
                slug: t.slug,
                name: t.name,
                description: t.description
            }));

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
                            content: `You are an expert navigator for "Toolshed", a utility tool website.
              Given a user's request, identify the top 3 most relevant tools from the list provided.
              
              Available Tools:
              ${JSON.stringify(toolList)}
              
              Return ONLY a JSON object with this exact structure:
              {"suggestions": [{"slug": "tool-slug", "reason": "short explanation of why this tool helps"}]}
              If no tool fits, return {"suggestions": []}.`
                        },
                        {
                            role: "user",
                            content: query
                        }
                    ],
                    response_format: { type: "json_object" }
                })
            });

            const data = await response.json();
            const content = JSON.parse(data.choices[0].message.content);
            const rawSuggestions = content.suggestions || [];

            const enriched = rawSuggestions
                .map((s: any) => {
                    const tool = tools.find(t => t.slug === s.slug);
                    if (!tool) return null;
                    return { ...s, name: tool.name };
                })
                .filter(Boolean);

            setSuggestions(enriched);
        } catch (error) {
            console.error("AI Search Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-xl transition-all hover:border-foreground/20">
            <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-4 py-3">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-foreground text-background">
                    <Sparkles className="h-4 w-4" />
                </div>
                <div>
                    <div className="text-sm font-semibold">AI Tool Scout</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">beta</div>
                </div>
                {suggestions.length > 0 && (
                    <button
                        onClick={() => { setSuggestions([]); setQuery(""); }}
                        className="ml-auto rounded-md p-1 hover:bg-muted"
                    >
                        <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                )}
            </div>

            <div className="p-4">
                <p className="mb-3 text-xs text-muted-foreground">
                    Describe what you need to do in plain English, and I'll find the right tool for the job.
                </p>

                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        placeholder="e.g. 'I need to resize a batch of photos for my website'..."
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-foreground/30 pr-12"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={loading || !query.trim()}
                        className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-lg bg-foreground text-background transition-opacity disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                    </button>
                </div>

                {suggestions.length > 0 && (
                    <div className="mt-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">I found these for you:</div>
                        {suggestions.map((s) => (
                            <button
                                key={s.slug}
                                onClick={() => navigate({ to: "/t/$slug", params: { slug: s.slug } })}
                                className="flex w-full items-start gap-3 rounded-xl border border-border bg-background p-3 text-left transition-all hover:border-foreground/30 hover:shadow-sm group"
                            >
                                <div className="mt-0.5 flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold group-hover:text-foreground transition-colors">{s.name}</span>
                                        <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                                    </div>
                                    <div className="text-xs text-muted-foreground italic leading-relaxed">"{s.reason}"</div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
