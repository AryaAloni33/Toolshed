import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import { Shield, Copy, RefreshCw } from "lucide-react";
import { ToolPanel, FieldLabel, CopyButton, PrimaryButton } from "./shared";

export function HashGenerator() {
    const [input, setInput] = useState("");
    const [hashes, setHashes] = useState({
        md5: "",
        sha1: "",
        sha256: "",
        sha512: ""
    });

    useEffect(() => {
        if (input) {
            setHashes({
                md5: CryptoJS.MD5(input).toString(),
                sha1: CryptoJS.SHA1(input).toString(),
                sha256: CryptoJS.SHA256(input).toString(),
                sha512: CryptoJS.SHA512(input).toString()
            });
        } else {
            setHashes({ md5: "", sha1: "", sha256: "", sha512: "" });
        }
    }, [input]);

    return (
        <div className="space-y-4">
            <ToolPanel>
                <div className="space-y-4">
                    <div>
                        <FieldLabel>Input Text</FieldLabel>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Enter text to hash..."
                            className="h-24 w-full rounded-md border border-border bg-background p-3 text-sm outline-none focus:border-foreground/30"
                        />
                    </div>
                </div>
            </ToolPanel>

            <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(hashes).map(([algo, value]) => (
                    <ToolPanel key={algo} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold uppercase text-muted-foreground">{algo}</span>
                            <CopyButton value={value} />
                        </div>
                        <p className="font-mono text-xs break-all leading-relaxed bg-muted/30 p-2 rounded border border-border/50">
                            {value || "..."}
                        </p>
                    </ToolPanel>
                ))}
            </div>
        </div>
    );
}
