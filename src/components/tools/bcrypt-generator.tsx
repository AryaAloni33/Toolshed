import { useState } from "react";
import bcrypt from "bcryptjs";
import { Shield, RefreshCw } from "lucide-react";
import { ToolPanel, FieldLabel, CopyButton, PrimaryButton } from "./shared";
import { toast } from "sonner";

export function BcryptGenerator() {
    const [text, setText] = useState("");
    const [rounds, setRounds] = useState(10);
    const [hash, setHash] = useState("");
    const [loading, setLoading] = useState(false);

    const [verifyText, setVerifyText] = useState("");
    const [verifyHash, setVerifyHash] = useState("");
    const [matchResult, setMatchResult] = useState<boolean | null>(null);

    const generateHash = async () => {
        if (!text) {
            toast.error("Please enter text to hash.");
            return;
        }
        setLoading(true);
        try {
            // Run async to avoid blocking main thread completely (even though it's CPU bound)
            setTimeout(() => {
                const salt = bcrypt.genSaltSync(rounds);
                const result = bcrypt.hashSync(text, salt);
                setHash(result);
                setLoading(false);
                toast.success("Hash generated!");
            }, 50);
        } catch (e) {
            setLoading(false);
            toast.error("Failed to generate hash");
        }
    };

    const handleVerify = () => {
        if (!verifyText || !verifyHash) return;
        try {
            const match = bcrypt.compareSync(verifyText, verifyHash);
            setMatchResult(match);
            if (match) toast.success("Hash matches!");
            else toast.error("Hash does not match.");
        } catch (e) {
            toast.error("Invalid hash format");
            setMatchResult(null);
        }
    };

    return (
        <div className="space-y-6">
            <ToolPanel>
                <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-[1fr_100px]">
                        <div>
                            <FieldLabel>String to Hash</FieldLabel>
                            <input
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="secret_password_123"
                                className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-foreground/30"
                            />
                        </div>
                        <div>
                            <FieldLabel>Rounds</FieldLabel>
                            <input
                                type="number"
                                min="4"
                                max="20"
                                value={rounds}
                                onChange={(e) => setRounds(parseInt(e.target.value) || 10)}
                                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/30"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <PrimaryButton onClick={generateHash} disabled={loading}>
                            {loading ? (
                                <><RefreshCw className="h-4 w-4 animate-spin" /> Hashing...</>
                            ) : (
                                <><Shield className="h-4 w-4" /> Generate Hash</>
                            )}
                        </PrimaryButton>
                    </div>

                    {hash && (
                        <div className="mt-4 rounded-lg border border-border bg-muted/20 p-4">
                            <div className="mb-2 flex items-center justify-between">
                                <FieldLabel className="mb-0">Bcrypt Hash</FieldLabel>
                                <CopyButton value={hash} />
                            </div>
                            <div className="break-all font-mono text-sm text-foreground">
                                {hash}
                            </div>
                        </div>
                    )}
                </div>
            </ToolPanel>

            <ToolPanel>
                <div className="space-y-4">
                    <div>
                        <FieldLabel>Hash to verify</FieldLabel>
                        <input
                            type="text"
                            value={verifyHash}
                            onChange={(e) => {
                                setVerifyHash(e.target.value);
                                setMatchResult(null);
                            }}
                            placeholder="$2a$10$..."
                            className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-foreground/30"
                        />
                    </div>
                    <div>
                        <FieldLabel>String to match</FieldLabel>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={verifyText}
                                onChange={(e) => {
                                    setVerifyText(e.target.value);
                                    setMatchResult(null);
                                }}
                                placeholder="secret_password_123"
                                className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-foreground/30"
                            />
                            <PrimaryButton onClick={handleVerify}>Verify</PrimaryButton>
                        </div>
                    </div>

                    {matchResult !== null && (
                        <div className={`rounded-md p-3 text-sm font-medium ${matchResult ? "bg-moss/20 text-moss" : "bg-destructive/20 text-destructive"}`}>
                            {matchResult ? "✅ The string matches the hash successfully." : "❌ The string does NOT match the hash."}
                        </div>
                    )}
                </div>
            </ToolPanel>
        </div>
    );
}
