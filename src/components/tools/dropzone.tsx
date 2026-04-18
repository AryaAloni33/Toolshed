import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function Dropzone({
  accept,
  onFile,
  hint,
}: {
  accept?: string;
  onFile: (file: File) => void;
  hint?: string;
}) {
  const [over, setOver] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div
      onClick={() => ref.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onFile(f);
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-10 text-center transition-colors",
        over
          ? "border-accent bg-accent/5"
          : "border-border bg-card hover:border-foreground/30",
      )}
    >
      <span className="grid h-12 w-12 place-items-center rounded-full border border-border bg-background">
        <Upload className="h-5 w-5 text-muted-foreground" strokeWidth={1.6} />
      </span>
      <div>
        <div className="text-sm font-medium">Drop a file here, or click to choose</div>
        {hint && <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div>}
      </div>
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />
    </div>
  );
}
