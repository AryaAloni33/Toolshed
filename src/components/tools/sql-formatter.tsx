import { useState } from "react";
import { format } from "sql-formatter";
import { Database, Copy, Check, RefreshCw } from "lucide-react";
import { ToolPanel, FieldLabel, PrimaryButton, GhostButton, CopyButton } from "./shared";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SqlFormatter() {
    const [sql, setSql] = useState("");
    const [formatted, setFormatted] = useState("");
    const [dialect, setDialect] = useState<string>("sql");

    const dialects = [
        { id: "sql", label: "Standard SQL" },
        { id: "postgresql", label: "PostgreSQL" },
        { id: "mysql", label: "MySQL" },
        { id: "maridb", label: "MariaDB" },
        { id: "tsql", label: "T-SQL" },
    ];

    const handleFormat = () => {
        if (!sql.trim()) return;
        try {
            const result = format(sql, {
                language: dialect as any,
                keywordCase: "upper",
            });
            setFormatted(result);
            toast.success("SQL formatted");
        } catch (e) {
            toast.error("Formatting failed. Check your SQL syntax.");
        }
    };

    return (
        <div className="space-y-4">
            <ToolPanel>
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {dialects.map((d) => (
                            <button
                                key={d.id}
                                onClick={() => setDialect(d.id)}
                                className={cn(
                                    "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                                    dialect === d.id ? "bg-foreground text-background shadow-sm" : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                )}
                            >
                                {d.label}
                            </button>
                        ))}
                    </div>

                    <div>
                        <FieldLabel>SQL Query</FieldLabel>
                        <textarea
                            value={sql}
                            onChange={(e) => setSql(e.target.value)}
                            placeholder="SELECT * FROM users WHERE status = 'active'..."
                            className="h-48 w-full rounded-md border border-border bg-background p-4 font-mono text-sm outline-none focus:border-foreground/30"
                        />
                    </div>

                    <div className="flex gap-2">
                        <PrimaryButton onClick={handleFormat} className="flex-1">
                            <RefreshCw className="mr-2 h-4 w-4" /> Format SQL
                        </PrimaryButton>
                        <GhostButton onClick={() => { setSql(""); setFormatted(""); }}>
                            Clear
                        </GhostButton>
                    </div>
                </div>
            </ToolPanel>

            {formatted && (
                <ToolPanel className="bg-muted/10">
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h3 className="text-[10px] font-bold uppercase text-muted-foreground">Formatted Result</h3>
                        <CopyButton value={formatted} />
                    </div>
                    <pre className="max-h-[500px] overflow-auto rounded-md border border-border/50 bg-background/50 p-4 font-mono text-sm leading-relaxed text-foreground">
                        {formatted}
                    </pre>
                </ToolPanel>
            )}
        </div>
    );
}
