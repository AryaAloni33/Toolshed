import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  Moon,
  Sun,
  PanelLeftClose,
  PanelLeft,
  LayoutGrid,
  FileText,
  Image as ImageIcon,
  Type,
  Files,
  Brain,
  Code2,
  ListTodo,
  Github,
  Database,
  Activity,
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { CommandPalette } from "./command-palette";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Overview", icon: LayoutGrid },
  { to: "/c/$category", params: { category: "documents" }, label: "Documents", icon: FileText },
  { to: "/c/$category", params: { category: "images" }, label: "Images", icon: ImageIcon },
  { to: "/c/$category", params: { category: "text" }, label: "Text", icon: Type },
  { to: "/c/$category", params: { category: "ai" }, label: "AI", icon: Brain },
  { to: "/c/$category", params: { category: "developer" }, label: "Developer", icon: Code2 },
  { to: "/c/$category", params: { category: "productivity" }, label: "Productivity", icon: ListTodo },
  { to: "/c/$category", params: { category: "data" }, label: "Data", icon: Database },
  { to: "/c/$category", params: { category: "reference" }, label: "Reference", icon: Activity },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 md:flex",
          collapsed ? "w-[68px]" : "w-[244px]",
        )}
      >
        <div className="flex h-14 items-center gap-2 px-4">
          <Link to="/" className="flex items-center gap-2 overflow-hidden">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background font-display text-base font-semibold">
              t
            </span>
            {!collapsed && (
              <span className="font-display text-[17px] font-semibold tracking-tight">
                Toolshed
              </span>
            )}
          </Link>
        </div>

        <nav className="flex-1 space-y-0.5 px-2 py-2">
          {nav.map((item) => {
            const hasParams = "params" in item;
            const active = pathname === item.to || (hasParams && pathname.includes((item as any).params.category));
            return (
              <Link
                key={item.label}
                to={item.to}
                params={hasParams ? (item as any).params : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-2">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/60"
          >
            {collapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur md:px-8">
          <button
            onClick={() => setPaletteOpen(true)}
            className="group flex h-9 flex-1 items-center gap-2 rounded-md border border-border bg-card px-3 text-left text-sm text-muted-foreground transition-colors hover:border-foreground/20 max-w-md"
          >
            <Search className="h-4 w-4" strokeWidth={1.75} />
            <span className="flex-1 truncate">Search every tool…</span>
            <kbd className="hidden rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
              ⌘K
            </kbd>
          </button>

          <div className="ml-auto flex items-center gap-1">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" strokeWidth={1.75} />
            </a>
            <button
              onClick={toggle}
              className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border px-4 py-6 text-xs text-muted-foreground md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>
              © {new Date().getFullYear()} Toolshed — built for focused work.
            </span>
            <span className="font-mono">v0.1 · made with care</span>
          </div>
        </footer>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
