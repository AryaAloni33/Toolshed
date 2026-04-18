import { useState, useEffect } from "react";
import { RefreshCw, ArrowRight } from "lucide-react";
import { ToolPanel, FieldLabel, PrimaryButton } from "./shared";

const units = {
  length: {
    meters: 1,
    kilometers: 0.001,
    centimeters: 100,
    millimeters: 1000,
    miles: 0.000621371,
    yards: 1.09361,
    feet: 3.28084,
    inches: 39.3701,
  },
  weight: {
    kilograms: 1,
    grams: 1000,
    milligrams: 1000000,
    pounds: 2.20462,
    ounces: 35.274,
  },
  data: {
    bytes: 1,
    kilobytes: 1 / 1024,
    megabytes: 1 / 1024 ** 2,
    gigabytes: 1 / 1024 ** 3,
    terabytes: 1 / 1024 ** 4,
  },
};

type Category = keyof typeof units;

export function UnitConverter() {
  const [category, setCategory] = useState<Category>("length");
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("meters");
  const [toUnit, setToUnit] = useState("feet");
  const [result, setResult] = useState("");

  const convert = () => {
    const v = parseFloat(value);
    if (isNaN(v)) return;

    const catUnits = units[category] as Record<string, number>;
    const inBase = v / catUnits[fromUnit];
    const final = inBase * catUnits[toUnit];

    setResult(final.toLocaleString(undefined, { maximumFractionDigits: 6 }));
  };

  useEffect(() => {
    // Reset units when category changes
    const first = Object.keys(units[category])[0];
    const second = Object.keys(units[category])[1] || first;
    setFromUnit(first);
    setToUnit(second);
  }, [category]);

  useEffect(() => {
    convert();
  }, [value, fromUnit, toUnit, category]);

  return (
    <div className="space-y-4">
      <ToolPanel>
        <div className="space-y-6">
          <div className="flex gap-2 p-1 bg-muted rounded-md w-fit">
            {(Object.keys(units) as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors",
                  category === cat
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-[1fr,auto,1fr]">
            <div className="space-y-3">
              <FieldLabel>From</FieldLabel>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/30"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none capitalize"
              >
                {Object.keys(units[category]).map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-center pt-8">
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="space-y-3">
              <FieldLabel>To</FieldLabel>
              <div className="rounded-md border border-border bg-muted/20 px-3 py-2">
                <p className="text-sm font-bold truncate">{result || "0"}</p>
              </div>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none capitalize"
              >
                {Object.keys(units[category]).map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </ToolPanel>
    </div>
  );
}

import { cn } from "@/lib/utils";
