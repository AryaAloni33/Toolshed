import { useState } from "react";
import { removeBackground } from "@imgly/background-removal";
import { toast } from "sonner";
import { Eraser, Download, Loader2 } from "lucide-react";
import { PrimaryButton, ToolPanel, GhostButton } from "./shared";
import { Dropzone } from "./dropzone";
import { saveAs } from "file-saver";

export function RemoveBackground() {
    const [src, setSrc] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleFile = async (file: File) => {
        const url = URL.createObjectURL(file);
        setSrc(url);
        setResult(null);
        processImage(file);
    };

    const processImage = async (image: File | string) => {
        setProcessing(true);
        const loadingToast = toast.loading("Removing background (loading AI model)...");

        try {
            const blob = await removeBackground(image, {
                progress: (key: string, current: number, total: number) => {
                    // progress tracking if needed
                }
            });

            const resultUrl = URL.createObjectURL(blob);
            setResult(resultUrl);
            toast.success("Background removed!", { id: loadingToast });
        } catch (e) {
            console.error(e);
            toast.error("Failed to remove background. Your browser might not support the required AI features.", { id: loadingToast });
        } finally {
            setProcessing(false);
        }
    };

    if (!src) {
        return <Dropzone accept="image/*" onFile={handleFile} hint="Remove background using on-device AI" />;
    }

    return (
        <div className="space-y-4">
            <ToolPanel>
                <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-2">
                        <span className="text-[10px] font-semibold uppercase text-muted-foreground">Original</span>
                        <div className="overflow-hidden rounded-md border border-border bg-muted/30">
                            <img src={src} alt="Original" className="max-h-[300px] w-full object-contain" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <span className="text-[10px] font-semibold uppercase text-muted-foreground">Result</span>
                        <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-md border border-border bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] bg-repeat">
                            {processing ? (
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 className="h-8 w-8 animate-spin text-accent" />
                                    <p className="text-xs text-muted-foreground">Processing...</p>
                                </div>
                            ) : result ? (
                                <img src={result} alt="Result" className="max-h-[300px] w-full object-contain" />
                            ) : (
                                <p className="text-xs text-muted-foreground">Ready to process</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex gap-3">
                    {result && (
                        <PrimaryButton onClick={() => result && saveAs(result, "no-bg.png")}>
                            <Download className="h-4 w-4" />
                            Download PNG
                        </PrimaryButton>
                    )}
                    <GhostButton onClick={() => { setSrc(null); setResult(null); }} disabled={processing}>
                        Choose another
                    </GhostButton>
                </div>
            </ToolPanel>
            <div className="rounded-lg border border-border bg-muted/30 p-4 text-[10px] text-muted-foreground">
                <p><strong>Note:</strong> This tool uses a ~80MB AI model that runs entirely in your browser. The first run might take a few moments to download the model.</p>
            </div>
        </div>
    );
}
