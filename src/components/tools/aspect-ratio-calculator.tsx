import { useState, useEffect } from "react";
import { Crop, RefreshCw, Link as LinkIcon, Unlink } from "lucide-react";
import { ToolPanel, FieldLabel } from "./shared";

export function AspectRatioCalculator() {
    const [width1, setWidth1] = useState(1920);
    const [height1, setHeight1] = useState(1080);
    const [width2, setWidth2] = useState(1280);
    const [height2, setHeight2] = useState(720);
    const [ratio, setRatio] = useState("16:9");
    const [locked, setLocked] = useState(true);

    // Greatest Common Divisor
    const gcd = (a: number, b: number): number => {
        return b === 0 ? a : gcd(b, a % b);
    };

    useEffect(() => {
        const common = gcd(width1, height1);
        setRatio(`${width1 / common}:${height1 / common}`);
    }, [width1, height1]);

    const handleWidth2Change = (val: number) => {
        setWidth2(val);
        if (locked) {
            setHeight2(Math.round(val / (width1 / height1)));
        }
    };

    const handleHeight2Change = (val: number) => {
        setHeight2(val);
        if (locked) {
            setWidth2(Math.round(val * (width1 / height1)));
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
                <ToolPanel className="space-y-8">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <FieldLabel>Base Dimensions & Ratio</FieldLabel>
                            <div className="rounded-full bg-muted px-3 py-1 font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                Ratio: {ratio}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <span className="text-[10px] font-semibold uppercase text-muted-foreground tracking-tight">Width</span>
                                <input
                                    type="number"
                                    value={width1}
                                    onChange={(e) => setWidth1(parseInt(e.target.value) || 0)}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/20"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <span className="text-[10px] font-semibold uppercase text-muted-foreground tracking-tight">Height</span>
                                <input
                                    type="number"
                                    value={height1}
                                    onChange={(e) => setHeight1(parseInt(e.target.value) || 0)}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/20"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                            <button
                                onClick={() => setLocked(!locked)}
                                className={`grid h-8 w-8 place-items-center rounded-full border border-border bg-card transition-colors ${locked ? 'text-foreground' : 'text-muted-foreground'}`}
                            >
                                {locked ? <LinkIcon className="h-3.5 w-3.5" /> : <Unlink className="h-3.5 w-3.5 opacity-40 text-rust" />}
                            </button>
                        </div>
                        <div className="border-t border-border pt-8">
                            <div className="flex items-center justify-between mb-4">
                                <FieldLabel>Target Dimensions</FieldLabel>
                                {locked && <span className="text-[10px] text-muted-foreground italic">Proportions locked</span>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-semibold uppercase text-muted-foreground">Width</span>
                                    <input
                                        type="number"
                                        value={width2}
                                        onChange={(e) => handleWidth2Change(parseInt(e.target.value) || 0)}
                                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/20"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-semibold uppercase text-muted-foreground">Height</span>
                                    <input
                                        type="number"
                                        value={height2}
                                        onChange={(e) => handleHeight2Change(parseInt(e.target.value) || 0)}
                                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/20"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </ToolPanel>

                <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-muted/20 p-8 min-h-[400px]">
                    <div
                        className="relative border-2 border-dashed border-foreground/10 bg-background/50 flex items-center justify-center transition-all duration-500"
                        style={{
                            aspectRatio: `${width1}/${height1}`,
                            maxWidth: '100%',
                            maxHeight: '100%',
                            width: '300px'
                        }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                            <Crop className="h-12 w-12 text-muted-foreground opacity-5" />
                        </div>
                        <span className="font-mono text-xs font-bold text-muted-foreground">{ratio}</span>
                    </div>
                    <div className="mt-8 text-center space-y-1">
                        <div className="text-sm font-semibold">Visual Representation</div>
                        <p className="text-xs text-muted-foreground">Scaling {width1}x{height1} to {width2}x{height2}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
