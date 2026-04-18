import { useState, useEffect } from "react";
import { Clock, RefreshCw, Copy } from "lucide-react";
import {
  ToolPanel,
  PrimaryButton,
  GhostButton,
  FieldLabel,
  CopyButton,
} from "./shared";
import { toast } from "sonner";

export function UnixTimestamp() {
  const [timestamp, setTimestamp] = useState(
    Math.floor(Date.now() / 1000).toString(),
  );
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      // update current time? maybe not automatically to avoid jumping while editing
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toDate = () => {
    try {
      const ms =
        timestamp.length > 11
          ? parseInt(timestamp)
          : parseInt(timestamp) * 1000;
      const newDate = new Date(ms);
      if (isNaN(newDate.getTime())) throw new Error();
      setDate(newDate);
    } catch (e) {
      toast.error("Invalid timestamp");
    }
  };

  const toTimestamp = (d: Date) => {
    setTimestamp(Math.floor(d.getTime() / 1000).toString());
    setDate(d);
  };

  return (
    <div className="space-y-4">
      <ToolPanel>
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-accent" />
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Current Unix Epoch
                </span>
                <p className="font-mono text-lg">
                  {Math.floor(Date.now() / 1000)}
                </p>
              </div>
            </div>
            <GhostButton onClick={() => toTimestamp(new Date())}>
              <RefreshCw className="h-4 w-4" />
              Use Current Time
            </GhostButton>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <FieldLabel>Unix Timestamp</FieldLabel>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  placeholder="e.g. 1713434121"
                  className="flex-1 rounded-md border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-foreground/30"
                />
                <PrimaryButton onClick={toDate}>Convert</PrimaryButton>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Supports both seconds and milliseconds
              </p>
            </div>

            <div className="space-y-3">
              <FieldLabel>Human Readable (Local)</FieldLabel>
              <div className="rounded-md border border-border bg-muted/20 px-3 py-2">
                <p className="text-sm font-medium">{date.toLocaleString()}</p>
              </div>
              <div className="flex justify-between items-center text-[10px] text-muted-foreground px-1">
                <span>{date.toUTCString()}</span>
              </div>
            </div>
          </div>
        </div>
      </ToolPanel>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "ISO 8601", value: date.toISOString() },
          {
            label: "Seconds",
            value: Math.floor(date.getTime() / 1000).toString(),
          },
          { label: "Milliseconds", value: date.getTime().toString() },
        ].map((item) => (
          <ToolPanel key={item.label} className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase text-muted-foreground">
                {item.label}
              </span>
              <CopyButton value={item.value} />
            </div>
            <p className="font-mono text-xs truncate" title={item.value}>
              {item.value}
            </p>
          </ToolPanel>
        ))}
      </div>
    </div>
  );
}
