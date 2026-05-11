import { useState, useMemo } from "react";
import { Layers, Copy, Check, Info, LayoutTemplate } from "lucide-react";
import { ToolPanel, FieldLabel, GhostButton } from "./shared";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function GlassmorphismGenerator() {
  const [blur, setBlur] = useState(12);
  const [transparency, setTransparency] = useState(0.2);
  const [color, setColor] = useState("#ffffff");
  const [borderOpacity, setBorderOpacity] = useState(0.1);
  const [copied, setCopied] = useState(false);

  const glassStyle = useMemo(() => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    return {
      background: `rgba(${r}, ${g}, ${b}, ${transparency})`,
      backdropFilter: `blur(${blur}px)`,
      WebkitBackdropFilter: `blur(${blur}px)`,
      border: `1px solid rgba(${r}, ${g}, ${b}, ${borderOpacity})`,
      borderRadius: "16px",
    };
  }, [blur, transparency, color, borderOpacity]);

  const cssCode = `background: rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${transparency});\nbackdrop-filter: blur(${blur}px);\n-webkit-backdrop-filter: blur(${blur}px);\nborder: 1px solid rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${borderOpacity});\nborder-radius: 16px;`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    toast.success("Glassmorphism CSS copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolPanel className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <FieldLabel>Blur Radius</FieldLabel>
              <span className="text-xs font-mono">{blur}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={blur}
              onChange={(e) => setBlur(parseInt(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <FieldLabel>Transparency</FieldLabel>
              <span className="text-xs font-mono">{(transparency * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={transparency}
              onChange={(e) => setTransparency(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <FieldLabel>Border Opacity</FieldLabel>
              <span className="text-xs font-mono">{(borderOpacity * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={borderOpacity}
              onChange={(e) => setBorderOpacity(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
            />
          </div>

          <div>
            <FieldLabel>Glass Color</FieldLabel>
            <div className="flex gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-9 w-16 rounded border border-border bg-background p-1 cursor-pointer"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-mono outline-none focus:border-foreground/30"
              />
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

        <div className="relative flex items-center justify-center rounded-2xl border border-border bg-slate-100 overflow-hidden min-h-[400px]">
          {/* Background decoration for preview */}
          <div className="absolute inset-0 z-0">
             <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-orange-400 to-rose-500 blur-3xl opacity-60 animate-pulse" />
             <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-blue-500 to-teal-400 blur-3xl opacity-60" />
             <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 blur-3xl opacity-50" />
             <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
          </div>

          <div
            className="z-10 w-72 h-48 flex flex-col items-center justify-center p-8 text-center shadow-2xl transition-all duration-300"
            style={glassStyle}
          >
            <Layers className="h-8 w-8 mb-4 opacity-50" />
            <h3 className="font-serif text-lg font-medium mb-1">Glass Card</h3>
            <p className="text-xs opacity-60 leading-relaxed">Adjust the sliders to see the glassmorphism effect in real-time.</p>
          </div>
          
          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 text-[10px] text-slate-400 font-medium uppercase tracking-tighter bg-white/50 backdrop-blur-sm px-2 py-1 rounded border border-white/20">
             <LayoutTemplate className="h-3 w-3" />
             Background Preview
          </div>
        </div>
      </div>
    </div>
  );
}
