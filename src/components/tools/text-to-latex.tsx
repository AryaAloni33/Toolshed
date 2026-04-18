import { useState, useMemo } from "react";
import { CopyButton, GhostButton, ToolPanel } from "./shared";
import { BookOpen } from "lucide-react";

export function TextToLatex() {
    const [input, setInput] = useState("");
    const [wrapDoc, setWrapDoc] = useState(false);

    const texResult = useMemo(() => {
        if (!input) return "";

        // Basic LaTeX escaping algorithm
        let escaped = input
            .replace(/\\/g, "\\textbackslash{}")
            .replace(/\{/g, "\\{")
            .replace(/\}/g, "\\}")
            .replace(/\$/g, "\\$")
            .replace(/&/g, "\\&")
            .replace(/%/g, "\\%")
            .replace(/#/g, "\\#")
            .replace(/_/g, "\\_")
            .replace(/\^/g, "\\textasciicircum{}")
            .replace(/~/g, "\\textasciitilde{}")
            .replace(/</g, "\\textless{}")
            .replace(/>/g, "\\textgreater{}");

        if (wrapDoc) {
            return `\\documentclass{article}\n\\usepackage[utf8]{inputenc}\n\n\\begin{document}\n\n${escaped}\n\n\\end{document}`;
        }
        return escaped;
    }, [input, wrapDoc]);

    return (
        <div className="space-y-4">
            <ToolPanel>
                <div className="mb-3 flex items-center justify-between">
                    <label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                        Plain Text
                    </label>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer text-sm">
                            <input
                                type="checkbox"
                                checked={wrapDoc}
                                onChange={(e) => setWrapDoc(e.target.checked)}
                                className="accent-foreground"
                            />
                            Wrap in document structure
                        </label>
                        <GhostButton onClick={() => setInput("")}>Clear</GhostButton>
                    </div>
                </div>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    spellCheck={false}
                    className="block min-h-[160px] w-full resize-y rounded-md border border-border bg-background p-3 font-sans text-sm outline-none focus:border-foreground/30"
                    placeholder="Paste raw text here... Special characters like #, $, % will be safely escaped."
                />
            </ToolPanel>

            <ToolPanel>
                <div className="mb-3 flex items-center justify-between">
                    <label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                        LaTeX Output
                    </label>
                    {texResult && <CopyButton value={texResult} />}
                </div>
                <pre className="block min-h-[160px] max-h-[400px] overflow-auto whitespace-pre-wrap rounded-md border border-border bg-muted/10 p-3 font-mono text-sm leading-relaxed text-foreground">
                    {texResult || "Waiting for text..."}
                </pre>
            </ToolPanel>
        </div>
    );
}
