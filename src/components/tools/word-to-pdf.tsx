import { useState, useRef } from "react";
import { toast } from "sonner";
import { FileType2, Download, RefreshCw } from "lucide-react";
import { PrimaryButton, ToolPanel, GhostButton } from "./shared";
import { Dropzone } from "./dropzone";
import * as mammoth from "mammoth/mammoth.browser.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export function WordToPdf() {
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleFileSelect = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
        }
    };

    const handleConvert = async () => {
        if (!file || !containerRef.current) return;
        setProcessing(true);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const m = (mammoth as any).default || mammoth;
            const result = await m.convertToHtml({ arrayBuffer });
            const htmlContent = result.value;

            // Render offscreen in an iframe to avoid html2canvas CSS parsing crashes (oklch)
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
        } catch (error: any) {
            console.error("Word conversion error:", error);
            toast.error(`Failed to convert Word file: ${error.message || String(error)}`);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div ref={containerRef} />
            {!file ? (
                <Dropzone
                    onFile={(f) => handleFileSelect([f])}
                    accept=".docx"
                    hint="Converts your .docx file to a PDF"
                />
            ) : (
                <ToolPanel>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border border-border p-4">
                            <div className="flex items-center gap-3">
                                <FileType2 className="h-8 w-8 text-accent" />
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
