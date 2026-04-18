import { useState, useEffect } from "react";
import { Search, Info, Check, X } from "lucide-react";
import { ToolPanel, FieldLabel } from "./shared";
import { cn } from "@/lib/utils";

export function RegexTester() {
    const [regex, setRegex] = useState("([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\\.[a-zA-Z0-9_-]+)");
    const [flags, setFlags] = useState("g");
    const [text, setText] = useState("Contact us at support@toolshed.site or hello@world.com for more info.");
    const [matches, setMatches] = useState<RegExpMatchArray[]>([]);
    const [valid, setValid] = useState(true);

    useEffect(() => {
        try {
            const re = new RegExp(regex, flags);
            const m = Array.from(text.matchAll(re));
            setMatches(m);
            setValid(true);
        } catch (e) {
            setValid(false);
            setMatches([]);
        }
    }, [regex, flags, text]);

    return (
        <div className="space-y-4">
            <ToolPanel>
                <div className="space-y-4">
                    <div className="flex gap-3">
                        <div className="flex-1 space-y-2">
                            <FieldLabel>Regular Expression</FieldLabel>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm leading-none">/</span>
                                <input
                                    type="text"
                                    value={regex}
                                    onChange={(e) => setRegex(e.target.value)}
                                    className={cn(
                                        "w-full rounded-md border bg-background pl-5 pr-10 py-2 font-mono text-sm outline-none transition-colors",
                                        !valid ? "border-red-500 bg-red-50/10" : "border-border focus:border-foreground/30"
                                    )}
                                    placeholder="Insert your regex here..."
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm leading-none">/</span>
                            </div>
                        </div>
                        <div className="w-20 space-y-2">
                            <FieldLabel>Flags</FieldLabel>
                            <input
                                type="text"
                                value={flags}
                                onChange={(e) => setFlags(e.target.value)}
                                className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-foreground/30"
                                placeholder="gim"
                            />
                        </div>
                    </div>
                    {!valid && <p className="text-[10px] text-red-500 font-medium">Invalid regular expression</p>}
                </div>
            </ToolPanel>

            <div className="grid gap-4 md:grid-cols-[1fr,260px]">
                <div className="space-y-4">
                    <ToolPanel className="p-0 overflow-hidden">
                        <div className="border-b border-border bg-muted/30 px-4 py-2 flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase text-muted-foreground">Test String</span>
                            <span className="text-[10px] text-muted-foreground">{matches.length} matches found</span>
                        </div>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="h-48 w-full block border-none bg-transparent p-4 font-mono text-xs outline-none"
                            placeholder="Your text to test against..."
                        />
                    </ToolPanel>
                </div>

                <div className="space-y-4">
                    <div className="rounded-lg border border-border bg-card p-4">
                        <h4 className="text-[10px] font-bold uppercase text-muted-foreground mb-3">Matches</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {matches.map((m, i) => (
                                <div key={i} className="rounded bg-accent/10 border border-accent/20 p-2 font-mono text-[10px] truncate" title={m[0]}>
                                    {m[0]}
                                </div>
                            ))}
                            {matches.length === 0 && <p className="text-[10px] text-muted-foreground italic">No matches</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
