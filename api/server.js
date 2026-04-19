// Vercel Serverless Function — Node.js runtime
// Delegates all non-static requests to TanStack Start's SSR handler
import server from "../dist/server/server.js";

export default async function handler(request) {
    return server.fetch(request);
}
