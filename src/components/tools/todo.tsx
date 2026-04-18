import { useEffect, useState } from "react";
import { Plus, X, Check } from "lucide-react";
import { ToolPanel } from "./shared";

type Item = { id: string; text: string; done: boolean };
const KEY = "toolshed-todo";

export function Todo() {
  const [items, setItems] = useState<Item[]>([]);
  const [input, setInput] = useState("");

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
    setItems((prev) => [
      { id: crypto.randomUUID(), text: t, done: false },
      ...prev,
    ]);
    setInput("");
  };

  const toggle = (id: string) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  const remove = (id: string) => setItems((p) => p.filter((i) => i.id !== id));

  const done = items.filter((i) => i.done).length;

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
          placeholder="Add a task and press enter…"
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/30"
        />
        <button
          type="submit"
          className="grid h-9 w-9 place-items-center rounded-md bg-foreground text-background transition-colors hover:bg-foreground/90"
        >
          <Plus className="h-4 w-4" />
        </button>
      </form>

      {items.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Nothing on the list. That's a kind of luxury.
        </p>
      ) : (
        <>
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li
                key={item.id}
                className="group flex items-center gap-3 py-2.5"
              >
                <button
                  onClick={() => toggle(item.id)}
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded border transition-colors ${
                    item.done
                      ? "border-moss bg-moss text-background"
                      : "border-border hover:border-foreground/40"
                  }`}
                >
                  {item.done && <Check className="h-3 w-3" strokeWidth={3} />}
                </button>
                <span
                  className={`flex-1 text-sm transition-colors ${
                    item.done ? "text-muted-foreground line-through" : ""
                  }`}
                >
                  {item.text}
                </span>
                <button
                  onClick={() => remove(item.id)}
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Remove"
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-3 font-mono text-xs text-muted-foreground">
            <span>
              {done} / {items.length} done
            </span>
            {done > 0 && (
              <button
                onClick={() => setItems((p) => p.filter((i) => !i.done))}
                className="hover:text-destructive"
              >
                Clear completed
              </button>
            )}
          </div>
        </>
      )}
    </ToolPanel>
  );
}
