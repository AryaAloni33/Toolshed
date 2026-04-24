import { useState, useRef } from "react";
import { Layers, Loader2, Download, Upload, FileJson, Check } from "lucide-react";
import { ToolPanel, PrimaryButton, FieldLabel } from "./shared";
import { toast } from "sonner";
import JSZip from "jszip";
import { cn } from "@/lib/utils";

const SIZES = [
  { id: "fav16", name: "favicon-16x16.png", size: 16 },
  { id: "fav32", name: "favicon-32x32.png", size: 32 },
  { id: "apple", name: "apple-touch-icon.png", size: 180 },
  { id: "and192", name: "android-chrome-192x192.png", size: 192 },
  { id: "and512", name: "android-chrome-512x512.png", size: 512 },
];

export function FaviconGenerator() {
  const [image, setImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set([...SIZES.map(s => s.id), "manifest"]));
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const toggleId = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const downloadZip = async () => {
    if (!image || !canvasRef.current) return;
    if (selectedIds.size === 0) {
      toast.error("Please select at least one asset to generate");
      return;
    }

    setGenerating(true);
    const zip = new JSZip();

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      const img = new Image();
      img.src = image;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Add selected images to zip
      for (const item of SIZES) {
        if (!selectedIds.has(item.id)) continue;

        canvas.width = item.size;
        canvas.height = item.size;
        ctx.clearRect(0, 0, item.size, item.size);
        ctx.drawImage(img, 0, 0, item.size, item.size);

        const dataUrl = canvas.toDataURL("image/png");
        const base64Data = dataUrl.split(",")[1];
        zip.file(item.name, base64Data, { base64: true });
      }

      // Add manifest if selected
      if (selectedIds.has("manifest")) {
        const manifest = {
          name: "Toolshed App",
          short_name: "Toolshed",
          icons: SIZES.filter(s => s.size >= 192 && selectedIds.has(s.id)).map(s => ({
            src: `/${s.name}`,
            sizes: `${s.size}x${s.size}`,
            type: "image/png"
          })),
          theme_color: "#ffffff",
          background_color: "#ffffff",
          display: "standalone"
        };
        zip.file("site.webmanifest", JSON.stringify(manifest, null, 2));
      }

      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "favicon-package.zip";
      link.click();

      toast.success("Favicon package generated and downloaded!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate zip package");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <ToolPanel>
        <FieldLabel>Original Image (Square recommended)</FieldLabel>
        <div className="mt-2 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-12 px-4 transition-colors hover:border-foreground/20">
          {image ? (
            <div className="text-center">
              <img src={image} className="mx-auto h-32 w-32 rounded-lg object-contain shadow-sm border border-border" />
              <button
                onClick={() => setImage(null)}
                className="mt-4 text-xs font-medium text-rust hover:underline"
              >
                Choose a different image
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center gap-2">
              <div className="rounded-full bg-muted p-3">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium">Click to upload or drag and drop</span>
              <span className="text-xs text-muted-foreground text-center max-w-[250px]">
                High resolution PNG or SVG (at least 512x512) works best.
              </span>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          )}
        </div>

        {image && (
          <div className="mt-8 flex flex-col items-center justify-center gap-6">
            <div className="w-full">
              <FieldLabel>Select assets to include in ZIP</FieldLabel>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {SIZES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => toggleId(s.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-3 text-left transition-all",
                      selectedIds.has(s.id)
                        ? "border-foreground/20 bg-foreground/[0.03] shadow-sm"
                        : "border-border bg-card opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
                    )}
                  >
                    <div className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                      selectedIds.has(s.id) ? "bg-foreground border-foreground text-background" : "bg-background border-border"
                    )}>
                      {selectedIds.has(s.id) && <Check className="h-3 w-3" strokeWidth={3} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-medium uppercase tracking-tight">{s.name}</div>
                      <div className="text-[10px] text-muted-foreground">{s.size}x{s.size}px</div>
                    </div>
                  </button>
                ))}
                <button
                  onClick={() => toggleId("manifest")}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-3 text-left transition-all",
                    selectedIds.has("manifest")
                      ? "border-foreground/20 bg-foreground/[0.03] shadow-sm"
                      : "border-border bg-card opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
                  )}
                >
                  <div className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                    selectedIds.has("manifest") ? "bg-foreground border-foreground text-background" : "bg-background border-border"
                  )}>
                    {selectedIds.has("manifest") && <Check className="h-3 w-3" strokeWidth={3} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium uppercase tracking-tight">site.webmanifest</div>
                    <div className="text-[10px] text-muted-foreground">JSON Config</div>
                  </div>
                </button>
              </div>
            </div>

            <PrimaryButton onClick={downloadZip} disabled={generating} className="w-full sm:w-auto h-12 px-8 text-base">
              {generating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating ZIP...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  Generate & Download ZIP
                </>
              )}
            </PrimaryButton>
          </div>
        )}
      </ToolPanel>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
