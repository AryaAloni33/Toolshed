import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import pkg from 'file-saver';
const { saveAs } = pkg;
import { toast } from "sonner";
import { Scissors, FileText, Download } from "lucide-react";
import { PrimaryButton, ToolPanel, GhostButton } from "./shared";
import { Dropzone } from "./dropzone";

export function PdfSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [processing, setProcessing] = useState(false);
  const [range, setRange] = useState("");

  const handleFile = async (f: File) => {
    try {
      const arrayBuffer = await f.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      setPageCount(pdf.getPageCount());
      setFile(f);
      setRange(`1-${pdf.getPageCount()}`);
    } catch (e) {
      toast.error("Cloud not load PDF file.");
    }
  };

  const splitPdf = async () => {
    if (!file) return;

    setProcessing(true);
    const loadingToast = toast.loading("Processing PDF...");

    try {
      // Parse range
      const pagesToKeep: number[] = [];
      const parts = range.split(",").map((p) => p.trim());

      for (const part of parts) {
        if (part.includes("-")) {
          const [start, end] = part.split("-").map(Number);
          for (let i = start; i <= end; i++) {
            if (i > 0 && i <= pageCount) pagesToKeep.push(i - 1);
          }
        } else {
          const num = Number(part);
          if (num > 0 && num <= pageCount) pagesToKeep.push(num - 1);
        }
      }

      if (pagesToKeep.length === 0) {
        toast.error("Invalid page range.", { id: loadingToast });
        setProcessing(false);
        return;
      }

      const originalPdf = await PDFDocument.load(await file.arrayBuffer());
      const newPdf = await PDFDocument.create();

      const copiedPages = await newPdf.copyPages(originalPdf, pagesToKeep);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      saveAs(blob, `split_${file.name}`);

      toast.success("PDF split successfully!", { id: loadingToast });
    } catch (error) {
      console.error(error);
      toast.error("Failed to split PDF.", { id: loadingToast });
    } finally {
      setProcessing(false);
    }
  };

  const extractAllPages = async () => {
    if (!file) return;
    setProcessing(true);
    const loadingToast = toast.loading("Extracting pages...");

    try {
      const originalPdf = await PDFDocument.load(await file.arrayBuffer());

      for (let i = 0; i < pageCount; i++) {
        const newPdf = await PDFDocument.create();
        const [page] = await newPdf.copyPages(originalPdf, [i]);
        newPdf.addPage(page);
        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
        saveAs(blob, `page_${i + 1}_${file.name}`);
      }

      toast.success(`Extracted ${pageCount} files.`, { id: loadingToast });
    } catch (error) {
      toast.error("Failed to extract pages.", { id: loadingToast });
    } finally {
      setProcessing(false);
    }
  };

  if (!file) {
    return (
      <Dropzone
        accept="application/pdf"
        onFile={handleFile}
        hint="Drop a PDF to extract pages"
      />
    );
  }

  return (
    <div className="space-y-4">
      <ToolPanel>
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-border bg-card p-8 text-center">
            <div className="mb-4 rounded-full bg-accent/10 p-4">
              <FileText className="h-8 w-8 text-accent" />
            </div>
            <h3 className="font-medium">{file.name}</h3>
            <p className="text-sm text-muted-foreground">
              {pageCount} pages • {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <GhostButton onClick={() => setFile(null)} className="mt-4">
              Choose another
            </GhostButton>
          </div>

          <div className="flex w-full flex-col gap-4 md:w-80">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Page Range
              </label>
              <input
                type="text"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                placeholder="e.g. 1-3, 5, 8-10"
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-foreground/30"
              />
              <p className="mt-1.5 text-[10px] text-muted-foreground">
                Use commas for separate pages and dashes for ranges.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <PrimaryButton
                onClick={splitPdf}
                className="w-full"
                disabled={processing}
              >
                <Scissors className="mr-2 h-4 w-4" />
                {processing ? "Extracting..." : "Extract Pages"}
              </PrimaryButton>

              <GhostButton
                onClick={extractAllPages}
                className="w-full"
                disabled={processing}
              >
                <Download className="mr-2 h-4 w-4" />
                Separate Every Page
              </GhostButton>
            </div>
          </div>
        </div>
      </ToolPanel>
    </div>
  );
}
