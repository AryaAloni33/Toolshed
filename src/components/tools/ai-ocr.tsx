import { useState } from "react";
import { ScanText, Loader2, Upload, X } from "lucide-react";
import { CopyButton, ToolPanel, PrimaryButton, FieldLabel } from "./shared";
import { toast } from "sonner";

export function AiOcr() {
  const [image, setImage] = useState<string | null>(null);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast.error("Image too large. Please use an image under 4MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOcr = async () => {
    if (!image) {
      toast.error("Please upload an image first");
      return;
    }

    setLoading(true);
    try {
      const base64Content = image.split(",")[1];
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.2-11b-vision-preview",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: "Please transcribe all the text found in this image. Keep the formatting exactly as it appears. If there are tables, represent them using markdown tables. ONLY return the transcribed text, nothing else.",
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: `data:image/jpeg;base64,${base64Content}`,
                    },
                  },
                ],
              },
            ],
            temperature: 0.1,
            max_tokens: 2048,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || "Failed to fetch from Groq",
        );
      }

      const data = await response.json();
      setOutput(data.choices[0].message.content);
      toast.success("Text extracted!");
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.message ||
          "Something went wrong. Vision models might not be available or the image is unsupported.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <ToolPanel>
        <FieldLabel>Upload Scan or Document Image</FieldLabel>
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-background p-8 transition-colors hover:border-foreground/20">
          {image ? (
            <div className="relative w-full max-w-sm">
              <img
                src={image}
                alt="Upload preview"
                className="rounded-md shadow-sm border border-border"
              />
              <button
                onClick={() => setImage(null)}
                className="absolute -right-2 -top-2 rounded-full bg-foreground p-1 text-background shadow-md hover:bg-foreground/80 transition-colors"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center text-center">
              <div className="mb-3 rounded-full bg-muted p-3">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium">
                Click to upload or drag and drop
              </span>
              <span className="mt-1 text-xs text-muted-foreground">
                Supports JPG, PNG, WEBP (Max 4MB)
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <PrimaryButton onClick={handleOcr} disabled={loading || !image}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Extracting...
              </>
            ) : (
              <>
                <ScanText className="h-4 w-4" />
                Extract Text
              </>
            )}
          </PrimaryButton>
        </div>
      </ToolPanel>

      {output && (
        <ToolPanel animate-in fade-in duration-500>
          <div className="mb-3 flex items-center justify-between">
            <FieldLabel>OCR Results</FieldLabel>
            <CopyButton value={output} />
          </div>
          <div className="rounded-md border border-border bg-background p-4 font-mono text-sm whitespace-pre-wrap leading-relaxed">
            {output}
          </div>
        </ToolPanel>
      )}
    </div>
  );
}
