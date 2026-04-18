import { useState } from "react";
import Papa from "papaparse";
import { Table, Braces, RefreshCw, Copy, Download } from "lucide-react";
import { ToolPanel, FieldLabel, PrimaryButton, GhostButton, CopyButton } from "./shared";
import { toast } from "sonner";
import { saveAs } from "file-saver";

export function CsvJsonConverter() {
    const [input, setInput] = useState("");
    const [mode, setMode] = useState<"csv2json" | "json2csv">("csv2json");
    const [result, setResult] = useState("");

    const convert = () => {
        if (!input.trim()) return;
        try {
            if (mode === "csv2json") {
                const parsed = Papa.parse(input, { header: true, skipEmptyLines: true });
                setResult(JSON.stringify(parsed.data, null, 2));
            } else {
                const json = JSON.parse(input);
                const csv = Papa.unparse(json);
                setResult(csv);
            }
            toast.success("Converted successfully");
        } catch (e) {
            toast.error("Format error. Please check your input.");
        }
    };

    const download = () => {
        const ext = mode === "csv2json" ? "json" : "csv";
        const blob = new Blob([result], { type: mode === "csv2json" ? "application/json" : "text/csv" });
        saveAs(blob, `converted.${ext}`);
    };

    return (
        <div className="space-y-4">
            <ToolPanel>
                <div className="space-y-4">
                    <div className="flex gap-2 p-1 bg-muted rounded-md w-fit">
                        <button
                            onClick={() => setMode("csv2json")}
                            className={cn(
                                "px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-2 transition-colors",
                                mode === "csv2json" ? "bg-background shadow-sm" : "hover:text-foreground/70"
                            )}
                        >
                            <Table className="h-3.5 w-3.5" /> CSV → JSON
                        </button>
                        <button
                            onClick={() => setMode("json2csv")}
                            className={cn(
                                "px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-2 transition-colors",
                                mode === "json2csv" ? "bg-background shadow-sm" : "hover:text-foreground/70"
                            )}
                        >
                            <Braces className="h-3.5 w-3.5" /> JSON → CSV
                        </button>
                    </div>

                    <div>
                        <FieldLabel>Input {mode === "csv2json" ? "CSV" : "JSON"}</FieldLabel>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={mode === "csv2json" ? "Name,Age,City\nJohn,30,NYC" : '[{"Name":"John","Age":30,"City":"NYC"}]'}
                            className="h-40 w-full rounded-md border border-border bg-background p-3 font-mono text-xs outline-none focus:border-foreground/30"
                        />
                    </div>

                    <div className="flex gap-2">
                        <PrimaryButton onClick={convert} className="flex-1">
                            Convert
                        </PrimaryButton>
                        <GhostButton onClick={() => { setInput(""); setResult(""); }}>
                            Clear
                        </GhostButton>
                    </div>
                </div>
            </ToolPanel>

            {result && (
                <ToolPanel className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-bold uppercase text-muted-foreground">Result</h3>
                        <div className="flex gap-2">
                            <CopyButton value={result} />
                            <button
                                onClick={download}
                                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium hover:border-foreground/30"
                            >
                                <Download className="h-3.5 w-3.5" /> Download
                            </button>
                        </div>
                    </div>
                    <pre className="h-64 overflow-auto rounded-md bg-muted/30 p-4 font-mono text-xs leading-relaxed border border-border/50">
                        {result}
                    </pre>
                </ToolPanel>
            )}
        </div>
    );
}

import { cn } from "@/lib/utils";
