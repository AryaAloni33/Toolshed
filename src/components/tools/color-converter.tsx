import { useState, useMemo } from "react";
import { Palette } from "lucide-react";
import { colord, extend } from "colord";
import cmykPlugin from "colord/plugins/cmyk";
import hwbPlugin from "colord/plugins/hwb";
import lchPlugin from "colord/plugins/lch";
import namesPlugin from "colord/plugins/names";
extend([cmykPlugin, hwbPlugin, lchPlugin, namesPlugin]);

import { ToolPanel, FieldLabel, CopyButton } from "./shared";

export function ColorConverter() {
    const [input, setInput] = useState("#ff5733");

    const color = useMemo(() => {
        const parsed = colord(input);
        return parsed.isValid() ? parsed : null;
    }, [input]);

    const formats = useMemo(() => {
        if (!color) return [];
        return [
            { label: "HEX", value: color.toHex() },
            { label: "RGB", value: color.toRgbString() },
            { label: "HSL", value: color.toHslString() },
            { label: "HWB", value: color.toHwbString() },
            { label: "LCH", value: color.toLchString() },
            { label: "CMYK", value: color.toCmykString() },
            { label: "CSS Name", value: color.toName({ closest: true }) || "Unknown" }
        ];
    }, [color]);

    return (
        <div className="space-y-6">
            <ToolPanel>
                <div className="space-y-6">
                    <div>
                        <FieldLabel>Color Input</FieldLabel>
                        <div className="flex items-center gap-3">
                            <label
                                className="relative block h-[42px] w-16 shrink-0 cursor-pointer overflow-hidden rounded-md border border-border focus-within:ring-2 focus-within:ring-ring"
                                title="Pick a color"
                            >
                                <input
                                    type="color"
                                    value={color ? color.toHex() : "#000000"}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="absolute -inset-4 h-[200%] w-[200%] cursor-pointer border-0 bg-transparent p-0"
                                />
                            </label>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Hex, RGB, HSL, or color name..."
                                className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-foreground/30"
                            />
                        </div>
                    </div>

                    {color ? (
                        <div className="grid gap-6 sm:grid-cols-[120px_1fr]">
                            <div className="space-y-3">
                                <FieldLabel>Preview</FieldLabel>
                                <div
                                    className="h-24 w-full rounded-xl border border-border shadow-sm sm:h-full"
                                    style={{ backgroundColor: color.toHex() }}
                                />
                            </div>

                            <div className="space-y-3">
                                <FieldLabel>Formats</FieldLabel>
                                <div className="grid gap-2">
                                    {formats.map((f) => (
                                        <div key={f.label} className="relative flex items-center justify-between overflow-hidden rounded-md border border-border bg-muted/10 px-3 py-2">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground w-16 shrink-0">
                                                {f.label}
                                            </span>
                                            <span className="font-mono text-sm text-foreground mr-auto pl-2 truncate break-all">
                                                {f.value}
                                            </span>
                                            <CopyButton value={f.value} label="Copy" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
                            Please enter a valid CSS color format.
                        </div>
                    )}
                </div>
            </ToolPanel>
        </div>
    );
}
