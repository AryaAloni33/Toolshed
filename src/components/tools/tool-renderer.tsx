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
import { QrGenerator } from "./qr-generator";
import { PasswordGenerator } from "./password-generator";
import { DiffChecker } from "./diff-checker";
import { UnixTimestamp } from "./unix-timestamp";
import { LoremIpsum } from "./lorem-ipsum";
import { MarkdownPreview } from "./markdown-preview";
import { UnitConverter } from "./unit-converter";
import { HashGenerator } from "./hash-generator";
import { JwtDecoder } from "./jwt-decoder";
import { CsvJsonConverter } from "./csv-json-converter";
import { SqlFormatter } from "./sql-formatter";
import { PercentageCalculator } from "./percentage-calculator";
import { HttpStatusCodes } from "./http-status-codes";
import { RegexTester } from "./regex-tester";
import { Base64ImageEncoder } from "./base64-image-encoder";

export function ToolRenderer({ slug }: { slug: string }) {
  switch (slug) {
    case "json-format":
      return <JsonFormatter />;
    case "base64":
      return <Base64Tool />;
    case "url-encode":
      return <UrlEncoder />;
    case "uuid":
      return <UuidGenerator />;
    case "case-converter":
      return <CaseConverter />;
    case "word-counter":
      return <WordCounter />;
    case "text-cleanup":
      return <TextCleanup />;
    case "image-resize":
      return <ImageResize />;
    case "image-compress":
      return <ImageCompress />;
    case "image-convert":
      return <ImageConvert />;
    case "notes":
      return <Notes />;
    case "todo":
      return <Todo />;
    case "clipboard":
      return <ClipboardHistory />;
    case "ai-summarize":
      return <AiSummarizer />;
    case "ocr":
      return <AiOcr />;
    case "extract-content":
      return <ContentExtractor />;
    case "merge-pdf":
      return <PdfMerge />;
    case "split-pdf":
      return <PdfSplit />;
    case "compress-pdf":
      return <PdfCompress />;
    case "zip-files":
      return <ZipTool />;
    case "unzip":
      return <UnzipTool />;
    case "pdf-to-image":
      return <PdfToImage />;
    case "image-palette":
      return <ImagePalette />;
    case "summarizer":
      return <TextSummarizer />;
    case "remove-background":
      return <RemoveBackground />;
    case "qr-generator":
      return <QrGenerator />;
    case "password-gen":
      return <PasswordGenerator />;
    case "diff-checker":
      return <DiffChecker />;
    case "unix-timestamp":
      return <UnixTimestamp />;
    case "lorem-ipsum": return <LoremIpsum />;
    case "markdown-preview": return <MarkdownPreview />;
    case "unit-converter": return <UnitConverter />;
    case "hash-generator": return <HashGenerator />;
    case "jwt-decoder": return <JwtDecoder />;
    case "csv-json": return <CsvJsonConverter />;
    case "sql-format": return <SqlFormatter />;
    case "percentage-calc": return <PercentageCalculator />;
    case "http-codes": return <HttpStatusCodes />;
    case "regex-tester": return <RegexTester />;
    case "base64-image": return <Base64ImageEncoder />;
    default: return null;
  }
}
