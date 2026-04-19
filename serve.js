import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const clientDir = join(__dirname, "client");

// MIME types for static files
const MIME_TYPES = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".mjs": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".webp": "image/webp",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".wasm": "application/wasm",
};

// Import the TanStack Start server handler
const { default: app } = await import("./server/server.js");

const PORT = parseInt(process.env.PORT || "3000", 10);

const server = createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    // Try serving static files from dist/client first
    const staticPath = join(clientDir, url.pathname);
    if (
        url.pathname !== "/" &&
        existsSync(staticPath) &&
        statSync(staticPath).isFile()
    ) {
        const ext = extname(staticPath);
        const mime = MIME_TYPES[ext] || "application/octet-stream";
        const content = readFileSync(staticPath);

        res.writeHead(200, {
            "Content-Type": mime,
            "Content-Length": content.length,
            // Cache static assets with hashes for 1 year
            ...(url.pathname.startsWith("/assets/")
                ? { "Cache-Control": "public, max-age=31536000, immutable" }
                : {}),
        });
        res.end(content);
        return;
    }

    // For all other requests, pass to TanStack Start SSR handler
    try {
        const headers = new Headers();
        for (const [key, value] of Object.entries(req.headers)) {
            if (value) {
                if (Array.isArray(value)) {
                    value.forEach((v) => headers.append(key, v));
                } else {
                    headers.set(key, value);
                }
            }
        }

        const request = new Request(url.toString(), {
            method: req.method,
            headers,
            body:
                req.method !== "GET" && req.method !== "HEAD"
                    ? await new Promise((resolve) => {
                        const chunks = [];
                        req.on("data", (chunk) => chunks.push(chunk));
                        req.on("end", () => resolve(Buffer.concat(chunks)));
                    })
                    : undefined,
            duplex: "half",
        });

        const response = await app.fetch(request);

        // Write status and headers
        const responseHeaders = {};
        response.headers.forEach((value, key) => {
            if (responseHeaders[key]) {
                if (Array.isArray(responseHeaders[key])) {
                    responseHeaders[key].push(value);
                } else {
                    responseHeaders[key] = [responseHeaders[key], value];
                }
            } else {
                responseHeaders[key] = value;
            }
        });

        res.writeHead(response.status, responseHeaders);

        // Stream the response body
        if (response.body) {
            const reader = response.body.getReader();
            const pump = async () => {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        res.end();
                        return;
                    }
                    res.write(value);
                }
            };
            await pump();
        } else {
            res.end();
        }
    } catch (err) {
        console.error("SSR Error:", err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
    }
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Toolshed server running on http://0.0.0.0:${PORT}`);
});
