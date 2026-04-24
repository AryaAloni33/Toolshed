import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, ArrowRight, LayoutGrid, LayoutList } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ToolCard } from "@/components/tool-card";
import { tools, categories } from "@/lib/tools";
import { cn } from "@/lib/utils";
import { AiToolBot } from "@/components/ai-tool-bot";

export const Route = createFileRoute("/browse")({
    component: BrowseAll,
});

function BrowseAll() {
    const [query, setQuery] = useState("");
    const [view, setView] = useState<"grid" | "list">("grid");

    const filteredTools = useMemo(() => {
        const q = query.toLowerCase().trim();
        if (!q) return tools;
        return tools.filter(
            (t) =>
                t.name.toLowerCase().includes(q) ||
                t.description.toLowerCase().includes(q) ||
                t.category.toLowerCase().includes(q)
        );
    }, [query]);

    const groupedTools = useMemo(() => {
        if (query) return { "Search Results": filteredTools };

        const groups: Record<string, typeof tools> = {};
        categories.forEach(cat => {
            const catTools = tools.filter(t => t.category === cat.id);
            if (catTools.length > 0) {
                groups[cat.label] = catTools;
            }
        });
        return groups;
    }, [filteredTools, query]);

    return (
        <AppShell>
            <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
                <div className="mb-10 text-center">
                    <h1 className="font-display text-4xl font-semibold tracking-tight">
                        All Tools
                    </h1>
                    <p className="mt-3 text-muted-foreground">
                        Every utility in the shed, organized and searchable.
                    </p>
                </div>

                <div className="mb-12 flex justify-center">
                    <AiToolBot />
                </div>

                <div className="sticky top-14 z-20 -mx-4 bg-background/95 px-4 py-4 backdrop-blur md:mx-0 md:px-0">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search tools by name, description, or category..."
                                className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm outline-none transition-colors focus:border-foreground/20"
                            />
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-auto">
                            <button
                                onClick={() => setView("grid")}
                                className={cn(
                                    "grid h-11 w-11 place-items-center rounded-lg border transition-colors",
                                    view === "grid" ? "border-foreground bg-foreground text-background" : "border-border bg-card hover:border-foreground/20"
                                )}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setView("list")}
                                className={cn(
                                    "grid h-11 w-11 place-items-center rounded-lg border transition-colors",
                                    view === "list" ? "border-foreground bg-foreground text-background" : "border-border bg-card hover:border-foreground/20"
                                )}
                            >
                                <LayoutList className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 space-y-12">
                    {Object.entries(groupedTools).map(([groupName, groupTools]) => (
                        <div key={groupName}>
                            <h2 className="mb-6 flex items-center gap-3 font-display text-xl font-semibold">
                                {groupName}
                                <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
                                    {groupTools.length}
                                </span>
                            </h2>

                            {view === "grid" ? (
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    {groupTools.map((t) => (
                                        <ToolCard key={t.slug} tool={t} />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {groupTools.map((t) => (
                                        <Link
                                            key={t.slug}
                                            to="/t/$slug"
                                            params={{ slug: t.slug }}
                                            className="group flex items-center gap-4 rounded-lg border border-border bg-card p-3 transition-all hover:border-foreground/20 hover:shadow-sm"
                                        >
                                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-border bg-muted/20">
                                                <t.icon className="h-5 w-5" strokeWidth={1.75} />
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <div className="text-sm font-medium">{t.name}</div>
                                                <div className="truncate text-xs text-muted-foreground">{t.description}</div>
                                            </div>
                                            <ArrowRight className="h-4 w-4 -translate-x-2 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {filteredTools.length === 0 && (
                        <div className="py-20 text-center">
                            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-muted">
                                <Search className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <h3 className="mt-4 text-sm font-medium">No tools found</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                We couldn't find anything matching "{query}". Try another term.
                            </p>
                            <button
                                onClick={() => setQuery("")}
                                className="mt-6 text-sm font-medium text-foreground underline underline-offset-4"
                            >
                                Clear search
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}
