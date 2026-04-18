import { useState } from "react";
import { toast } from "sonner";
import { Dropzone } from "./dropzone";
import { GhostButton, PrimaryButton, ToolPanel } from "./shared";

const formats = [
  { id: "image/png", label: "PNG", ext: "png" },
  { id: "image/jpeg", label: "JPG", ext: "jpg" },
  { id: "image/webp", label: "WebP", ext: "webp" },
] as const;

export function ImageConvert() {
  const [src, setSrc] = useState<string | null>(null);
  const [target, setTarget] = useState<typeof formats[number]>(formats[2]);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setSrc(URL.createObjectURL(file));
    setResultUrl(null);
  };

  const convert = () => {
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        setResultUrl(URL.createObjectURL(blob));
        toast.success(`Converted to ${target.label}`);
      }, target.id, 0.92);
    };
    img.src = src;
  };

  if (!src) return <Dropzone accept="image/*" onFile={handleFile} />;

  return (
    <ToolPanel>
      <div className="grid gap-6 md:grid-cols-[1fr,260px]">
        <div className="overflow-hidden rounded-md border border-border bg-background p-3">
          <img src={resultUrl ?? src} alt="" className="mx-auto max-h-[360px]" />
        </div>
        <div className="space-y-3">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Convert to
            </span>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {formats.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setTarget(f)}
                  className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                    target.id === f.id
                      ? "border-foreground/40 bg-muted"
                      : "border-border hover:border-foreground/20"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <PrimaryButton onClick={convert}>Convert</PrimaryButton>
            {resultUrl && (
              <a
                href={resultUrl}
                download={`converted.${target.ext}`}
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
