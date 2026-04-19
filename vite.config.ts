// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// Cloudflare plugin is DISABLED so we can deploy as a standard static site (Render, Netlify, etc.)
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
    cloudflare: false,
});
