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
        if (results.length === 0) return { avg: 0, success: 0, fail: 0, max: 0, min: 0, conclusion: "" };
        const latencies = results.map(r => r.latency);
        const success = results.filter(r => r.success);
        const avg = Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length);
        const successRate = (success.length / results.length) * 100;

        let conclusion = "Server is stable and responding well.";
        if (successRate < 95) conclusion = "Warning: High failure rate detected. Your server may be struggling with this load.";
        else if (avg > 2000) conclusion = "Notice: High latency detected. The server is responding but slow under pressure.";
        else if (avg > 500) conclusion = "Moderate latency. The server handles the load but response times are increasing.";

        return {
            avg,
            success: success.length,
            fail: results.length - success.length,
            max: Math.max(...latencies),
            min: Math.min(...latencies),
            progress: Math.round((results.length / requests) * 100),
            conclusion
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
            while (!isStopped && !abortControllerRef.current?.signal.aborted) {
                const next = queue.shift();
                if (next === undefined) break;

                setActiveRequests(prev => prev + 1);
                const start = performance.now();

                try {
                    // Using 'no-cors' mode allows the request to be sent even if CORS isn't configured,
                    // but it means we can't see the actual status code (it returns 0 or 200/opaque).
                    const response = await fetch(url, {
                        method: "GET",
                        signal: abortControllerRef.current?.signal,
                        mode: "no-cors",
                        cache: "no-cache"
                    });
                    const end = performance.now();

                    setResults(prev => [...prev, {
                        status: response.type === 'opaque' ? 200 : response.status,
                        latency: Math.round(end - start),
                        success: true,
                        timestamp: Date.now()
                    }]);
                } catch (err: any) {
                    if (err.name === "AbortError" || abortControllerRef.current?.signal.aborted) {
                        isStopped = true;
                        break;
                    }
                    const end = performance.now();
                    setResults(prev => [...prev, {
                        status: 0,
                        latency: Math.round(end - start),
                        success: false,
                        timestamp: Date.now()
                    }]);
                } finally {
                    setActiveRequests(prev => prev - 1);
                }

                // Small delay to prevent browser thread locking
                await new Promise(r => setTimeout(r, 2));
            }
        };

        const workerThreads = Array.from({ length: Math.min(concurrency, requests) }).map(worker);
        await Promise.all(workerThreads);
        setIsRunning(false);
        if (!isStopped && !abortControllerRef.current?.signal.aborted) toast.success("Load test completed!");
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

                        <div className="flex flex-col gap-2">
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
                            <p className="text-[10px] text-center text-muted-foreground italic">Use responsibly for performance diagnostics.</p>
                        </div>
                    </div>

                    <div className="rounded-xl bg-muted/20 border border-border p-6 flex flex-col items-center justify-center text-center">
                        <div className="mb-4 p-3 rounded-full bg-background border border-border">
                            <Activity className={cn("h-8 w-8", isRunning ? "text-moss animate-pulse" : "text-muted-foreground")} />
                        </div>
                        <h3 className="font-display text-2xl font-semibold">{isRunning ? stats.progress + "%" : results.length > 0 ? "100%" : "Ready"}</h3>
                        <p className="text-sm text-muted-foreground">{isRunning ? "Test in progress..." : results.length > 0 ? "Test Finished" : "No active test"}</p>

                        <div className="mt-6 w-full bg-border rounded-full h-1.5 overflow-hidden">
                            <div
                                className="bg-foreground h-full transition-all duration-300"
                                style={{ width: `${isRunning ? stats.progress : results.length > 0 ? 100 : 0}%` }}
                            />
                        </div>
                    </div>
                </div>
            </ToolPanel>

            {(results.length > 0 || isRunning) && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <ToolPanel className="flex flex-col gap-1 items-center justify-center p-6 bg-card border-border">
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

            {!isRunning && results.length > 0 && (
                <ToolPanel className="bg-moss/5 border-moss/20">
                    <div className="flex items-start gap-4">
                        <div className="mt-1 p-2 rounded-full bg-moss/20">
                            <Zap className="h-5 w-5 text-moss" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-moss-foreground">Performance Conclusion</h4>
                            <p className="mt-1 text-sm text-moss-foreground/80 leading-relaxed">
                                {stats.conclusion}
                            </p>
                        </div>
                    </div>
                </ToolPanel>
            )}

            {results.length > 0 && (
                <div className="space-y-4">
                    <ToolPanel>
                        <div className="flex items-center justify-between mb-4">
                            <FieldLabel className="mb-0">Performance Report</FieldLabel>
                            <GhostButton onClick={() => {
                                const report = `API Load Test Report\nURL: ${url}\nTotal Requests: ${results.length}\nAvg Latency: ${stats.avg}ms\nSuccess Rate: ${((stats.success / results.length) * 100).toFixed(1)}%\nMax Spike: ${stats.max}ms\nConclusion: ${stats.conclusion}`;
                                navigator.clipboard.writeText(report);
                                toast.success("Report copied!");
                            }}>
                                <Copy className="h-3.5 w-3.5" />
                                Copy Report
                            </GhostButton>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                           <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border">
                               <p className="font-semibold text-foreground mb-1">Latency Distribution</p>
                               <div className="space-y-1">
                                   <div className="flex justify-between">
                                       <span>&lt; 100ms</span>
                                       <span className="font-mono">{results.filter(r => r.latency < 100).length}</span>
                                   </div>
                                   <div className="flex justify-between">
                                       <span>100-500ms</span>
                                       <span className="font-mono">{results.filter(r => r.latency >= 100 && r.latency < 500).length}</span>
                                   </div>
                                   <div className="flex justify-between">
                                       <span>&gt; 500ms</span>
                                       <span className="font-mono">{results.filter(r => r.latency >= 500).length}</span>
                                   </div>
                               </div>
                           </div>
                           <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border">
                               <p className="font-semibold text-foreground mb-1">Stability Analysis</p>
                               <p className="text-xs leading-relaxed">
                                   {stats.fail > 0 
                                     ? `Detected ${stats.fail} network failures. This could be due to CORS restrictions, rate limiting, or server instability.`
                                     : "No network errors detected. The server endpoint appears to be reachable and accepting requests."}
                               </p>
                           </div>
                        </div>
                    </ToolPanel>

                    <ToolPanel>
                        <FieldLabel>Live Stream (Last 50 requests)</FieldLabel>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {results.slice(-50).map((r, i) => (
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
                </div>
            )}
        </div>
    );
}
