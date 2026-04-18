import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { FileStack, X, GripVertical, Plus } from "lucide-react";
import { PrimaryButton, ToolPanel, GhostButton } from "./shared";
import { cn } from "@/lib/utils";

export function PdfMerge() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files).filter(
      (f) => f.type === "application/pdf",
    );
    if (newFiles.length > 0) {
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const addFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []).filter(
      (f) => f.type === "application/pdf",
    );
    if (newFiles.length > 0) {
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    const newFiles = [...files];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= files.length) return;
    [newFiles[index], newFiles[newIndex]] = [
      newFiles[newIndex],
      newFiles[index],
    ];
    setFiles(newFiles);
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      toast.error("Please add at least 2 PDF files to merge.");
      return;
    }

    setProcessing(true);
    const loadingToast = toast.loading("Merging PDFs...");

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const fileArrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(fileArrayBuffer);
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices(),
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes as any], {
        type: "application/pdf",
      });
      saveAs(blob, "merged.pdf");

      toast.success("PDFs merged successfully!", { id: loadingToast });
    } catch (error) {
      console.error(error);
      toast.error(
        "Failed to merge PDFs. One or more files might be corrupted.",
        { id: loadingToast },
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <ToolPanel>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className={cn(
            "relative flex min-h-[300px] flex-col rounded-lg border-2 border-dashed p-4 transition-colors",
            files.length === 0
              ? "items-center justify-center border-border bg-card hover:border-foreground/30"
              : "border-border bg-background",
          )}
        >
          {files.length === 0 ? (
            <div className="text-center">
              <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full border border-border bg-background">
                <FileStack className="h-5 w-5 text-muted-foreground" />
              </span>
              <div className="text-sm font-medium">
                Drop PDF files here, or click to browse
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Select multiple files to merge them
              </p>
              <input
                type="file"
                multiple
                accept="application/pdf"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={addFiles}
              />
            </div>
          ) : (
            <div className="w-full space-y-2">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold">
                  {files.length} files selected
                </h3>
                <label className="flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:border-foreground/30">
                  <Plus className="h-3.5 w-3.5" />
                  Add more
                  <input
                    type="file"
                    multiple
                    accept="application/pdf"
                    className="hidden"
                    onChange={addFiles}
                  />
                </label>
              </div>

              <div className="grid gap-2">
                {files.map((file, i) => (
                  <div
                    key={`${file.name}-${i}`}
                    className="flex items-center gap-3 rounded-md border border-border bg-card p-3"
                  >
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveFile(i, "up")}
                        disabled={i === 0}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                      >
                        <GripVertical className="h-4 w-4 rotate-0" />
                      </button>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">
                        {file.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => removeFile(i)}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <PrimaryButton
                  onClick={mergePdfs}
                  disabled={processing || files.length < 2}
                >
                  {processing ? "Merging..." : "Merge PDFs"}
                </PrimaryButton>
                <GhostButton onClick={() => setFiles([])} disabled={processing}>
                  Clear all
                </GhostButton>
              </div>
            </div>
          )}
        </div>
      </ToolPanel>

      <div className="rounded-lg border border-border bg-muted/30 p-4 text-xs text-muted-foreground">
        <p>
          <strong>Note:</strong> Merging happens entirely in your browser. Your
          files are never uploaded to a server.
        </p>
      </div>
    </div>
  );
}
