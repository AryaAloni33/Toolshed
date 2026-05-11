import { useState, useMemo, useEffect } from "react";
import { Play, Square, Copy, Check, Sparkles, Wand2, Box } from "lucide-react";
import { ToolPanel, FieldLabel, GhostButton, PrimaryButton } from "./shared";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type AnimationPreset = {
  name: string;
  keyframes: string;
  animationName: string;
};

const PRESETS: Record<string, AnimationPreset> = {
  fadeIn: {
    name: "Fade In",
    keyframes: `@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}`,
    animationName: "fadeIn",
  },
  bounce: {
    name: "Bounce",
    keyframes: `@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-30px); }
  60% { transform: translateY(-15px); }
}`,
    animationName: "bounce",
  },
  spin: {
    name: "Spin",
    keyframes: `@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`,
    animationName: "spin",
  },
  pulse: {
    name: "Pulse",
    keyframes: `@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}`,
    animationName: "pulse",
  },
  slideIn: {
    name: "Slide In",
    keyframes: `@keyframes slideIn {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}`,
    animationName: "slideIn",
  },
  float: {
    name: "Float",
    keyframes: `@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}`,
    animationName: "float",
  }
};

export function AnimationVisualizer() {
  const [presetKey, setPresetKey] = useState("fadeIn");
  const [duration, setDuration] = useState(1);
  const [delay, setDelay] = useState(0);
  const [easing, setEasing] = useState("ease-in-out");
  const [iterations, setIterations] = useState("infinite");
  const [isPlaying, setIsPlaying] = useState(true);
  const [copied, setCopied] = useState(false);

  const preset = PRESETS[presetKey];

  const animationStyle = {
    animationName: preset.animationName,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    animationTimingFunction: easing,
    animationIterationCount: iterations,
    animationPlayState: isPlaying ? "running" : "paused",
    animationFillMode: "both",
  };

  const cssCode = `${preset.keyframes}\n\n.animated-element {\n  animation: ${preset.animationName} ${duration}s ${easing} ${delay}s ${iterations} both;\n}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    toast.success("Animation CSS copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <style>{preset.keyframes}</style>
      
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolPanel className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(PRESETS).map(([key, p]) => (
              <button
                key={key}
                onClick={() => setPresetKey(key)}
                className={cn(
                  "flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition-all hover:bg-muted",
                  presetKey === key ? "border-foreground/30 bg-muted ring-1 ring-foreground/10" : "bg-background"
                )}
              >
                <Sparkles className={cn("h-3.5 w-3.5", presetKey === key ? "text-moss" : "text-muted-foreground")} />
                {p.name}
              </button>
            ))}
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <div>
              <div className="flex justify-between items-center mb-2">
                <FieldLabel>Duration</FieldLabel>
                <span className="text-xs font-mono">{duration}s</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <FieldLabel>Delay</FieldLabel>
                <span className="text-xs font-mono">{delay}s</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={delay}
                onChange={(e) => setDelay(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Easing</FieldLabel>
                <select
                  value={easing}
                  onChange={(e) => setEasing(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-foreground/30"
                >
                  <option value="linear">Linear</option>
                  <option value="ease">Ease</option>
                  <option value="ease-in">Ease In</option>
                  <option value="ease-out">Ease Out</option>
                  <option value="ease-in-out">Ease In Out</option>
                  <option value="cubic-bezier(0.68, -0.55, 0.27, 1.55)">Bouncy</option>
                </select>
              </div>
              <div>
                <FieldLabel>Iterations</FieldLabel>
                <select
                  value={iterations}
                  onChange={(e) => setIterations(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-foreground/30"
                >
                  <option value="1">Once</option>
                  <option value="2">Twice</option>
                  <option value="3">3 Times</option>
                  <option value="infinite">Infinite</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <FieldLabel>CSS Output</FieldLabel>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-moss" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy Style"}
              </button>
            </div>
            <pre className="rounded-lg bg-background p-3 border border-border font-mono text-[10px] leading-relaxed overflow-x-auto whitespace-pre">
              {cssCode}
            </pre>
          </div>
        </ToolPanel>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-background/50 p-12 min-h-[400px] relative overflow-hidden grid-paper">
          <div
            className="w-32 h-32 rounded-2xl bg-foreground flex items-center justify-center transition-all shadow-xl"
            style={animationStyle}
            key={`${presetKey}-${isPlaying}-${duration}-${easing}`}
          >
            <Box className="h-10 w-10 text-background" strokeWidth={1.5} />
          </div>
          
          <div className="mt-12 flex gap-3">
            <GhostButton onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Square className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
              {isPlaying ? "Stop" : "Play"}
            </GhostButton>
            <GhostButton onClick={() => {
                setIsPlaying(false);
                setTimeout(() => setIsPlaying(true), 10);
            }}>
                Reset
            </GhostButton>
          </div>
          <p className="mt-6 text-xs text-muted-foreground font-medium uppercase tracking-widest opacity-50">Animation Preview</p>
        </div>
      </div>
    </div>
  );
}
