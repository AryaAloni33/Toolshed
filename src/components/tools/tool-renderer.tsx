import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// Use a map for cleaner lazy loading
const toolsMap: Record<string, any> = {
  "json-format": lazy(() => import("./json-formatter").then(m => ({ default: m.JsonFormatter }))),
  "base64": lazy(() => import("./base64").then(m => ({ default: m.Base64Tool }))),
  "url-encode": lazy(() => import("./url-encoder").then(m => ({ default: m.UrlEncoder }))),
  "uuid": lazy(() => import("./uuid-generator").then(m => ({ default: m.UuidGenerator }))),
  "case-converter": lazy(() => import("./case-converter").then(m => ({ default: m.CaseConverter }))),
  "word-counter": lazy(() => import("./word-counter").then(m => ({ default: m.WordCounter }))),
  "text-cleanup": lazy(() => import("./text-cleanup").then(m => ({ default: m.TextCleanup }))),
  "image-resize": lazy(() => import("./image-resize").then(m => ({ default: m.ImageResize }))),
  "image-compress": lazy(() => import("./image-compress").then(m => ({ default: m.ImageCompress }))),
  "image-convert": lazy(() => import("./image-convert").then(m => ({ default: m.ImageConvert }))),
  "notes": lazy(() => import("./notes").then(m => ({ default: m.Notes }))),
  "todo": lazy(() => import("./todo").then(m => ({ default: m.Todo }))),
  "clipboard": lazy(() => import("./clipboard-history").then(m => ({ default: m.ClipboardHistory }))),
  "ai-summarize": lazy(() => import("./ai-summarizer").then(m => ({ default: m.AiSummarizer }))),
  "ocr": lazy(() => import("./ai-ocr").then(m => ({ default: m.AiOcr }))),
  "extract-content": lazy(() => import("./content-extractor").then(m => ({ default: m.ContentExtractor }))),
  "zip-files": lazy(() => import("./zip-tool").then(m => ({ default: m.ZipTool }))),
  "unzip": lazy(() => import("./unzip-tool").then(m => ({ default: m.UnzipTool }))),
  "image-palette": lazy(() => import("./image-palette").then(m => ({ default: m.ImagePalette }))),
  "summarizer": lazy(() => import("./text-summarizer").then(m => ({ default: m.TextSummarizer }))),
  "remove-background": lazy(() => import("./remove-background").then(m => ({ default: m.RemoveBackground }))),
  "qr-generator": lazy(() => import("./qr-generator").then(m => ({ default: m.QrGenerator }))),
  "password-gen": lazy(() => import("./password-generator").then(m => ({ default: m.PasswordGenerator }))),
  "diff-checker": lazy(() => import("./diff-checker").then(m => ({ default: m.DiffChecker }))),
  "unix-timestamp": lazy(() => import("./unix-timestamp").then(m => ({ default: m.UnixTimestamp }))),
  "lorem-ipsum": lazy(() => import("./lorem-ipsum").then(m => ({ default: m.LoremIpsum }))),
  "markdown-preview": lazy(() => import("./markdown-preview").then(m => ({ default: m.MarkdownPreview }))),
  "unit-converter": lazy(() => import("./unit-converter").then(m => ({ default: m.UnitConverter }))),
  "hash-generator": lazy(() => import("./hash-generator").then(m => ({ default: m.HashGenerator }))),
  "jwt-decoder": lazy(() => import("./jwt-decoder").then(m => ({ default: m.JwtDecoder }))),
  "csv-json": lazy(() => import("./csv-json-converter").then(m => ({ default: m.CsvJsonConverter }))),
  "sql-format": lazy(() => import("./sql-formatter").then(m => ({ default: m.SqlFormatter }))),
  "percentage-calc": lazy(() => import("./percentage-calculator").then(m => ({ default: m.PercentageCalculator }))),
  "http-codes": lazy(() => import("./http-status-codes").then(m => ({ default: m.HttpStatusCodes }))),
  "regex-tester": lazy(() => import("./regex-tester").then(m => ({ default: m.RegexTester }))),
  "base64-image": lazy(() => import("./base64-image-encoder").then(m => ({ default: m.Base64ImageEncoder }))),
  "cron-explainer": lazy(() => import("./cron-explainer").then(m => ({ default: m.CronExplainer }))),
  "git-cheatsheet": lazy(() => import("./git-cheatsheet").then(m => ({ default: m.GitCheatsheet }))),
  "color-converter": lazy(() => import("./color-converter").then(m => ({ default: m.ColorConverter }))),
  "bcrypt-generator": lazy(() => import("./bcrypt-generator").then(m => ({ default: m.BcryptGenerator }))),
  "text-to-latex": lazy(() => import("./text-to-latex").then(m => ({ default: m.TextToLatex }))),
  "api-client": lazy(() => import("./api-client").then(m => ({ default: m.ApiClient }))),
  "ai-regex-explainer": lazy(() => import("./ai-regex-explainer").then(m => ({ default: m.AiRegexExplainer }))),
  "ai-commit-gen": lazy(() => import("./ai-commit-generator").then(m => ({ default: m.AiCommitGenerator }))),
  "html-to-jsx": lazy(() => import("./html-to-jsx").then(m => ({ default: m.HtmlToJsx }))),
  "css-to-tailwind": lazy(() => import("./css-to-tailwind").then(m => ({ default: m.CssToTailwind }))),
  "favicon-gen": lazy(() => import("./favicon-generator").then(m => ({ default: m.FaviconGenerator }))),
  "svg-to-jsx": lazy(() => import("./svg-to-jsx").then(m => ({ default: m.SvgToJsx }))),
  "shadow-gen": lazy(() => import("./shadow-generator").then(m => ({ default: m.ShadowGenerator }))),
  "css-clamp": lazy(() => import("./css-clamp-generator").then(m => ({ default: m.CssClampGenerator }))),
  "ai-palette": lazy(() => import("./ai-color-scout").then(m => ({ default: m.AiColorScout }))),
  "aspect-ratio": lazy(() => import("./aspect-ratio-calculator").then(m => ({ default: m.AspectRatioCalculator }))),
  "title-suggester": lazy(() => import("./title-suggester").then(m => ({ default: m.TitleSuggester }))),
  "api-load-tester": lazy(() => import("./api-load-tester").then(m => ({ default: m.ApiLoadTester }))),
  "animation-visualizer": lazy(() => import("./animation-visualizer").then(m => ({ default: m.AnimationVisualizer }))),
  "ai-sql-gen": lazy(() => import("./ai-sql-generator").then(m => ({ default: m.AiSqlGenerator }))),
  "ai-prompt-builder": lazy(() => import("./ai-system-prompt-builder").then(m => ({ default: m.AiSystemPromptBuilder }))),
  "glassmorphism-gen": lazy(() => import("./glassmorphism-generator").then(m => ({ default: m.GlassmorphismGenerator }))),
};

export function ToolRenderer({ slug }: { slug: string }) {
  const Component = toolsMap[slug];

  if (!Component) return null;

  return (
    <Suspense
      fallback={
        <div className="flex h-[400px] w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card/50">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/40" strokeWidth={1.5} />
          <p className="text-sm text-muted-foreground/60 font-medium">Preparing your tool...</p>
        </div>
      }
    >
      <Component />
    </Suspense>
  );
}

