import { useState, useRef, useMemo } from "react";
import { Activity, Play, Square, Loader2, CheckCircle2, XCircle, Clock, Zap } from "lucide-react";
import { ToolPanel, PrimaryButton, GhostButton, FieldLabel } from "./shared";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TestResult {
    status: number;
    latency: number;
    success: boolean;
    timestamp: number;
}

export function ApiLoadTester() {
    const [url, setUrl] = useState("");
    const [requests, setRequests] = useState(50);
    const [concurrency, setConcurrency] = useState(5);
    const [isRunning, setIsRunning] = useState(false);
    const [results, setResults] = useState<TestResult[]>([]);
    const [activeRequests, setActiveRequests] = useState(0);
    const abortControllerRef = useRef<AbortController | null>(null);

    const stats = useMemo(() => {
        if (results.length === 0) return { avg: 0, success: 0, fail: 0, max: 0, min: 0 };
        const latencies = results.map(r => r.latency);
        const success = results.filter(r => r.success);
        return {
            avg: Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length),
            success: success.length,
            fail: results.length - success.length,
            max: Math.max(...latencies),
            min: Math.min(...latencies),
            progress: Math.round((results.length / requests) * 100)
        };
    }, [results, requests]);

    const runTest = async () => {
        if (!url || !url.startsWith("http")) {
            toast.error("Please enter a valid HTTP(S) URL");
            return;
        }

        setIsRunning(true);
        setResults([]);
        abortControllerRef.current = new AbortController();

        const queue = Array.from({ length: requests });
        let isStopped = false;

        const worker = async () => {
            while (queue.length > 0 && !isStopped) {
                queue.shift(); // Get next item

                setActiveRequests(prev => prev + 1);
                const start = performance.now();

                try {
                    // Using 'no-cors' mode ensures the request still hits the server
                    // even if Cross-Origin headers aren't set, which is common during stress tests.
                    await fetch(url, {
                        method: "GET",
                        signal: abortControllerRef.current?.signal,
                        mode: "no-cors",
                        cache: "no-cache"
                    });
                    const end = performance.now();

                    setResults(prev => [...prev.slice(-49), {
                        status: 200, // We assume success if it doesn't throw a network error
                        latency: Math.round(end - start),
                        success: true,
                        timestamp: Date.now()
                    }]);
                } catch (err: any) {
                    if (err.name === "AbortError") {
                        isStopped = true;
                        break;
                    }
                    const end = performance.now();
                    setResults(prev => [...prev.slice(-49), {
                        status: 0,
                        latency: Math.round(end - start),
                        success: false,
                        timestamp: Date.now()
                    }]);
                } finally {
                    setActiveRequests(prev => prev - 1);
                }

                // Small delay to prevent browser thread locking for UI updates
                await new Promise(r => setTimeout(r, 10));
            }
        };

        const workerThreads = Array.from({ length: Math.min(concurrency, requests) }).map(worker);
        await Promise.all(workerThreads);
        setIsRunning(false);
        if (!isStopped) toast.success("Load test completed!");
    };

    const stopTest = () => {
        abortControllerRef.current?.abort();
        setIsRunning(false);
        toast.info("Test stopped");
    };

    return (
        <div className="space-y-4">
            <ToolPanel>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <div>
                            <FieldLabel>Target Endpoint (URL)</FieldLabel>
                            <div className="relative">
                                <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://api.example.com/health"
                                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-foreground/20"
                                />
                            </div>
                            <p className="mt-1.5 text-[10px] text-muted-foreground italic">Note: Browser requests are subject to CORS. We use 'no-cors' to ensure the hit reaches the server.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <FieldLabel>Total Requests</FieldLabel>
                                <input
                                    type="number"
                                    value={requests}
                                    onChange={(e) => setRequests(Math.min(5000, Math.max(1, parseInt(e.target.value) || 0)))}
                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:border-foreground/20"
                                />
                            </div>
                            <div>
                                <FieldLabel>Active Bots</FieldLabel>
                                <input
                                    type="number"
                                    value={concurrency}
                                    onChange={(e) => setConcurrency(Math.min(50, Math.max(1, parseInt(e.target.value) || 0)))}
                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:border-foreground/20"
                                />
                            </div>
                        </div>

                        <div className="pt-2 text-[10px] text-muted-foreground bg-muted/30 p-2.5 rounded border border-border/50 leading-normal">
                            <strong>Warning:</strong> High bot counts (20+) may cause browser lag. Use responsibly on systems you own.
                        </div>

                        <div className="pt-2">
                            {!isRunning ? (
                                <PrimaryButton onClick={runTest} className="w-full py-6">
                                    <Play className="h-4 w-4" />
                                    Launch Stress Test
                                </PrimaryButton>
                            ) : (
                                <PrimaryButton onClick={stopTest} className="w-full py-6 bg-rust hover:bg-rust/90">
                                    <Square className="h-4 w-4" />
                                    Emergency Stop
                                </PrimaryButton>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl bg-muted/20 border border-border p-6 flex flex-col items-center justify-center text-center">
                        <div className="mb-4 p-3 rounded-full bg-background border border-border">
                            <Activity className={cn("h-8 w-8", isRunning ? "text-moss animate-pulse" : "text-muted-foreground")} />
                        </div>
                        <h3 className="font-display text-2xl font-semibold">{isRunning ? stats.progress + "%" : "Ready"}</h3>
                        <p className="text-sm text-muted-foreground">{isRunning ? "Test in progress..." : "No active test"}</p>

                        <div className="mt-6 w-full bg-border rounded-full h-1.5 overflow-hidden">
                            <div
                                className="bg-foreground h-full transition-all duration-300"
                                style={{ width: `${isRunning ? stats.progress : 0}%` }}
                            />
                        </div>
                    </div>
                </div>
            </ToolPanel>

            {(results.length > 0 || isRunning) && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <ToolPanel className="flex flex-col gap-1 items-center justify-center p-6">
                        <FieldLabel className="mb-0">Avg Latency</FieldLabel>
                        <div className="text-2xl font-mono flex items-center gap-2">
                            <Clock className="h-4 w-4 opacity-40" />
                            {stats.avg}ms
                        </div>
                    </ToolPanel>
                    <ToolPanel className="flex flex-col gap-1 items-center justify-center p-6 text-moss">
                        <FieldLabel className="mb-0 text-moss/70">Successful</FieldLabel>
                        <div className="text-2xl font-mono flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 opacity-40" />
                            {stats.success}
                        </div>
                    </ToolPanel>
                    <ToolPanel className="flex flex-col gap-1 items-center justify-center p-6 text-rust">
                        <FieldLabel className="mb-0 text-rust/70">Failed</FieldLabel>
                        <div className="text-2xl font-mono flex items-center gap-2">
                            <XCircle className="h-4 w-4 opacity-40" />
                            {stats.fail}
                        </div>
                    </ToolPanel>
                    <ToolPanel className="flex flex-col gap-1 items-center justify-center p-6">
                        <FieldLabel className="mb-0">Max Spike</FieldLabel>
                        <div className="text-2xl font-mono">
                            {stats.max}ms
                        </div>
                    </ToolPanel>
                </div>
            )}

            {results.length > 0 && (
                <ToolPanel>
                    <FieldLabel>Real-time Response Stream</FieldLabel>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {results.map((r, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "h-6 min-w-[40px] px-2 rounded flex items-center justify-center text-[10px] font-mono",
                                    r.success ? "bg-moss/10 text-moss border border-moss/20" : "bg-rust/10 text-rust border border-rust/20"
                                )}
                                title={`Latency: ${r.latency}ms`}
                            >
                                {r.latency}ms
                            </div>
                        ))}
                        {isRunning && (
                            <div className="flex items-center gap-2 px-3 h-6 rounded bg-background border border-border animate-pulse">
                                <Loader2 className="h-2.5 w-2.5 animate-spin" />
                                <span className="text-[10px] font-mono uppercase">Batch Processing</span>
                            </div>
                        )}
                    </div>
                </ToolPanel>
            )}
        </div>
    );
}
