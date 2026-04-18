import { JsonFormatter } from "./json-formatter";
import { Base64Tool } from "./base64";
import { UrlEncoder } from "./url-encoder";
import { UuidGenerator } from "./uuid-generator";
import { CaseConverter } from "./case-converter";
import { WordCounter } from "./word-counter";
import { TextCleanup } from "./text-cleanup";
import { ImageResize } from "./image-resize";
import { ImageCompress } from "./image-compress";
import { ImageConvert } from "./image-convert";
import { Notes } from "./notes";
import { Todo } from "./todo";
import { ClipboardHistory } from "./clipboard-history";
import { AiSummarizer } from "./ai-summarizer";
import { AiOcr } from "./ai-ocr";
import { ContentExtractor } from "./content-extractor";
import { PdfMerge } from "./pdf-merge";
import { PdfSplit } from "./pdf-split";
import { PdfCompress } from "./pdf-compress";
import { ZipTool } from "./zip-tool";
import { UnzipTool } from "./unzip-tool";
import { PdfToImage } from "./pdf-to-image";
import { ImagePalette } from "./image-palette";
import { TextSummarizer } from "./text-summarizer";
import { RemoveBackground } from "./remove-background";

export function ToolRenderer({ slug }: { slug: string }) {
  switch (slug) {
    case "json-format": return <JsonFormatter />;
    case "base64": return <Base64Tool />;
    case "url-encode": return <UrlEncoder />;
    case "uuid": return <UuidGenerator />;
    case "case-converter": return <CaseConverter />;
    case "word-counter": return <WordCounter />;
    case "text-cleanup": return <TextCleanup />;
    case "image-resize": return <ImageResize />;
    case "image-compress": return <ImageCompress />;
    case "image-convert": return <ImageConvert />;
    case "notes": return <Notes />;
    case "todo": return <Todo />;
    case "clipboard": return <ClipboardHistory />;
    case "ai-summarize": return <AiSummarizer />;
    case "ocr": return <AiOcr />;
    case "extract-content": return <ContentExtractor />;
    case "merge-pdf": return <PdfMerge />;
    case "split-pdf": return <PdfSplit />;
    case "compress-pdf": return <PdfCompress />;
    case "zip-files": return <ZipTool />;
    case "unzip": return <UnzipTool />;
    case "pdf-to-image": return <PdfToImage />;
    case "image-palette": return <ImagePalette />;
    case "summarizer": return <TextSummarizer />;
    case "remove-background": return <RemoveBackground />;
    default: return null;
  }
}
