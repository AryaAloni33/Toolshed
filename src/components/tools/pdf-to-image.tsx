import { useState } from "react";
import pkg from 'file-saver';
const { saveAs } = pkg;
import { toast } from "sonner";
import { FileImage, Download, RefreshCw, Loader2 } from "lucide-react";
import { PrimaryButton, ToolPanel, GhostButton } from "./shared";
import { Dropzone } from "./dropzone";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

export function PdfToImage() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const pdfjsLib = await import("pdfjs-dist");
          pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
          const loadingTask = pdfjsLib.getDocument(reader.result as ArrayBuffer);
          const pdf = await loadingTask.promise;
          setTotalPages(pdf.numPages);
        } catch (error) {
          console.error(error);
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
      const [pdfjsLib, JSZip] = await Promise.all([
        import("pdfjs-dist"),
        import("jszip").then((m) => m.default),
      ]);
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument(arrayBuffer);
      const pdf = await loadingTask.promise;

      toast.success(`Converting ${pdf.numPages} pages...`);

      const zip = new JSZip();
      const folderName = file.name.replace(/\.pdf$/i, "");

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // @ts-ignore
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
        if (blob) {
          const arrayBuf = await blob.arrayBuffer();
          zip.file(`page-${String(i).padStart(3, "0")}.png`, arrayBuf);
        }
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `${folderName}-images.zip`);

      toast.success(`Downloaded ${pdf.numPages} pages as ZIP!`);
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
          onFile={(f) => handleFileSelect([f])}
          accept="application/pdf"
          hint="Each page will be saved as a separate image"
        />
      ) : (
        <ToolPanel>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileImage className="h-5 w-5 text-accent" />
              <span className="font-medium text-foreground">PDF to Image</span>
            </div>
            <GhostButton onClick={() => setFile(null)}>Clear</GhostButton>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-muted/5">
              <div className="flex items-center gap-3">
                <FileImage className="h-8 w-8 text-foreground/70" />
                <div>
                  <div className="text-sm font-medium text-foreground">{file.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • {totalPages || "?"} pages
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <PrimaryButton
                  onClick={handleConvert}
                  disabled={processing || totalPages === 0}
                >
                  {processing ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Converting...</>
                  ) : (
                    <><Download className="h-4 w-4 mr-2" /> Convert to Images</>
                  )}
                </PrimaryButton>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-muted/10 p-4 text-xs text-muted-foreground">
              <h4 className="mb-2 font-medium text-foreground">Note:</h4>
              <ul className="list-inside list-disc space-y-1">
                <li>High-quality 2x scale rendering</li>
                <li>Each page is converted to a PNG file</li>
                <li>Processing happens entirely in your browser. No files are uploaded to servers.</li>
              </ul>
            </div>
          </div>
        </ToolPanel>
      )}

      {file && (
        <ToolPanel className="max-w-md">
          <div className="mb-4 flex items-center gap-2">
            <FileImage className="h-5 w-5 text-accent" />
            <span className="font-medium text-foreground">Options</span>
          </div>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>Support for choosing specific pages and image formats coming soon.</p>
          </div>
        </ToolPanel>
      )}
    </div>
  );
}
