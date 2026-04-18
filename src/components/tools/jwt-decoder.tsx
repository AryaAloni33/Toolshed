import { useState, useEffect } from "react";
import { Key, ShieldAlert, Check, Copy } from "lucide-react";
import { ToolPanel, FieldLabel, CopyButton } from "./shared";
import { cn } from "@/lib/utils";

export function JwtDecoder() {
    const [token, setToken] = useState("");
    const [header, setHeader] = useState("");
    const [payload, setPayload] = useState("");
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!token.trim()) {
            setHeader("");
            setPayload("");
            setError(false);
            return;
        }

        try {
            const parts = token.split(".");
            if (parts.length !== 3) throw new Error();

            const decodedHeader = JSON.parse(atob(parts[0].replace(/-/g, "+").replace(/_/g, "/")));
            const decodedPayload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));

            setHeader(JSON.stringify(decodedHeader, null, 2));
            setPayload(JSON.stringify(decodedPayload, null, 2));
            setError(false);
        } catch (e) {
            setError(true);
            setHeader("");
            setPayload("");
        }
    }, [token]);

    return (
        <div className="space-y-4">
            <ToolPanel>
                <div>
                    <FieldLabel>JWT Token</FieldLabel>
                    <textarea
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="Paste your encoded JWT here..."
                        className={cn(
                            "h-24 w-full rounded-md border p-3 font-mono text-xs outline-none transition-colors",
                            error ? "border-red-500 bg-red-50/10" : "border-border bg-background focus:border-foreground/30"
                        )}
                    />
                    {error && <p className="mt-1 text-[10px] text-red-500 font-medium flex items-center gap-1"><ShieldAlert className="h-3 w-3" /> Invalid JWT format</p>}
                </div>
            </ToolPanel>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">Header</span>
                        <CopyButton value={header} />
                    </div>
                    <ToolPanel className="p-0 overflow-hidden">
                        <pre className="p-4 font-mono text-[11px] h-64 overflow-auto bg-muted/10 leading-relaxed">
                            {header || "// Decode a token to view header"}
                        </pre>
                    </ToolPanel>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">Payload</span>
                        <CopyButton value={payload} />
                    </div>
                    <ToolPanel className="p-0 overflow-hidden">
                        <pre className="p-4 font-mono text-[11px] h-64 overflow-auto bg-muted/10 leading-relaxed">
                            {payload || "// Decode a token to view payload"}
                        </pre>
                    </ToolPanel>
                </div>
            </div>
        </div>
    );
}
