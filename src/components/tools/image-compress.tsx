import { useState } from "react";
import { toast } from "sonner";
import { Dropzone } from "./dropzone";
import { GhostButton, PrimaryButton, ToolPanel } from "./shared";

export function ImageCompress() {
  const [src, setSrc] = useState<string | null>(null);
  const [origSize, setOrigSize] = useState(0);
  const [quality, setQuality] = useState(0.7);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    setOrigSize(file.size);
    setResultUrl(null);
    setResultSize(0);
  };

  const compress = () => {
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          setResultUrl(url);
          setResultSize(blob.size);
          toast.success(`Compressed by ${Math.round((1 - blob.size / origSize) * 100)}%`);
        },
        "image/jpeg",
        quality,
      );
    };
    img.src = src;
  };

  const fmt = (b: number) => (b < 1024 ? `${b}B` : b < 1048576 ? `${(b / 1024).toFixed(1)}KB` : `${(b / 1048576).toFixed(2)}MB`);

  if (!src) {
    return <Dropzone accept="image/*" onFile={handleFile} hint="Compresses to JPEG" />;
  }

  return (
    <ToolPanel>
      <div className="grid gap-6 md:grid-cols-[1fr,260px]">
        <div className="overflow-hidden rounded-md border border-border bg-background p-3">
          <img src={resultUrl ?? src} alt="" className="mx-auto max-h-[360px]" />
        </div>
        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Quality</span>
              <span className="font-mono text-sm tabular-nums">{Math.round(quality * 100)}</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-[var(--accent)]"
            />
          </div>

          <div className="space-y-1 rounded-md border border-border bg-background p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Original</span>
              <span className="font-mono">{fmt(origSize)}</span>
            </div>
            {resultSize > 0 && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Compressed</span>
                  <span className="font-mono">{fmt(resultSize)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-1">
                  <span className="text-muted-foreground">Saved</span>
                  <span className="font-mono text-moss">
                    {Math.round((1 - resultSize / origSize) * 100)}%
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <PrimaryButton onClick={compress}>Compress</PrimaryButton>
            {resultUrl && (
              <a
                href={resultUrl}
                download="compressed.jpg"
                className="inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:border-foreground/30"
              >
                Download
              </a>
            )}
            <GhostButton onClick={() => { setSrc(null); setResultUrl(null); }}>Choose another</GhostButton>
          </div>
        </div>
      </div>
    </ToolPanel>
  );
}
