import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { QrCode, Download, Copy, Check } from "lucide-react";
import { PrimaryButton, ToolPanel, GhostButton, FieldLabel } from "./shared";
import { toast } from "sonner";

export function QrGenerator() {
  const [text, setText] = useState("https://toolshed.site");
  const [qrUrl, setQrUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (text) {
      QRCode.toDataURL(text, {
        width: 1024,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      })
        .then(setQrUrl)
        .catch(console.error);
    } else {
      setQrUrl("");
    }
  }, [text]);

  const copyImage = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setCopied(true);
      toast.success("QR Code copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy image");
    }
  };

  return (
    <div className="space-y-4">
      <ToolPanel>
        <div className="grid gap-8 md:grid-cols-[1fr,240px]">
          <div className="space-y-4">
            <div>
              <FieldLabel>Content</FieldLabel>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter URL or text..."
                className="h-32 w-full rounded-md border border-border bg-background p-3 text-sm outline-none focus:border-foreground/30"
              />
            </div>

            <div className="flex flex-col gap-2">
              <a
                href={qrUrl}
                download="qrcode.png"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                <Download className="h-4 w-4" />
                Download PNG
              </a>
              <GhostButton onClick={copyImage}>
                {copied ? (
                  <Check className="h-4 w-4 text-moss" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                Copy Image
              </GhostButton>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="overflow-hidden rounded-lg border border-border bg-white p-4 shadow-sm">
              {qrUrl ? (
                <img src={qrUrl} alt="QR Code" className="h-48 w-48" />
              ) : (
                <div className="flex h-48 w-48 items-center justify-center bg-muted/30">
                  <QrCode
                    className="h-10 w-10 text-muted-foreground/30"
                    strokeWidth={1}
                  />
                </div>
              )}
            </div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
              Preview
            </p>
          </div>
        </div>
      </ToolPanel>
    </div>
  );
}
