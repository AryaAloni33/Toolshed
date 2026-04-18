import { useEffect, useState } from "react";
import { Plus, X, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { ToolPanel } from "./shared";

type Snip = { id: string; text: string; at: number };
const KEY = "toolshed-clipboard";

export function ClipboardHistory() {
  const [items, setItems] = useState<Snip[]>([]);
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const add = () => {
    const t = input.trim();
    if (!t) return;
    setItems((p) =>
      [{ id: crypto.randomUUID(), text: t, at: Date.now() }, ...p].slice(0, 50),
    );
    setInput("");
  };

  const copy = async (snip: Snip) => {
    try {
      await navigator.clipboard.writeText(snip.text);
      setCopiedId(snip.id);
      toast.success("Copied");
      setTimeout(() => setCopiedId(null), 1000);
    } catch {
      toast.error("Couldn't copy");
    }
  };

  return (
    <ToolPanel>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
        className="mb-4 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Save a snippet you'll need again…"
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/30"
        />
        <button
          type="submit"
          className="grid h-9 w-9 place-items-center rounded-md bg-foreground text-background hover:bg-foreground/90"
        >
          <Plus className="h-4 w-4" />
        </button>
      </form>

      {items.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Stash signatures, snippets, repeated text. Stays here, only here.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((snip) => (
            <li
              key={snip.id}
              className="group flex items-start gap-3 rounded-md border border-border bg-background p-3"
            >
              <pre className="flex-1 whitespace-pre-wrap break-words font-mono text-sm leading-relaxed">
                {snip.text}
              </pre>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => copy(snip)}
                  className="grid h-7 w-7 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {copiedId === snip.id ? (
                    <Check className="h-3.5 w-3.5 text-moss" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  onClick={() =>
                    setItems((p) => p.filter((i) => i.id !== snip.id))
                  }
                  className="grid h-7 w-7 place-items-center rounded text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-destructive group-hover:opacity-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </ToolPanel>
  );
}
