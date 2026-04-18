import { useState, useCallback } from "react";
import { KeyRound, RefreshCw, Copy, Check } from "lucide-react";
import {
  ToolPanel,
  PrimaryButton,
  GhostButton,
  FieldLabel,
  CopyButton,
} from "./shared";

export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState("");

  const generate = useCallback(() => {
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let chars = lower;
    if (includeUpper) chars += upper;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
  }, [length, includeUpper, includeNumbers, includeSymbols]);

  // Generate on first mount
  useState(() => {
    generate();
  });

  return (
    <div className="space-y-4">
      <ToolPanel>
        <div className="space-y-6">
          <div className="relative">
            <div className="flex items-center justify-between overflow-hidden rounded-md border border-border bg-muted/30 px-4 py-6">
              <span className="font-mono text-xl tracking-wider truncate mr-4">
                {password || "••••••••••••••••"}
              </span>
              <div className="flex gap-2 shrink-0">
                <CopyButton value={password} />
                <button
                  onClick={generate}
                  className="rounded-md border border-border bg-background p-1.5 hover:bg-muted"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between">
                  <FieldLabel>Length: {length}</FieldLabel>
                </div>
                <input
                  type="range"
                  min="4"
                  max="64"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[
                {
                  label: "Uppercase",
                  state: includeUpper,
                  set: setIncludeUpper,
                },
                {
                  label: "Numbers",
                  state: includeNumbers,
                  set: setIncludeNumbers,
                },
                {
                  label: "Symbols",
                  state: includeSymbols,
                  set: setIncludeSymbols,
                },
              ].map((opt) => (
                <label
                  key={opt.label}
                  className="flex cursor-pointer items-center gap-3 rounded-md border border-border bg-background p-3 transition-colors hover:bg-muted/50"
                >
                  <input
                    type="checkbox"
                    checked={opt.state}
                    onChange={(e) => opt.set(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-foreground focus:ring-foreground"
                  />
                  <span className="text-sm font-medium">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <PrimaryButton onClick={generate} className="w-full">
            Generate New Password
          </PrimaryButton>
        </div>
      </ToolPanel>
    </div>
  );
}
