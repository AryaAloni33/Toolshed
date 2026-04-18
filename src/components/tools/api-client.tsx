import { useState } from "react";
import { Send, Brain, Loader2, Plus, Trash2 } from "lucide-react";
import { CopyButton, ToolPanel, PrimaryButton, FieldLabel, GhostButton } from "./shared";
import { toast } from "sonner";

export function ApiClient() {
    const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/posts/1");
    const [method, setMethod] = useState("GET");
    const [headers, setHeaders] = useState([
        { key: "Content-Type", value: "application/json" },
    ]);
    const [body, setBody] = useState("");
    const [response, setResponse] = useState<{ status: number; statusText: string; data: string; time: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [aiExplanation, setAiExplanation] = useState("");
    const [aiLoading, setAiLoading] = useState(false);

    const handleSend = async () => {
        if (!url) {
            toast.error("Please enter a URL");
            return;
        }
        setLoading(true);
        setResponse(null);
        setAiExplanation("");

        try {
            const start = Date.now();
            const headersObj: Record<string, string> = {};
            headers.forEach((h) => {
                if (h.key.trim()) headersObj[h.key.trim()] = h.value;
            });

            const options: RequestInit = {
                method,
                headers: headersObj,
            };

            if (method !== "GET" && method !== "HEAD" && body) {
                options.body = body;
            }

            const res = await fetch(url, options);
            const time = Date.now() - start;
            const text = await res.text();
            let formatted = text;
            try {
                formatted = JSON.stringify(JSON.parse(text), null, 2);
            } catch (e) {
                // Not JSON
            }

            setResponse({
                status: res.status,
                statusText: res.statusText,
                data: formatted,
                time,
            });
            toast.success("Request completed");
        } catch (err: any) {
            toast.error(err.message || "Failed to fetch");
        } finally {
            setLoading(false);
        }
    };

    const handleAiExplain = async () => {
        if (!response) return;
        setAiLoading(true);
        try {
            const aiResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
                            content: "You are an expert developer assistant. Explain the following API response in plain English. Summarize what the data is, highlight any errors if the status code is bad, and briefly describe the structure.",
                        },
                        {
                            role: "user",
                            content: `Status: ${response.status} ${response.statusText}\n\nBody: ${response.data.substring(0, 1500)}`, // Limit to prevent massive token usage
                        },
                    ],
                    temperature: 0.5,
                    max_tokens: 1024,
                }),
            });

            if (!aiResponse.ok) {
                throw new Error("Failed to fetch from AI");
            }

            const data = await aiResponse.json();
            setAiExplanation(data.choices[0].message.content);
            toast.success("AI Analysis complete");
        } catch (error: any) {
            toast.error(error.message || "AI Explanation failed. Check API key.");
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <ToolPanel>
                <div className="flex flex-col gap-4">
                    <div className="flex items-end gap-2">
                        <div className="w-32">
                            <FieldLabel>Method</FieldLabel>
                            <select
                                value={method}
                                onChange={(e) => setMethod(e.target.value)}
                                className="w-full h-[40px] rounded-md border border-border bg-background px-3 font-sans text-sm focus:border-foreground/30 focus:outline-none"
                            >
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                                <option value="PUT">PUT</option>
                                <option value="PATCH">PATCH</option>
                                <option value="DELETE">DELETE</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <FieldLabel>URL</FieldLabel>
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://api.example.com/v1/users"
                                className="w-full h-[40px] rounded-md border border-border bg-background px-3 font-mono text-sm focus:border-foreground/30 focus:outline-none"
                            />
                        </div>
                        <PrimaryButton onClick={handleSend} disabled={loading} className="h-[40px]">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                            Send
                        </PrimaryButton>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <FieldLabel>Headers (Optional)</FieldLabel>
                            <button
                                onClick={() => setHeaders([...headers, { key: "", value: "" }])}
                                className="text-xs text-muted-foreground hover:text-foreground flex items-center"
                            >
                                <Plus className="h-3 w-3 mr-1" /> Add Header
                            </button>
                        </div>
                        <div className="space-y-2">
                            {headers.map((h, i) => (
                                <div key={i} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Key (e.g. Authorization)"
                                        value={h.key}
                                        onChange={(e) => {
                                            const newH = [...headers];
                                            newH[i].key = e.target.value;
                                            setHeaders(newH);
                                        }}
                                        className="flex-1 h-9 rounded-md border border-border bg-background px-3 font-mono text-sm focus:border-foreground/30 focus:outline-none"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Value"
                                        value={h.value}
                                        onChange={(e) => {
                                            const newH = [...headers];
                                            newH[i].value = e.target.value;
                                            setHeaders(newH);
                                        }}
                                        className="flex-1 h-9 rounded-md border border-border bg-background px-3 font-mono text-sm focus:border-foreground/30 focus:outline-none"
                                    />
                                    <button
                                        onClick={() => {
                                            const newH = [...headers];
                                            newH.splice(i, 1);
                                            setHeaders(newH);
                                        }}
                                        className="text-muted-foreground hover:text-red-500 w-8 flex justify-center items-center rounded-md border border-border"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {["POST", "PUT", "PATCH"].includes(method) && (
                        <div>
                            <FieldLabel>Request Body</FieldLabel>
                            <textarea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder='{"foo": "bar"}'
                                className="w-full h-32 rounded-md border border-border bg-background p-3 font-mono text-sm focus:border-foreground/30 focus:outline-none resize-y"
                            />
                        </div>
                    )}
                </div>
            </ToolPanel>

            {response && (
                <ToolPanel>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-4 items-center">
                            <div className={`px-2 py-1 rounded-md text-xs font-bold border ${response.status >= 200 && response.status < 300 ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                {response.status} {response.statusText}
                            </div>
                            <div className="text-xs text-muted-foreground bg-border/40 px-2 py-1 rounded-md">
                                {response.time}ms
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <GhostButton onClick={handleAiExplain} disabled={aiLoading} className="text-purple-400 hover:text-purple-300 border-purple-500/30">
                                {aiLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Brain className="h-4 w-4 mr-2" />}
                                Ask AI to Explain
                            </GhostButton>
                            <CopyButton value={response.data} />
                        </div>
                    </div>

                    <div className="relative">
                        <pre className="w-full overflow-auto max-h-[400px] rounded-md bg-zinc-950 p-4 font-mono text-xs text-zinc-100">
                            {response.data}
                        </pre>
                    </div>
                </ToolPanel>
            )}

            {aiExplanation && (
                <ToolPanel>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-500/20">
                            <Brain className="h-4 w-4 text-purple-400" />
                        </div>
                        <span className="font-medium text-sm text-foreground">AI Analysis</span>
                    </div>
                    <div className="rounded-md border border-purple-500/20 bg-purple-500/5 p-4 font-sans text-sm whitespace-pre-wrap leading-relaxed text-foreground/90">
                        {aiExplanation}
                    </div>
                </ToolPanel>
            )}
        </div>
    );
}
