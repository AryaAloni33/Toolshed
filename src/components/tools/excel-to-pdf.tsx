import { useState } from "react";
import { toast } from "sonner";
import { FileText, Download, RefreshCw } from "lucide-react";
import { PrimaryButton, ToolPanel, GhostButton } from "./shared";
import { Dropzone } from "./dropzone";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export function ExcelToPdf() {
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
            const arrayBuffer = await file.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: "array" });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const htmlContent = XLSX.utils.sheet_to_html(worksheet);

            const iframe = document.createElement("iframe");
            iframe.style.width = "800px";
            iframe.style.height = "1000px";
            iframe.style.position = "absolute";
            iframe.style.top = "-9999px";
            document.body.appendChild(iframe);

            const doc = iframe.contentDocument || iframe.contentWindow?.document;
            if (!doc) throw new Error("Could not create render iframe");

            doc.open();
            doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { background: white; color: black; font-family: sans-serif; padding: 20px; }
              table { border-collapse: collapse; width: 100%; }
              td, th { border: 1px solid #ccc; padding: 4px 8px; font-size: 12px; }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `);
            doc.close();

            toast.success("Generating PDF...");

            const canvas = await html2canvas(doc.body);
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${file.name.replace(/\.[^/.]+$/, "")}.pdf`);

            document.body.removeChild(iframe);
            toast.success("Conversion complete!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to convert Excel file.");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="space-y-6">
            {!file ? (
                <Dropzone
                    onFile={(f) => handleFileSelect([f])}
                    accept=".xlsx,.xls,.csv"
                    hint="Converts your spreadsheet to a PDF"
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
                                <PrimaryButton
                                    onClick={handleConvert}
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <RefreshCw className="h-4 w-4 animate-spin" />
                                            Converting...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="h-4 w-4" />
                                            Convert to PDF
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
