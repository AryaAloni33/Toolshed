import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ToolCard } from "@/components/tool-card";
import { categories, toolsByCategory, type ToolCategory } from "@/lib/tools";

export const Route = createFileRoute("/c/$category")({
  loader: ({ params }) => {
    const cat = categories.find((c) => c.id === params.category);
    if (!cat) throw notFound();
    return { category: cat };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.category.label ?? "Tools"} — Toolshed` },
      {
        name: "description",
        content: `${loaderData?.category.label} tools on Toolshed: ${loaderData?.category.blurb}.`,
      },
      {
        property: "og:title",
        content: `${loaderData?.category.label ?? "Tools"} — Toolshed`,
      },
      {
        property: "og:description",
        content: `${loaderData?.category.label} tools on Toolshed: ${loaderData?.category.blurb}.`,
      },
    ],
  }),
  component: CategoryPage,
  notFoundComponent: () => (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">
          Category not found
        </h1>
        <p className="mt-2 text-muted-foreground">That shelf is empty.</p>
        <Link to="/" className="mt-6 inline-block text-accent underline">
          Back to overview
        </Link>
      </div>
    </AppShell>
  ),
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const list = toolsByCategory(category.id as ToolCategory);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
        <div className="mb-8 flex items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Category
            </div>
            <h1 className="mt-1 font-display text-4xl font-semibold tracking-tight">
              {category.label}
            </h1>
            <p className="mt-1 text-muted-foreground">{category.blurb}</p>
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {list.length} tools
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
