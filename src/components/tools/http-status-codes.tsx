import { useState } from "react";
import { List, Search, ExternalLink } from "lucide-react";
import { ToolPanel, FieldLabel } from "./shared";
import { cn } from "@/lib/utils";

const codes = [
    { code: 100, phrase: "Continue", desc: "The server has received the request headers and the client should proceed to send the request body." },
    { code: 101, phrase: "Switching Protocols", desc: "The requester has asked the server to switch protocols." },
    { code: 200, phrase: "OK", desc: "Standard response for successful HTTP requests." },
    { code: 201, phrase: "Created", desc: "The request has been fulfilled, resulting in the creation of a new resource." },
    { code: 202, phrase: "Accepted", desc: "The request has been accepted for processing, but the processing has not been completed." },
    { code: 204, phrase: "No Content", desc: "The server successfully processed the request and is not returning any content." },
    { code: 301, phrase: "Moved Permanently", desc: "This and all future requests should be directed to the given URI." },
    { code: 302, phrase: "Found", desc: "The resource was found, but at a different URI temporarily." },
    { code: 304, phrase: "Not Modified", desc: "Indicates that the resource has not been modified since the version specified by the request headers." },
    { code: 400, phrase: "Bad Request", desc: "The server cannot or will not process the request due to an apparent client error." },
    { code: 401, phrase: "Unauthorized", desc: "Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided." },
    { code: 403, phrase: "Forbidden", desc: "The request contained valid data and was understood by the server, but the server is refusing action." },
    { code: 404, phrase: "Not Found", desc: "The requested resource could not be found but may be available in the future." },
    { code: 405, phrase: "Method Not Allowed", desc: "A request method is not supported for the requested resource." },
    { code: 408, phrase: "Request Timeout", desc: "The server timed out waiting for the request." },
    { code: 429, phrase: "Too Many Requests", desc: "The user has sent too many requests in a given amount of time." },
    { code: 500, phrase: "Internal Server Error", desc: "A generic error message, given when an unexpected condition was encountered." },
    { code: 501, phrase: "Not Implemented", desc: "The server either does not recognize the request method, or it lacks the ability to fulfil the request." },
    { code: 502, phrase: "Bad Gateway", desc: "The server was acting as a gateway or proxy and received an invalid response from the upstream server." },
    { code: 503, phrase: "Service Unavailable", desc: "The server cannot handle the request (because it is overloaded or down for maintenance)." },
    { code: 504, phrase: "Gateway Timeout", desc: "The server was acting as a gateway or proxy and did not receive a timely response from the upstream server." },
];

export function HttpStatusCodes() {
    const [search, setSearch] = useState("");

    const filtered = codes.filter(c =>
        c.code.toString().includes(search) ||
        c.phrase.toLowerCase().includes(search.toLowerCase())
    );

    const getBadgeColor = (code: number) => {
        if (code >= 500) return "bg-red-500/10 text-red-600 border-red-500/20";
        if (code >= 400) return "bg-orange-500/10 text-orange-600 border-orange-500/20";
        if (code >= 300) return "bg-blue-500/10 text-blue-600 border-blue-500/20";
        if (code >= 200) return "bg-green-500/10 text-green-600 border-green-500/20";
        return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    };

    return (
        <div className="space-y-4">
            <ToolPanel>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search code or name (e.g. 404, Not Found)..."
                        className="w-full rounded-md border border-border bg-background pl-10 pr-4 py-2 text-sm outline-none focus:border-foreground/30 shadow-sm"
                    />
                </div>
            </ToolPanel>

            <div className="grid gap-3">
                {filtered.map((item) => (
                    <div
                        key={item.code}
                        className="flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:border-foreground/20 hover:shadow-sm"
                    >
                        <span className={cn(
                            "shrink-0 rounded px-2 py-1 font-mono text-sm font-bold border",
                            getBadgeColor(item.code)
                        )}>
                            {item.code}
                        </span>
                        <div className="min-w-0 flex-1">
                            <h4 className="font-display font-semibold text-foreground tracking-tight">{item.phrase}</h4>
                            <p className="mt-1 text-sm text-muted-foreground leading-snug">{item.desc}</p>
                        </div>
                        <a
                            href={`https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/${item.code}`}
                            target="_blank"
                            rel="noreferrer"
                            className="shrink-0 p-1 text-muted-foreground hover:text-accent"
                        >
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="py-12 text-center text-muted-foreground">
                        <p className="text-sm">No status codes matching "{search}"</p>
                    </div>
                )}
            </div>
        </div>
    );
}
