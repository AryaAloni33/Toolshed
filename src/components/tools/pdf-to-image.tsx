import { useState } from "react";
import pkg from 'file-saver';
const { saveAs } = pkg;
import { toast } from "sonner";
import { FileImage, Download, RefreshCw } from "lucide-react";
import { PrimaryButton, ToolPanel, GhostButton } from "./shared";
import { Dropzone } from "./dropzone";

// pdfjsLib will be loaded dynamically

export function PdfToImage() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      // Extract page count (optional, requires loading pdf)
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const pdfjsLib = await import("pdfjs-dist");
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
          const loadingTask = pdfjsLib.getDocument(reader.result as ArrayBuffer);
          const pdf = await loadingTask.promise;
          setTotalPages(pdf.numPages);
        } catch (error) {
          toast.error("Failed to read PDF pages");
        }
      };
      reader.readAsArrayBuffer(files[0]);
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setProcessing(true);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument(arrayBuffer);
      const pdf = await loadingTask.promise;

      toast.success(`Starting conversion of ${pdf.numPages} pages...`);

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
        if (blob) {
          saveAs(blob, `page-${i}.png`);
        }
      }

      toast.success("Conversion complete");
    } catch (error) {
      console.error(error);
      toast.error("Failed to convert PDF to images");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <Dropzone
          onFilesSelect={handleFileSelect}
          accept={{ "application/pdf": [".pdf"] }}
          maxFiles={1}
          title="Drop PDF to convert"
          description="Each page will be saved as a separate image"
        />
      ) : (
        <ToolPanel
          title="PDF to Image"
          icon={FileImage}
          onClear={() => setFile(null)}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <FileImage className="h-8 w-8 text-accent" />
                <div>
                  <div className="text-sm font-medium">{file.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • {totalPages} pages
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <PrimaryButton
                  onClick={handleConvert}
                  loading={processing}
                  icon={processing ? RefreshCw : Download}
                >
                  {processing ? "Converting..." : "Convert to Images"}
                </PrimaryButton>
                <GhostButton onClick={() => setFile(null)}>Remove</GhostButton>
              </div>
            </div>

            <div className="rounded-lg bg-muted/30 p-4 text-xs text-muted-foreground">
              <h4 className="mb-2 font-medium text-foreground">Note:</h4>
              <ul className="list-inside list-disc space-y-1">
                <li>High-quality 2x scale rendering</li>
                <li>Each page is converted to a PNG file</li>
                <li>Processing happens entirely in your browser</li>
              </ul>
            </div>
          </div>
        </ToolPanel>
      )}

      {file && (
        <ToolPanel title="Options" icon={FileImage} className="max-w-md">
          <div className="space-y-4 p-4 text-sm">
            <p>Support for choosing specific pages and image formats coming soon.</p>
          </div>
        </ToolPanel>
      )}
    </div>
  );
}
