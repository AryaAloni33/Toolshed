import { useState } from "react";
import { toast } from "sonner";
import { Dropzone } from "./dropzone";
import { GhostButton, PrimaryButton, ToolPanel } from "./shared";

export function ImageResize() {
  const [src, setSrc] = useState<string | null>(null);
  const [origDims, setOrigDims] = useState<{ w: number; h: number } | null>(null);
  const [w, setW] = useState(800);
  const [h, setH] = useState(600);
  const [lock, setLock] = useState(true);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    setResultUrl(null);
    const img = new Image();
    img.onload = () => {
      setOrigDims({ w: img.width, h: img.height });
      setW(img.width);
      setH(img.height);
    };
    img.src = url;
  };

  const updateW = (val: number) => {
    setW(val);
    if (lock && origDims) setH(Math.round((val / origDims.w) * origDims.h));
  };
  const updateH = (val: number) => {
    setH(val);
    if (lock && origDims) setW(Math.round((val / origDims.h) * origDims.w));
  };

  const resize = () => {
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, w, h);
      const url = canvas.toDataURL("image/png");
      setResultUrl(url);
      toast.success(`Resized to ${w} × ${h}`);
    };
    img.src = src;
  };

  if (!src) {
    return <Dropzone accept="image/*" onFile={handleFile} hint="JPG, PNG, WebP, GIF" />;
  }

  return (
    <div className="space-y-4">
      <ToolPanel>
        <div className="grid gap-6 md:grid-cols-[1fr,260px]">
          <div className="overflow-hidden rounded-md border border-border bg-background p-3">
            <img src={resultUrl ?? src} alt="" className="mx-auto max-h-[360px]" />
          </div>
          <div className="space-y-3">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Width</span>
              <input
                type="number"
                value={w}
                onChange={(e) => updateW(Number(e.target.value))}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-foreground/30"
              />
            </div>
            <div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Height</span>
              <input
                type="number"
                value={h}
                onChange={(e) => updateH(Number(e.target.value))}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-foreground/30"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={lock} onChange={(e) => setLock(e.target.checked)} />
              Lock aspect ratio
            </label>
            {origDims && (
              <p className="text-xs text-muted-foreground">
                Original: {origDims.w} × {origDims.h}
              </p>
            )}
            <div className="flex flex-col gap-2 pt-2">
              <PrimaryButton onClick={resize}>Resize</PrimaryButton>
              {resultUrl && (
                <a
                  href={resultUrl}
                  download="resized.png"
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
    </div>
  );
}
