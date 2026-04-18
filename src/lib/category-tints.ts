export type CategoryTintKey =
  | "documents" | "images" | "text" | "files" | "ai" | "developer" | "productivity";

export type CategoryTint = {
  fg: string;
  soft: string;
  border: string;
  bar: string;
};

export const categoryTints: Record<CategoryTintKey, CategoryTint> = {
  documents:    { fg: "text-tint-doc",  soft: "bg-tint-doc-soft",  border: "border-tint-doc/30",  bar: "bg-tint-doc" },
  images:       { fg: "text-tint-img",  soft: "bg-tint-img-soft",  border: "border-tint-img/30",  bar: "bg-tint-img" },
  text:         { fg: "text-tint-text", soft: "bg-tint-text-soft", border: "border-tint-text/30", bar: "bg-tint-text" },
  files:        { fg: "text-tint-file", soft: "bg-tint-file-soft", border: "border-tint-file/30", bar: "bg-tint-file" },
  ai:           { fg: "text-tint-ai",   soft: "bg-tint-ai-soft",   border: "border-tint-ai/30",   bar: "bg-tint-ai" },
  developer:    { fg: "text-tint-dev",  soft: "bg-tint-dev-soft",  border: "border-tint-dev/30",  bar: "bg-tint-dev" },
  productivity: { fg: "text-tint-prod", soft: "bg-tint-prod-soft", border: "border-tint-prod/30", bar: "bg-tint-prod" },
};
