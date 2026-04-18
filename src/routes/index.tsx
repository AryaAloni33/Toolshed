import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Zap, Lock, Layers } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ToolCard } from "@/components/tool-card";
import { categories, tools, getTool } from "@/lib/tools";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { categoryTints } from "@/lib/category-tints";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Toolshed — A calm home for everyday digital tools" },
      {
        name: "description",
        content:
          "PDFs, images, text, code and more — every tool you reach for, in one focused workspace. No login. No clutter.",
      },
      {
        property: "og:title",
        content: "Toolshed — A calm home for everyday digital tools",
      },
      {
        property: "og:description",
        content:
          "PDFs, images, text, code and more — every tool you reach for, in one focused workspace.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { recent } = useRecentTools();
  const recentTools = recent.map(getTool).filter(Boolean) as ReturnType<
    typeof getTool
  > extends infer T
    ? NonNullable<T>[]
    : never;
  const featured = tools.filter((t) => t.implemented).slice(0, 8);

  return (
    <AppShell>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-paper opacity-40" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-moss" />
              v0.1 — 40 tools live
            </span>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              A quiet workshop for{" "}
              <span className="italic text-accent dark:text-[oklch(0.62_0.13_45)]">everyday</span> digital work.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Toolshed gathers the small utilities you keep googling — PDF
              tools, image cleanup, text helpers, JSON, and more — into one
              focused workspace. No accounts. No upsells. Just press{" "}
              <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-mono text-xs">
                ⌘K
              </kbd>{" "}
              and go.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/c/$category"
                params={{ category: "documents" }}
                className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                Browse the shed <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/t/$slug"
                params={{ slug: "json-format" }}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:border-foreground/30"
              >
                Try a tool
              </Link>
            </div>

            <ul className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: Zap,
                  title: "Instant",
                  body: "Drop a file, see a result. No waiting room.",
                },
                {
                  icon: Lock,
                  title: "Local first",
                  body: "Most tools run in your browser. Files don't leave.",
                },
                {
                  icon: Layers,
                  title: "Composable",
                  body: "Chain tools together. Notes remember themselves.",
                },
              ].map((f) => (
                <li key={f.title} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md border border-border bg-card">
                    <f.icon
                      className="h-3.5 w-3.5 text-accent"
                      strokeWidth={1.8}
                    />
                  </span>
                  <div>
                    <div className="text-sm font-medium">{f.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {f.body}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Recent */}
      {recentTools.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-10 md:px-8">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-display text-xl font-semibold">
              Recently used
            </h2>
            <span className="font-mono text-xs text-muted-foreground">
              {recentTools.length} items
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {recentTools.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-8">
        <div className="mb-4 flex items-baseline justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold">Ready to use</h2>
            <p className="text-sm text-muted-foreground">
              Tools that work right now in your browser.
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-8">
        <h2 className="mb-6 font-display text-xl font-semibold">By category</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const count = tools.filter((t) => t.category === c.id).length;
            const tint = categoryTints[c.id];
            return (
              <Link
                key={c.id}
                to="/c/$category"
                params={{ category: c.id }}
                className="group relative flex items-center justify-between overflow-hidden rounded-lg border border-border bg-card p-4 transition-colors hover:border-foreground/25"
              >
                <span
                  className={`pointer-events-none absolute inset-y-0 left-0 w-[3px] ${tint.bar}`}
                />
                <div className="pl-2">
                  <div className="font-display text-base font-semibold">
                    {c.label}
                  </div>
                  <div className="text-xs text-muted-foreground">{c.blurb}</div>
                </div>
                <span className={`font-mono text-xs ${tint.fg}`}>
                  {count} →
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
