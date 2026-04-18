import { Link } from "@tanstack/react-router";
import type { Tool } from "@/lib/tools";
import { categoryTints } from "@/lib/category-tints";
import { cn } from "@/lib/utils";

export function ToolCard({ tool }: { tool: Tool }) {
  const tint = categoryTints[tool.category];

  return (
    <Link
      to="/t/$slug"
      params={{ slug: tool.slug }}
      className="group relative flex flex-col gap-3 overflow-hidden rounded-lg border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-sm"
    >
      {/* color accent bar */}
      <span
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-[3px] opacity-70 transition-opacity group-hover:opacity-100",
          tint.bar,
        )}
      />

      <div className="flex items-start justify-between">
        <span
          className={cn(
            "grid h-10 w-10 place-items-center rounded-md border",
            tint.soft,
            tint.border,
          )}
        >
          <tool.icon className={cn("h-5 w-5", tint.fg)} strokeWidth={1.6} />
        </span>
        {!tool.implemented && (
          <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
            soon
          </span>
        )}
      </div>
      <div>
        <h3 className="font-display text-lg font-semibold leading-tight">
          {tool.name}
        </h3>
        <p className="mt-1.5 text-sm leading-snug text-muted-foreground">
          {tool.description}
        </p>
      </div>
      <span
        className={cn(
          "mt-auto inline-flex items-center gap-1 text-sm font-medium text-foreground/70 transition-colors",
          `group-hover:${tint.fg.replace("text-", "text-")}`,
        )}
      >
        Open →
      </span>
    </Link>
  );
}
