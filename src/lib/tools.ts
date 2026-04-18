import {
  FileText, Scissors, Combine, Minimize2, FileImage, FileType2,
  Image as ImageIcon, Crop, Eraser, Palette,
  Type, AlignLeft, Hash, Sparkles,
  Archive, FileArchive, RefreshCw,
  Brain, ScanText, BookOpen,
  Braces, Binary, Link2, KeyRound,
  StickyNote, Clipboard, ListChecks,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ToolCategory =
  | "documents"
  | "images"
  | "text"
  | "files"
  | "ai"
  | "developer"
  | "productivity";

export interface Tool {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: ToolCategory;
  tint: "rust" | "moss" | "clay" | "ink";
  implemented?: boolean;
  acceptsFileType?: string;
}

export const categories: { id: ToolCategory; label: string; blurb: string }[] = [
  { id: "documents", label: "Documents", blurb: "PDFs, Word, Excel" },
  { id: "images", label: "Images", blurb: "Resize, convert, clean" },
  { id: "text", label: "Text", blurb: "Edit, count, transform" },
  { id: "files", label: "Files", blurb: "Convert, archive" },
  { id: "ai", label: "AI", blurb: "Summarize, extract" },
  { id: "developer", label: "Developer", blurb: "Encode, format" },
  { id: "productivity", label: "Productivity", blurb: "Notes, lists" },
];

export const tools: Tool[] = [
  // Documents
  { slug: "merge-pdf", name: "Merge PDF", description: "Combine PDFs in the order you want.", icon: Combine, category: "documents", tint: "rust", acceptsFileType: "application/pdf" },
  { slug: "split-pdf", name: "Split PDF", description: "Pull pages out of a PDF into new files.", icon: Scissors, category: "documents", tint: "rust" },
  { slug: "compress-pdf", name: "Compress PDF", description: "Reduce file size while keeping quality.", icon: Minimize2, category: "documents", tint: "rust" },
  { slug: "pdf-to-image", name: "PDF → Image", description: "Convert each page to JPG or PNG.", icon: FileImage, category: "documents", tint: "rust" },
  { slug: "word-to-pdf", name: "Word → PDF", description: "Export .docx to a clean PDF.", icon: FileType2, category: "documents", tint: "rust" },
  { slug: "excel-to-pdf", name: "Excel → PDF", description: "Render spreadsheets as PDFs.", icon: FileText, category: "documents", tint: "rust" },

  // Images
  { slug: "image-resize", name: "Resize image", description: "Set new width and height in pixels.", icon: Crop, category: "images", tint: "moss", implemented: true },
  { slug: "image-compress", name: "Compress image", description: "Lossy compression with a quality slider.", icon: Minimize2, category: "images", tint: "moss", implemented: true },
  { slug: "image-convert", name: "Convert format", description: "Switch between JPG, PNG, and WebP.", icon: RefreshCw, category: "images", tint: "moss", implemented: true },
  { slug: "remove-background", name: "Remove background", description: "Clean cutouts using on-device AI.", icon: Eraser, category: "images", tint: "moss" },
  { slug: "image-palette", name: "Extract palette", description: "Pull dominant colors from any image.", icon: Palette, category: "images", tint: "moss" },

  // Text
  { slug: "case-converter", name: "Case converter", description: "UPPER, lower, Title, camelCase…", icon: Type, category: "text", tint: "clay", implemented: true },
  { slug: "word-counter", name: "Word counter", description: "Words, characters, reading time.", icon: Hash, category: "text", tint: "clay", implemented: true },
  { slug: "text-cleanup", name: "Text cleanup", description: "Strip extra spaces, line breaks, tabs.", icon: AlignLeft, category: "text", tint: "clay", implemented: true },
  { slug: "summarizer", name: "Summarizer", description: "Condense long passages to key points.", icon: Sparkles, category: "text", tint: "clay" },

  // Files
  { slug: "file-convert", name: "File converter", description: "Convert across common file formats.", icon: RefreshCw, category: "files", tint: "ink" },
  { slug: "zip-files", name: "Zip files", description: "Bundle a folder into a single archive.", icon: Archive, category: "files", tint: "ink" },
  { slug: "unzip", name: "Unzip", description: "Extract files from any .zip archive.", icon: FileArchive, category: "files", tint: "ink" },

  // AI
  { slug: "ai-summarize", name: "AI summary", description: "Document → key bullets in seconds.", icon: Brain, category: "ai", tint: "rust", implemented: true },
  { slug: "ocr", name: "OCR", description: "Pull text out of scans and photos.", icon: ScanText, category: "ai", tint: "rust", implemented: true },
  { slug: "extract-content", name: "Content extractor", description: "Get clean article text from any URL.", icon: BookOpen, category: "ai", tint: "rust", implemented: true },

  // Developer
  { slug: "json-format", name: "JSON formatter", description: "Pretty print, validate, minify.", icon: Braces, category: "developer", tint: "moss", implemented: true },
  { slug: "base64", name: "Base64", description: "Encode and decode Base64 strings.", icon: Binary, category: "developer", tint: "moss", implemented: true },
  { slug: "url-encode", name: "URL encoder", description: "Encode and decode URL components.", icon: Link2, category: "developer", tint: "moss", implemented: true },
  { slug: "uuid", name: "UUID generator", description: "Create random v4 UUIDs.", icon: KeyRound, category: "developer", tint: "moss", implemented: true },

  // Productivity
  { slug: "notes", name: "Quick notes", description: "Local notes that stay between visits.", icon: StickyNote, category: "productivity", tint: "clay", implemented: true },
  { slug: "todo", name: "To-do", description: "A simple list. Nothing in the way.", icon: ListChecks, category: "productivity", tint: "clay", implemented: true },
  { slug: "clipboard", name: "Clipboard history", description: "Stash snippets you reach for often.", icon: Clipboard, category: "productivity", tint: "clay", implemented: true },
];

export function getTool(slug: string) {
  return tools.find((t) => t.slug === slug);
}

export function toolsByCategory(category: ToolCategory) {
  return tools.filter((t) => t.category === category);
}
