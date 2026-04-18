import { useState } from "react";
import JSZip from "jszip";
import pkg from 'file-saver';
const { saveAs } = pkg;
import { toast } from "sonner";
import {
  FileArchive,
  File as FileIcon,
  Download,
  FolderOpen,
} from "lucide-react";
import { PrimaryButton, ToolPanel, GhostButton } from "./shared";
import { Dropzone } from "./dropzone";

interface ZipFileEntry {
  name: string;
  dir: boolean;
  date: Date;
  size: number;
}

export function UnzipTool() {
  const [file, setFile] = useState<File | null>(null);
  const [entries, setEntries] = useState<ZipFileEntry[]>([]);
  const [processing, setProcessing] = useState(false);
  const [zipInstance, setZipInstance] = useState<JSZip | null>(null);

  const handleFile = async (f: File) => {
    setProcessing(true);
    try {
      const zip = new JSZip();
      const content = await zip.loadAsync(f);
      const newEntries: ZipFileEntry[] = [];

      content.forEach((relativePath, zipEntry) => {
        newEntries.push({
          name: zipEntry.name,
          dir: zipEntry.dir,
          date: zipEntry.date,
          size: (zipEntry as any)._data?.uncompressedSize || 0,
        });
      });

      setZipInstance(content);
      setEntries(newEntries);
      setFile(f);
    } catch (e) {
      toast.error("Could not read zip file.");
    } finally {
      setProcessing(false);
    }
  };

  const downloadFile = async (name: string) => {
    if (!zipInstance) return;
    try {
      const content = await zipInstance.file(name)?.async("blob");
      if (content) {
        saveAs(content, name.split("/").pop() || name);
      }
    } catch (e) {
      toast.error("Failed to extract file.");
    }
  };

  const downloadAll = async () => {
    if (!zipInstance) return;
    setProcessing(true);
    const loadingToast = toast.loading("Extracting all files...");
    try {
      for (const entry of entries) {
        if (!entry.dir) {
          const content = await zipInstance.file(entry.name)?.async("blob");
          if (content)
            saveAs(content, entry.name.split("/").pop() || entry.name);
        }
      }
      toast.success("All files extracted!", { id: loadingToast });
    } catch (e) {
      toast.error("Extraction failed.", { id: loadingToast });
    } finally {
      setProcessing(false);
    }
  };

  if (!file) {
    return (
      <Dropzone
        accept=".zip"
        onFile={handleFile}
        hint="Drop a .zip file to extract its contents"
      />
    );
  }

  return (
    <div className="space-y-4">
      <ToolPanel>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-accent/10 p-2">
                <FileArchive className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="text-sm font-medium">{file.name}</h3>
                <p className="text-[10px] text-muted-foreground">
                  {entries.filter((e) => !e.dir).length} files •{" "}
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <PrimaryButton
                onClick={downloadAll}
                disabled={processing}
                className="h-8 px-3 text-xs"
              >
                Extract All
              </PrimaryButton>
              <GhostButton
                onClick={() => {
                  setFile(null);
                  setEntries([]);
                  setZipInstance(null);
                }}
                className="h-8 px-3 text-xs"
              >
                Close
              </GhostButton>
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto rounded-md border border-border bg-background">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 font-medium">Name</th>
                  <th className="px-4 py-2 font-medium">Size</th>
                  <th className="px-4 py-2 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {entries.map((entry, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="flex items-center gap-2 px-4 py-2">
                      {entry.dir ? (
                        <FolderOpen className="h-3.5 w-3.5 text-accent/60" />
                      ) : (
                        <FileIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                      <span className="truncate max-w-[300px]">
                        {entry.name}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {entry.dir ? "-" : `${(entry.size / 1024).toFixed(1)} KB`}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {!entry.dir && (
                        <button
                          onClick={() => downloadFile(entry.name)}
                          className="rounded-md p-1.5 hover:bg-muted text-accent"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ToolPanel>
    </div>
  );
}
