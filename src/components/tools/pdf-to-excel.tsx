import { useState } from "react";
import { toast } from "sonner";
import { FileText, Download, RefreshCw } from "lucide-react";
import { PrimaryButton, ToolPanel, GhostButton } from "./shared";
import { Dropzone } from "./dropzone";
import * as XLSX from "xlsx";

export function PdfToExcel() {
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleFileSelect = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
        }
    };

    const handleConvert = async () => {
        if (!file) return;
        setProcessing(true);

        try {
            const pdfjsLib = await import("pdfjs-dist");
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;

            let extractedLines: string[][] = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();

                let lastY = -1;
                let currentRow: string[] = [];

                textContent.items.forEach((item: any) => {
                    // If Y position drifts significantly, it's a new line
                    if (Math.abs(lastY - item.transform[5]) > 5 && lastY !== -1) {
                        extractedLines.push(currentRow);
                        currentRow = [];
                    }
                    currentRow.push(item.str);
                    lastY = item.transform[5];
                });
                if (currentRow.length > 0) {
                    extractedLines.push(currentRow);
                }
            }

            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.aoa_to_sheet(extractedLines);
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

            XLSX.writeFile(workbook, `${file.name.replace(/\.[^/.]+$/, "")}.xlsx`);

            toast.success("Conversion complete!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to convert PDF to Excel.");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="space-y-6">
            {!file ? (
                <Dropzone
                    onFile={(f) => handleFileSelect([f])}
                    accept=".pdf"
                    hint="Extracts text line-by-line into an Excel sheet"
                />
            ) : (
                <ToolPanel>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border border-border p-4">
                            <div className="flex items-center gap-3">
                                <FileText className="h-8 w-8 text-accent" />
                                <div>
                                    <div className="text-sm font-medium">{file.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <PrimaryButton onClick={handleConvert} disabled={processing}>
                                    {processing ? (
                                        <>
                                            <RefreshCw className="h-4 w-4 animate-spin" />
                                            Converting...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="h-4 w-4" />
                                            Convert to Excel
                                        </>
                                    )}
                                </PrimaryButton>
                                <GhostButton onClick={() => setFile(null)}>Remove</GhostButton>
                            </div>
                        </div>
                    </div>
                </ToolPanel>
            )}
        </div>
    );
}
