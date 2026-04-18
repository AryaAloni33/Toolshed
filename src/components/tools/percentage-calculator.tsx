import { useState, useEffect } from "react";
import { Percent, ArrowRight } from "lucide-react";
import { ToolPanel, FieldLabel } from "./shared";

export function PercentageCalculator() {
    const [val1, setVal1] = useState("10");
    const [val2, setVal2] = useState("100");
    const [res1, setRes1] = useState("");

    const [val3, setVal3] = useState("20");
    const [val4, setVal4] = useState("50");
    const [res2, setRes2] = useState("");

    useEffect(() => {
        const v1 = parseFloat(val1);
        const v2 = parseFloat(val2);
        if (!isNaN(v1) && !isNaN(v2)) {
            setRes1(((v1 / 100) * v2).toString());
        }
    }, [val1, val2]);

    useEffect(() => {
        const v3 = parseFloat(val3);
        const v4 = parseFloat(val4);
        if (!isNaN(v3) && !isNaN(v4) && v4 !== 0) {
            setRes2(((v3 / v4) * 100).toFixed(2));
        }
    }, [val3, val4]);

    return (
        <div className="space-y-4">
            <ToolPanel>
                <h3 className="text-sm font-semibold mb-6 flex items-center gap-2">
                    <Percent className="h-4 w-4 text-accent" /> Basic Calculations
                </h3>

                <div className="space-y-8">
                    {/* What is X% of Y? */}
                    <div className="grid grid-cols-[1fr,auto,1fr,auto,1fr] items-center gap-4">
                        <div className="space-y-2">
                            <FieldLabel>What is (%)</FieldLabel>
                            <input
                                type="number"
                                value={val1}
                                onChange={(e) => setVal1(e.target.value)}
                                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/30"
                            />
                        </div>
                        <span className="pt-6 font-medium text-muted-foreground uppercase text-[10px]">of</span>
                        <div className="space-y-2">
                            <FieldLabel>Value</FieldLabel>
                            <input
                                type="number"
                                value={val2}
                                onChange={(e) => setVal2(e.target.value)}
                                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/30"
                            />
                        </div>
                        <div className="pt-6">
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <FieldLabel>Result</FieldLabel>
                            <div className="rounded-md border border-border bg-muted/20 px-3 py-2 text-sm font-bold">
                                {res1}
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-border/50" />

                    {/* X is what % of Y? */}
                    <div className="grid grid-cols-[1fr,auto,1fr,auto,1fr] items-center gap-4">
                        <div className="space-y-2">
                            <FieldLabel>Value</FieldLabel>
                            <input
                                type="number"
                                value={val3}
                                onChange={(e) => setVal3(e.target.value)}
                                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/30"
                            />
                        </div>
                        <span className="pt-6 font-medium text-muted-foreground uppercase text-[10px]">is what % of</span>
                        <div className="space-y-2">
                            <FieldLabel>Total</FieldLabel>
                            <input
                                type="number"
                                value={val4}
                                onChange={(e) => setVal4(e.target.value)}
                                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/30"
                            />
                        </div>
                        <div className="pt-6">
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <FieldLabel>Result (%)</FieldLabel>
                            <div className="rounded-md border border-border bg-muted/20 px-3 py-2 text-sm font-bold">
                                {res2}%
                            </div>
                        </div>
                    </div>
                </div>
            </ToolPanel>
        </div>
    );
}
