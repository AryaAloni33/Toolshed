import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { Archive, X, File as FileIcon, Plus } from "lucide-react";
import { PrimaryButton, ToolPanel, GhostButton } from "./shared";
import { cn } from "@/lib/utils";

export function ZipTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [zipName, setZipName] = useState("archive.zip");

  const addFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length > 0) {
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const createZip = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    const loadingToast = toast.loading("Creating zip archive...");

    try {
      const zip = new JSZip();
      files.forEach((file) => {
        zip.file(file.name, file);
      });

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, zipName.endsWith(".zip") ? zipName : `${zipName}.zip`);
      toast.success("Archive created!", { id: loadingToast });
    } catch (error) {
      toast.error("Failed to create archive.", { id: loadingToast });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <ToolPanel>
        <div className="space-y-4">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              setFiles((prev) => [
                ...prev,
                ...Array.from(e.dataTransfer.files),
              ]);
            }}
            className={cn(
              "relative flex min-h-[240px] flex-col rounded-lg border-2 border-dashed p-4 transition-colors",
              files.length === 0
                ? "items-center justify-center border-border bg-card hover:border-foreground/30"
                : "border-border bg-background",
            )}
          >
            {files.length === 0 ? (
              <div className="text-center">
                <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full border border-border bg-background">
                  <Archive className="h-5 w-5 text-muted-foreground" />
                </span>
                <div className="text-sm font-medium">
                  Drop files here to zip them
                </div>
                <input
                  type="file"
                  multiple
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onChange={addFiles}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {files.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-md border border-border bg-card p-2 text-xs"
                  >
                    <FileIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate">{file.name}</span>
                    <button
                      onClick={() => removeFile(i)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-md border border-dashed border-border bg-background p-2 text-xs hover:border-foreground/30">
                  <Plus className="h-3 w-3" /> Add more
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={addFiles}
                  />
                </label>
              </div>
            )}
          </div>

          {files.length > 0 && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Archive Name
                </label>
                <input
                  type="text"
                  value={zipName}
                  onChange={(e) => setZipName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/30"
                />
              </div>
              <PrimaryButton
                onClick={createZip}
                disabled={processing}
                className="sm:w-40"
              >
                {processing ? "Zipping..." : "Create ZIP"}
              </PrimaryButton>
            </div>
          )}
        </div>
      </ToolPanel>
    </div>
  );
}
