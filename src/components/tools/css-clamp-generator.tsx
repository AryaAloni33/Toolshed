import { useState, useMemo } from "react";
import { Type, Copy, Check } from "lucide-react";
import { ToolPanel, FieldLabel } from "./shared";
import { toast } from "sonner";

export function CssClampGenerator() {
    const [minSize, setMinSize] = useState(1); // rem
    const [maxSize, setMaxSize] = useState(3); // rem
    const [minViewport, setMinViewport] = useState(320); // px
    const [maxViewport, setMaxViewport] = useState(1280); // px
    const [copied, setCopied] = useState(false);

    const clampValue = useMemo(() => {
        const minWidthRem = minViewport / 16;
        const maxWidthRem = maxViewport / 16;

        const slope = (maxSize - minSize) / (maxWidthRem - minWidthRem);
        const intercept = minSize - slope * minWidthRem;

        const preferredValue = `${intercept.toFixed(4)}rem + ${(slope * 100).toFixed(4)}vw`;
        return `clamp(${minSize}rem, ${preferredValue}, ${maxSize}rem)`;
    }, [minSize, maxSize, minViewport, maxViewport]);

    const handleCopy = () => {
        navigator.clipboard.writeText(`font-size: ${clampValue};`);
        setCopied(true);
        toast.success("CSS copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
                <ToolPanel className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <FieldLabel>Min Size (rem)</FieldLabel>
                            <input
                                type="number"
                                step="0.1"
                                value={minSize}
                                onChange={(e) => setMinSize(parseFloat(e.target.value))}
                                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/20"
                            />
                        </div>
                        <div>
                            <FieldLabel>Max Size (rem)</FieldLabel>
                            <input
                                type="number"
                                step="0.1"
                                value={maxSize}
                                onChange={(e) => setMaxSize(parseFloat(e.target.value))}
                                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/20"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <FieldLabel>Min Viewport (px)</FieldLabel>
                            <input
                                type="number"
                                value={minViewport}
                                onChange={(e) => setMinViewport(parseInt(e.target.value))}
                                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/20"
                            />
                        </div>
                        <div>
                            <FieldLabel>Max Viewport (px)</FieldLabel>
                            <input
                                type="number"
                                value={maxViewport}
                                onChange={(e) => setMaxViewport(parseInt(e.target.value))}
                                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/20"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                        <div className="flex items-center justify-between mb-3">
                            <FieldLabel>Generated CSS</FieldLabel>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                            >
                                {copied ? <Check className="h-3.5 w-3.5 text-moss" /> : <Copy className="h-3.5 w-3.5" />}
                                Copy
                            </button>
                        </div>
                        <div className="rounded-lg bg-background p-4 border border-border font-mono text-xs leading-relaxed text-rust">
                            {`font-size: ${clampValue};`}
                        </div>
                    </div>
                </ToolPanel>

                <div className="flex flex-col rounded-2xl border border-border bg-muted/20 p-8 min-h-[400px]">
                    <FieldLabel className="mb-4">Fluid Typography Preview</FieldLabel>
                    <div className="flex-1 flex flex-col justify-center gap-8 overflow-hidden">
                        <div
                            className="font-display font-semibold transition-all duration-300"
                            style={{ fontSize: clampValue }}
                        >
                            Fluid Heading
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                            Resize the viewport or change the values to see the heading scale smoothly
                            between {minSize}rem and {maxSize}rem based on the container width.
                        </p>
                    </div>
                    <div className="mt-8 h-1 w-full bg-border rounded-full overflow-hidden relative">
                        <div className="absolute inset-y-0 left-0 bg-rust transition-all" style={{ width: '60%' }} />
                    </div>
                    <div className="mt-2 flex justify-between text-[10px] text-muted-foreground uppercase font-mono tracking-widest">
                        <span>{minViewport}px</span>
                        <span>Current Scale</span>
                        <span>{maxViewport}px</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
