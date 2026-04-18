import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pkg from 'file-saver';
const { saveAs } = pkg;
import { toast } from "sonner";
import { FileImage, Download, RefreshCw } from "lucide-react";
import { PrimaryButton, ToolPanel, GhostButton } from "./shared";
import { Dropzone } from "./dropzone";

// Initialize pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export function PdfToImage() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFile = async (f: File) => {
    setProcessing(true);
    const loadingToast = toast.loading("Loading PDF previews...");
    try {
      const arrayBuffer = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = Math.min(pdf.numPages, 10); // Preview first 10 pages
      const newPreviews: string[] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) continue;
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await (page as any).render({ canvasContext: context, viewport })
          .promise;
        newPreviews.push(canvas.toDataURL("image/png"));
      }

      setPreviews(newPreviews);
      setFile(f);
      toast.success(`Loaded ${pdf.numPages} pages`, { id: loadingToast });
    } catch (e) {
      console.error(e);
      toast.error("Failed to load PDF.", { id: loadingToast });
    } finally {
      setProcessing(false);
    }
  };

  const convertAll = async () => {
    if (!file) return;
    setProcessing(true);
    const loadingToast = toast.loading("Converting all pages to images...");
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // High quality
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) continue;
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await (page as any).render({ canvasContext: context, viewport })
          .promise;
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/png"),
        );
        if (blob) {
          saveAs(blob, `page_${i}_${file.name.replace(".pdf", "")}.png`);
        }
      }
      toast.success("Conversion complete!", { id: loadingToast });
    } catch (e) {
      toast.error("Conversion failed.", { id: loadingToast });
    } finally {
      setProcessing(false);
    }
  };

  if (!file) {
    return (
      <Dropzone
        accept="application/pdf"
        onFile={handleFile}
        hint="Convert PDF pages to PNG images"
      />
    );
  }

  return (
    <div className="space-y-4">
      <ToolPanel>
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h3 className="text-sm font-medium">{file.name}</h3>
              <p className="text-[10px] text-muted-foreground">
                Showing first {previews.length} pages
              </p>
            </div>
            <div className="flex gap-2">
              <PrimaryButton onClick={convertAll} disabled={processing}>
                {processing ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Download className="h-3.5 w-3.5" />
                )}
                Download All PNGs
              </PrimaryButton>
              <GhostButton
                onClick={() => {
                  setFile(null);
                  setPreviews([]);
                }}
              >
                Choose another
              </GhostButton>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {previews.map((src, i) => (
              <div
                key={i}
                className="group relative aspect-[3/4] overflow-hidden rounded-md border border-border bg-muted/30"
              >
                <img
                  src={src}
                  alt={`Page ${i + 1}`}
                  className="h-full w-full object-contain p-1"
                />
                <div className="absolute bottom-1 right-1 rounded bg-background/80 px-1 text-[8px] font-bold text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  PAGE {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ToolPanel>
    </div>
  );
}
