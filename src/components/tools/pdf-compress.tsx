import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import pkg from 'file-saver';
const { saveAs } = pkg;
import { toast } from "sonner";
import { Minimize2, FileText, ArrowDown } from "lucide-react";
import { PrimaryButton, ToolPanel, GhostButton } from "./shared";
import { Dropzone } from "./dropzone";

export function PdfCompress() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [stats, setStats] = useState<{
    original: number;
    compressed: number;
  } | null>(null);

  const compressPdf = async (f: File) => {
    setProcessing(true);
    const loadingToast = toast.loading("Compressing PDF...");

    try {
      const arrayBuffer = await f.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // pdf-lib doesn't have deep compression (like image downscaling) but we can save with compression
      const compressedPdfBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      const blob = new Blob([compressedPdfBytes as any], {
        type: "application/pdf",
      });

      setStats({
        original: f.size,
        compressed: blob.size,
      });

      setFile(f);
      saveAs(blob, `compressed_${f.name}`);

      const saved = (((f.size - blob.size) / f.size) * 100).toFixed(1);
      toast.success(`Compressed by ${saved}%`, { id: loadingToast });
    } catch (error) {
      console.error(error);
      toast.error("Compression failed.", { id: loadingToast });
    } finally {
      setProcessing(false);
    }
  };

  if (!file && !processing) {
    return (
      <Dropzone
        accept="application/pdf"
        onFile={compressPdf}
        hint="Drop a PDF to compress it"
      />
    );
  }

  return (
    <div className="space-y-4">
      <ToolPanel>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-6 flex items-center justify-center gap-8">
            <div className="flex flex-col items-center">
              <div className="mb-2 rounded-full bg-muted p-4">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="text-xs font-medium uppercase text-muted-foreground">
                Original
              </span>
              <span className="text-sm font-semibold">
                {(stats?.original ? stats.original / 1024 : 0).toFixed(1)} KB
              </span>
            </div>

            <ArrowDown className="h-5 w-5 -rotate-90 text-accent" />

            <div className="flex flex-col items-center">
              <div className="mb-2 rounded-full bg-accent/10 p-4 border border-accent/20">
                <Minimize2 className="h-6 w-6 text-accent" />
              </div>
              <span className="text-xs font-medium uppercase text-muted-foreground">
                Compressed
              </span>
              <span className="text-sm font-semibold">
                {(stats?.compressed ? stats.compressed / 1024 : 0).toFixed(1)}{" "}
                KB
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-medium">{file?.name}</h3>
            {stats && (
              <p className="mt-1 text-sm text-accent font-medium">
                Saved{" "}
                {((1 - stats.compressed / stats.original) * 100).toFixed(1)}% of
                file size
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <PrimaryButton
              onClick={() => file && compressPdf(file)}
              disabled={processing}
            >
              {processing ? "Compressing..." : "Download again"}
            </PrimaryButton>
            <GhostButton
              onClick={() => {
                setFile(null);
                setStats(null);
              }}
            >
              Choose another
            </GhostButton>
          </div>
        </div>
      </ToolPanel>
    </div>
  );
}
