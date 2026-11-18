import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

const config = defineConfig({
  server: {
    allowedHosts: [".ngrok-free.dev"],
  },
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tailwindcss(),
    // Every page is written out as static HTML at build time, for search engines.
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
        // A link with a query, such as /solver?method=cfop, is the same page again.
        filter: ({ path }) => !path.includes("?"),
      },
    }),
    viteReact(),
  ],
});

export default config;
