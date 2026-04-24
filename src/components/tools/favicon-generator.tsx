import { useState, useRef } from "react";
import { Layers, Loader2, Download, Upload, FileJson } from "lucide-react";
import { ToolPanel, PrimaryButton, FieldLabel } from "./shared";
import { toast } from "sonner";

const SIZES = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "android-chrome-192x192.png", size: 192 },
  { name: "android-chrome-512x512.png", size: 512 },
];

export function FaviconGenerator() {
  const [image, setImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const downloadAll = async () => {
    if (!image || !canvasRef.current) return;
    setGenerating(true);

    try {
      // In a real app we might use JSZip here, but for simplicity we'll download individually or just the main ones
      // For now let's provide a way to download the most common ones
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.src = image;
      await new Promise((resolve) => (img.onload = resolve));

      for (const item of SIZES) {
        canvas.width = item.size;
        canvas.height = item.size;
        ctx.clearRect(0, 0, item.size, item.size);
        ctx.drawImage(img, 0, 0, item.size, item.size);

        const link = document.createElement("a");
        link.download = item.name;
        link.href = canvas.toDataURL("image/png");
        link.click();
        // Small delay to prevent browser from blocking multiple downloads
        await new Promise(r => setTimeout(r, 100));
      }

      // Also download manifest.json
      const manifest = {
        name: "My App",
        short_name: "App",
        icons: SIZES.filter(s => s.size >= 192).map(s => ({
          src: `/${s.name}`,
          sizes: `${s.size}x${s.size}`,
          type: "image/png"
        })),
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone"
      };

      const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" });
      const manifestLink = document.createElement("a");
      manifestLink.download = "site.webmanifest";
      manifestLink.href = URL.createObjectURL(manifestBlob);
      manifestLink.click();

      toast.success("All assets generated and downloaded!");
    } catch (error) {
      toast.error("Failed to generate assets");
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
              <FieldLabel>Assets to be generated</FieldLabel>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {SIZES.map((s) => (
                  <div key={s.name} className="flex items-center gap-2 rounded-md border border-border bg-muted/20 p-2 text-[10px] font-medium uppercase tracking-tight">
                    <div className="h-4 w-4 rounded-sm bg-muted-foreground/20" />
                    <span className="flex-1 truncate">{s.name}</span>
                    <span className="text-muted-foreground opacity-60">{s.size}x{s.size}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 rounded-md border border-border bg-muted/20 p-2 text-[10px] font-medium uppercase tracking-tight">
                  <FileJson className="h-3.5 w-3.5 text-muted-foreground/60" />
                  <span className="flex-1 truncate">site.webmanifest</span>
                </div>
              </div>
            </div>

            <PrimaryButton onClick={downloadAll} disabled={generating} className="w-full sm:w-auto h-12 px-8 text-base">
              {generating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  Download Assets
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
