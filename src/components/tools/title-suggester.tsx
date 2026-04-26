import { useState } from "react";
import { Sparkles, Loader2, Brain } from "lucide-react";
import { CopyButton, ToolPanel, PrimaryButton, FieldLabel } from "./shared";
import { toast } from "sonner";

export function TitleSuggester() {
    const [description, setDescription] = useState("");
    const [titles, setTitles] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const generateTitles = async () => {
        if (!description.trim()) {
            toast.error("Please describe your project first");
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
                                    "You are a creative branding expert. Based on the user's project description, suggest 10 catchy, professional, and memorable titles. Return ONLY a JSON array of strings, no other text.",
                            },
                            {
                                role: "user",
                                content: `Project description: ${description}`,
                            },
                        ],
                        temperature: 0.8,
                    }),
                },
            );

            const data = await response.json();
            const content = data.choices[0].message.content.trim();
            const match = content.match(/\[.*\]/s);
            if (match) {
                setTitles(JSON.parse(match[0]));
            } else {
                // Fallback for simple list
                setTitles(content.split("\n").map((s: string) => s.replace(/^\d+\.\s*/, "").trim()).filter(Boolean));
            }
            toast.success("Titles generated!");
        } catch (error) {
            console.error(error);
            toast.error("Generation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <ToolPanel>
                <FieldLabel>Project Description</FieldLabel>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block min-h-[150px] w-full resize-y rounded-md border border-border bg-background p-3 text-sm outline-none focus:border-foreground/30"
                    placeholder="Describe what you're building, its purpose, and target audience..."
                />
                <div className="mt-4 flex justify-end">
                    <PrimaryButton onClick={generateTitles} disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        Suggest Titles
                    </PrimaryButton>
                </div>
            </ToolPanel>

            {titles.length > 0 && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {titles.map((title, i) => (
                        <ToolPanel key={i} className="flex items-center justify-between p-4">
                            <span className="font-medium text-foreground">{title}</span>
                            <CopyButton value={title} />
                        </ToolPanel>
                    ))}
                </div>
            )}
        </div>
    );
}
