import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { ChevronRight, Construction } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { getTool, categories } from "@/lib/tools";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { ToolRenderer } from "@/components/tools/tool-renderer";

export const Route = createFileRoute("/t/$slug")({
  loader: ({ params }) => {
    const tool = getTool(params.slug);
    if (!tool) throw notFound();
    return { tool };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.tool.name ?? "Tool"} — Toolshed` },
      { name: "description", content: loaderData?.tool.description ?? "" },
      {
        property: "og:title",
        content: `${loaderData?.tool.name ?? "Tool"} — Toolshed`,
      },
      {
        property: "og:description",
        content: loaderData?.tool.description ?? "",
      },
    ],
  }),
  component: ToolPage,
  notFoundComponent: () => (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">Tool not found</h1>
        <Link to="/" className="mt-6 inline-block text-accent underline">
          Back to overview
        </Link>
      </div>
    </AppShell>
  ),
});

function ToolPage() {
  const { tool } = Route.useLoaderData();
  const { push } = useRecentTools();
  const cat = categories.find((c) => c.id === tool.category);

  useEffect(() => {
    push(tool.slug);
  }, [tool.slug, push]);

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
        <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Overview
          </Link>
          <ChevronRight className="h-3 w-3" />
          {cat && (
            <>
              <Link
                to="/c/$category"
                params={{ category: cat.id }}
                className="hover:text-foreground"
              >
                {cat.label}
              </Link>
              <ChevronRight className="h-3 w-3" />
            </>
          )}
          <span className="text-foreground">{tool.name}</span>
        </nav>

        <header className="mb-8 flex items-start gap-4 border-b border-border pb-6">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-border bg-card">
            <tool.icon className="h-5 w-5 text-accent" strokeWidth={1.6} />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight">
              {tool.name}
            </h1>
            <p className="mt-1 text-muted-foreground">{tool.description}</p>
          </div>
        </header>

        {tool.implemented ? (
          <ToolRenderer slug={tool.slug} />
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center">
            <Construction
              className="mx-auto h-8 w-8 text-muted-foreground"
              strokeWidth={1.5}
            />
            <h2 className="mt-4 font-display text-xl font-semibold">
              In the workshop
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              This tool is sketched out but not built yet. The interface, the
              keybindings, the file flow — all coming. In the meantime, try one
              of the live tools.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:border-foreground/30"
            >
              Browse live tools
            </Link>
          </div>
        )}
      </div>
    </AppShell>
  );
}
