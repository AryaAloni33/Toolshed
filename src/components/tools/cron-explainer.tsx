import { useState } from "react";
import cronstrue from "cronstrue";
import { Clock, HelpCircle } from "lucide-react";
import { ToolPanel, FieldLabel, CopyButton } from "./shared";
import { cn } from "@/lib/utils";

export function CronExplainer() {
    const [cron, setCron] = useState("* * * * *");

    let explanation = "";
    let error = "";
    try {
        if (cron.trim()) {
            explanation = cronstrue.toString(cron);
        }
    } catch (err: any) {
        error = err.toString();
    }

    const commonCrons = [
        { label: "Every minute", value: "* * * * *" },
        { label: "Every hour", value: "0 * * * *" },
        { label: "Every day at midnight", value: "0 0 * * *" },
        { label: "Every Monday at 9am", value: "0 9 * * 1" },
        { label: "Every 15 minutes", value: "*/15 * * * *" },
    ];

    return (
        <div className="space-y-6">
            <ToolPanel>
                <div className="space-y-4">
                    <div>
                        <FieldLabel>Cron Expression</FieldLabel>
                        <input
                            type="text"
                            value={cron}
                            onChange={(e) => setCron(e.target.value)}
                            placeholder="* * * * *"
                            className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-lg outline-none focus:border-foreground/30"
                        />
                    </div>

                    <div className="rounded-lg border border-border bg-muted/20 p-6 text-center">
                        {error ? (
                            <div className="text-destructive font-medium">{error.replace("Error: ", "")}</div>
                        ) : explanation ? (
                            <div className="font-display text-2xl font-medium text-foreground">
                                "{explanation}"
                            </div>
                        ) : (
                            <div className="text-muted-foreground">Type a cron expression to see its meaning</div>
                        )}
                    </div>
                </div>
            </ToolPanel>

            <ToolPanel>
                <div className="grid gap-2 sm:grid-cols-2">
                    {commonCrons.map((c) => (
                        <div
                            key={c.value}
                            onClick={() => setCron(c.value)}
                            className="flex cursor-pointer items-center justify-between rounded-lg border border-border p-3 transition-colors hover:border-foreground/30 hover:bg-muted/10"
                        >
                            <span className="text-sm font-medium">{c.label}</span>
                            <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">{c.value}</span>
                        </div>
                    ))}
                </div>
            </ToolPanel>
        </div>
    );
}
