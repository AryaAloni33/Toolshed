import { useState, useMemo } from "react";
import { Layers, Copy, Check } from "lucide-react";
import { ToolPanel, FieldLabel } from "./shared";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ShadowGenerator() {
    const [layers, setLayers] = useState(5);
    const [alpha, setAlpha] = useState(0.08);
    const [blur, setBlur] = useState(40);
    const [spread, setSpread] = useState(0);
    const [copied, setCopied] = useState(false);

    const shadowString = useMemo(() => {
        const shadows = [];
        for (let i = 1; i <= layers; i++) {
            const weight = i / layers;
            const currentBlur = Math.round(blur * Math.pow(weight, 2));
            const currentAlpha = (alpha / layers).toFixed(3);
            const y = Math.round(weight * 10);
            shadows.push(`0 ${y}px ${currentBlur}px rgba(0, 0, 0, ${currentAlpha})`);
        }
        return shadows.join(",\n  ");
    }, [layers, alpha, blur, spread]);

    const handleCopy = () => {
        navigator.clipboard.writeText(`box-shadow: ${shadowString};`);
        setCopied(true);
        toast.success("CSS copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
                <ToolPanel className="space-y-6">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <FieldLabel>Number of Layers</FieldLabel>
                            <span className="text-xs font-mono">{layers}</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={layers}
                            onChange={(e) => setLayers(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <FieldLabel>Transparency (Alpha)</FieldLabel>
                            <span className="text-xs font-mono">{alpha.toFixed(2)}</span>
                        </div>
                        <input
                            type="range"
                            min="0.01"
                            max="0.5"
                            step="0.01"
                            value={alpha}
                            onChange={(e) => setAlpha(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <FieldLabel>Max Blur Radius</FieldLabel>
                            <span className="text-xs font-mono">{blur}px</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="200"
                            value={blur}
                            onChange={(e) => setBlur(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
                        />
                    </div>

                    <div className="pt-4 border-t border-border">
                        <div className="flex items-center justify-between mb-3">
                            <FieldLabel>Generated CSS</FieldLabel>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                            >
                                {copied ? <Check className="h-3.5 w-3.5 text-moss" /> : <Copy className="h-3.5 w-3.5" />}
                                {copied ? "Copied" : "Copy Style"}
                            </button>
                        </div>
                        <div className="rounded-lg bg-background p-3 border border-border font-mono text-[10px] leading-relaxed overflow-x-auto whitespace-pre">
                            {`box-shadow: \n  ${shadowString};`}
                        </div>
                    </div>
                </ToolPanel>

                <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-muted/20 p-12 min-h-[400px]">
                    <div
                        className="w-48 h-48 rounded-3xl bg-white border border-border flex items-center justify-center transition-all duration-300"
                        style={{ boxShadow: shadowString }}
                    >
                        <Layers className="h-10 w-10 text-slate-400" strokeWidth={1} />
                    </div>
                    <p className="mt-12 text-sm text-muted-foreground">Preview of layered shadow effect</p>
                </div>
            </div>
        </div>
    );
}
