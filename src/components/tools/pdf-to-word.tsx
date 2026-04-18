import { useState } from "react";
import { toast } from "sonner";
import { FileType2, Download, RefreshCw } from "lucide-react";
import { PrimaryButton, ToolPanel, GhostButton } from "./shared";
import { Dropzone } from "./dropzone";
import { Document, Packer, Paragraph, TextRun } from "docx";
import pkg from "file-saver";
const { saveAs } = pkg;

export function PdfToWord() {
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

            let extractedText = "";

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(" ");
                extractedText += pageText + "\n\n";
            }

            const paragraphs = extractedText.split("\n\n").map(text => {
                return new Paragraph({
                    children: [new TextRun(text)],
                });
            });

            const doc = new Document({
                sections: [{
                    properties: {},
                    children: paragraphs,
                }],
            });

            const blob = await Packer.toBlob(doc);
            saveAs(blob, `${file.name.replace(/\.[^/.]+$/, "")}.docx`);

            toast.success("Conversion complete!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to convert PDF to Word.");
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
                    hint="Extracts text from PDF into a .docx file"
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
                                <PrimaryButton onClick={handleConvert} disabled={processing}>
                                    {processing ? (
                                        <>
                                            <RefreshCw className="h-4 w-4 animate-spin" />
                                            Converting...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="h-4 w-4" />
                                            Convert to Word
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
