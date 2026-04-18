import { useState, useMemo } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { FileText, Eye, Code } from "lucide-react";
import { ToolPanel, FieldLabel, GhostButton } from "./shared";
import { cn } from "@/lib/utils";

export function MarkdownPreview() {
  const [text, setText] = useState(
    "# Hello Markdown\n\nEdit this text to see the preview.\n\n- List item 1\n- List item 2\n\n> Blockquote\n\n`code snippet`\n\n```js\nconsole.log('Hello World');\n```",
  );
  const [mode, setMode] = useState<"edit" | "preview" | "split">("split");

  const html = useMemo(() => {
    return DOMPurify.sanitize(marked.parse(text) as string);
  }, [text]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <GhostButton
          onClick={() => setMode("edit")}
          className={cn(mode === "edit" && "bg-muted")}
        >
          <Code className="h-4 w-4" />
          Edit
        </GhostButton>
        <GhostButton
          onClick={() => setMode("preview")}
          className={cn(mode === "preview" && "bg-muted")}
        >
          <Eye className="h-4 w-4" />
          Preview
        </GhostButton>
        <GhostButton
          onClick={() => setMode("split")}
          className={cn(mode === "split" && "bg-muted")}
        >
          <Columns className="h-4 w-4" />
          Split
        </GhostButton>
      </div>

      <ToolPanel className="p-0 overflow-hidden">
        <div
          className={cn(
            "grid min-h-[500px]",
            mode === "split" ? "md:grid-cols-2" : "grid-cols-1",
          )}
        >
          {(mode === "edit" || mode === "split") && (
            <div
              className={cn(
                "border-r border-border p-4",
                mode === "edit" ? "w-full" : "",
              )}
            >
              <FieldLabel>Markdown</FieldLabel>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="h-[calc(100%-2rem)] w-full resize-none border-none bg-transparent font-mono text-sm outline-none"
                placeholder="Write your markdown here..."
              />
            </div>
          )}
          {(mode === "preview" || mode === "split") && (
            <div
              className={cn(
                "p-4 prose prose-sm prose-neutral dark:prose-invert max-w-none overflow-y-auto",
                mode === "preview" ? "w-full" : "",
              )}
            >
              <FieldLabel>Preview</FieldLabel>
              <div
                dangerouslySetInnerHTML={{ __html: html }}
                className="markdown-content"
              />
            </div>
          )}
        </div>
      </ToolPanel>
    </div>
  );
}

// Add these to styles.css or similar if not present, but for now we'll rely on local styling
import { Columns } from "lucide-react";
