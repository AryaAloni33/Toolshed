import { useState, useRef } from "react";
import { Terminal, Download, Copy, Check, Type, Layers, Maximize, MousePointer2, Image as ImageIcon } from "lucide-react";
import { ToolPanel, FieldLabel, PrimaryButton, GhostButton } from "./shared";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import html2canvas from "html2canvas";

const GRADIENTS = [
  { name: "Aurora", class: "from-indigo-500 via-purple-500 to-pink-500" },
  { name: "Deep Sea", class: "from-slate-900 via-blue-900 to-slate-900" },
  { name: "Sunset", class: "from-orange-500 to-rose-500" },
  { name: "Emerald", class: "from-emerald-500 to-teal-700" },
  { name: "Midnight", class: "from-gray-900 to-black" },
  { name: "Cyberpunk", class: "from-fuchsia-500 via-purple-600 to-indigo-700" },
  { name: "Frost", class: "from-blue-200 to-cyan-200 text-slate-900" },
];

export function CodeToCard() {
  const [code, setCode] = useState("const greet = () => {\n  console.log(\"Hello from Toolshed!\");\n};\n\ngreet();");
  const [title, setTitle] = useState("main.js");
  const [gradient, setGradient] = useState(GRADIENTS[0]);
  const [padding, setPadding] = useState(48);
  const [showBrowser, setShowBrowser] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!cardRef.current) return;
    
    setIsExporting(true);
    toast.info("Preparing high-res image...");
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // Higher resolution
        useCORS: true,
        backgroundColor: null,
      });
      
      const link = document.createElement("a");
      link.download = `toolshed-snippet-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Image exported!");
    } catch (err) {
      console.error(err);
      toast.error("Export failed. Try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
        <div className="space-y-4">
          <ToolPanel className="space-y-4">
            <div>
              <FieldLabel>Snippet Content</FieldLabel>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="block min-h-[160px] w-full resize-none rounded-md border border-border bg-background p-3 font-mono text-[13px] outline-none focus:border-foreground/30"
                placeholder="Paste your code here..."
              />
            </div>

            <div>
              <FieldLabel>Window Title</FieldLabel>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/30"
              />
            </div>

            <div>
              <FieldLabel>Background Style</FieldLabel>
              <div className="grid grid-cols-4 gap-2">
                {GRADIENTS.map((g) => (
                  <button
                    key={g.name}
                    onClick={() => setGradient(g)}
                    className={cn(
                      "h-8 rounded-md bg-gradient-to-br transition-all",
                      g.class,
                      gradient.name === g.name ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-95" : "hover:scale-105"
                    )}
                    title={g.name}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <FieldLabel className="mb-0">Padding</FieldLabel>
                <span className="text-[10px] font-mono text-muted-foreground">{padding}px</span>
              </div>
              <input
                type="range"
                min={16}
                max={128}
                step={8}
                value={padding}
                onChange={(e) => setPadding(parseInt(e.target.value))}
                className="w-full accent-foreground"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="browser-frame"
                checked={showBrowser}
                onChange={(e) => setShowBrowser(e.target.checked)}
                className="rounded border-border"
              />
              <label htmlFor="browser-frame" className="text-sm font-medium cursor-pointer">
                Show Browser Frame
              </label>
            </div>

            <PrimaryButton 
              onClick={handleExport} 
              disabled={isExporting} 
              className="w-full mt-4 bg-rust hover:bg-rust/90 text-primary-foreground dark:text-background border-none"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Rendering...
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4" />
                  Export to Image
                </>
              )}
            </PrimaryButton>
          </ToolPanel>
        </div>

        <div className="flex flex-col items-center justify-start overflow-hidden rounded-xl border border-border bg-card/30 p-8 min-h-[500px]">
          <div 
            ref={cardRef}
            className={cn(
              "relative flex items-center justify-center transition-all duration-300",
              "bg-gradient-to-br",
              gradient.class
            )}
            style={{ padding: `${padding}px` }}
          >
            <div className={cn(
              "relative w-full max-w-[600px] min-w-[320px] rounded-lg shadow-2xl overflow-hidden bg-[#0d1117] text-[#e6edf3] border border-white/10",
              !showBrowser && "p-6"
            )}>
              {showBrowser && (
                <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="text-[11px] font-medium text-muted-foreground/60 font-mono">
                    {title}
                  </div>
                  <div className="w-12" /> {/* Spacer */}
                </div>
              )}
              
              <div className={cn("font-mono text-sm leading-relaxed p-6", showBrowser ? "pt-4" : "")}>
                <pre className="whitespace-pre-wrap selection:bg-indigo-500/30">
                  <code>{code}</code>
                </pre>
              </div>
            </div>
            
            {/* Glossy Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 to-transparent mix-blend-overlay" />
          </div>
          
          <div className="mt-8 text-center space-y-1">
            <p className="text-sm font-medium text-muted-foreground italic">Live Preview</p>
            <p className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-mono">2x Resolution Output</p>
          </div>
        </div>
      </div>
    </div>
  );
}
