import { useState } from "react";
import { FileImage, Copy, Download, RefreshCw } from "lucide-react";
import { ToolPanel, PrimaryButton, GhostButton, CopyButton, FieldLabel } from "./shared";
import { Dropzone } from "./dropzone";
import { toast } from "sonner";

export function Base64ImageEncoder() {
    const [base64, setBase64] = useState("");
    const [imageSrc, setImageSrc] = useState("");

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setBase64(result);
            setImageSrc(result);
            toast.success("Image encoded to Base64");
        };
        reader.readAsDataURL(file);
    };

    if (!base64) {
        return (
            <Dropzone
                onFile={handleFile}
                accept="image/*"
                hint="Transform any image into a Base64 string for CSS/HTML"
            />
        );
    }

    return (
        <div className="space-y-4">
            <ToolPanel>
                <div className="grid gap-8 md:grid-cols-[240px,1fr]">
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">Preview</span>
                        <div className="aspect-square flex items-center justify-center overflow-hidden rounded-md border border-border bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')]">
                            <img src={imageSrc} alt="Preview" className="max-h-full max-w-full object-contain" />
                        </div>
                        <GhostButton onClick={() => { setBase64(""); setImageSrc(""); }} className="w-full">
                            Change Image
                        </GhostButton>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <FieldLabel className="mb-0">Data URI / Base64 String</FieldLabel>
                                <CopyButton value={base64} />
                            </div>
                            <textarea
                                value={base64}
                                readOnly
                                className="h-48 w-full rounded-md border border-border bg-muted/20 p-3 font-mono text-[10px] leading-relaxed outline-none"
                            />
                        </div>

                        <div className="flex gap-2">
                            <PrimaryButton onClick={() => {
                                const pureBase64 = base64.split(",")[1];
                                setBase64(pureBase64);
                                toast.success("Stripped Data URI prefix");
                            }} disabled={!base64.startsWith("data:")}>
                                Get Pure Base64
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </ToolPanel>
        </div>
    );
}
