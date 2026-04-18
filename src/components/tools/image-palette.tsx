import { useState } from "react";
import { toast } from "sonner";
import { Palette, Copy, Check } from "lucide-react";
import { PrimaryButton, ToolPanel, GhostButton } from "./shared";
import { Dropzone } from "./dropzone";

export function ImagePalette() {
  const [src, setSrc] = useState<string | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    extractPalette(url);
  };

  const extractPalette = (imageUrl: string) => {
    setProcessing(true);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
      ).data;
      const colorCounts: { [key: string]: number } = {};

      // Sample every 10th pixel for performance
      for (let i = 0; i < imageData.length; i += 40) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const hex = rgbToHex(r, g, b);
        colorCounts[hex] = (colorCounts[hex] || 0) + 1;
      }

      const sortedColors = Object.entries(colorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map((entry) => entry[0]);

      setColors(sortedColors);
      setProcessing(false);
    };
    img.src = imageUrl;
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  };

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopied(hex);
    toast.success(`Copied ${hex}`);
    setTimeout(() => setCopied(null), 1500);
  };

  if (!src) {
    return (
      <Dropzone
        accept="image/*"
        onFile={handleFile}
        hint="Extract the color palette from an image"
      />
    );
  }

  return (
    <div className="space-y-4">
      <ToolPanel>
        <div className="grid gap-8 md:grid-cols-[300px,1fr]">
          <div className="overflow-hidden rounded-md border border-border bg-background">
            <img
              src={src}
              alt="Source"
              className="w-full h-auto object-contain"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Palette className="h-4 w-4 text-accent" />
                Dominant Colors
              </h3>
              <div className="flex flex-wrap gap-3">
                {colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => copyColor(color)}
                    className="group flex flex-col items-center gap-2"
                  >
                    <div
                      className="h-14 w-14 rounded-lg border border-border shadow-sm transition-transform group-hover:scale-105"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-mono text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                      {copied === color ? (
                        <Check className="h-2.5 w-2.5 text-moss" />
                      ) : null}
                      {color}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex gap-2">
              <GhostButton onClick={() => setSrc(null)}>
                Choose another image
              </GhostButton>
            </div>
          </div>
        </div>
      </ToolPanel>
    </div>
  );
}
