import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import { LOCALES, localizedPath } from "./src/i18n/locales.ts";
import { PAGE_PATHS } from "./src/lib/pages.ts";

// Where the site is published, for the whole addresses search engines want.
// Vercel says which domain that is; SITE_URL overrides it.
const siteUrl =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "");

const config = defineConfig({
  server: {
    allowedHosts: [".ngrok-free.dev"],
  },
  resolve: { tsconfigPaths: true },
  define: { "import.meta.env.VITE_SITE_URL": JSON.stringify(siteUrl) },
  plugins: [
    devtools(),
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tailwindcss(),
    // Every page is written out as static HTML at build time, for search engines,
    // once in each language. The pages are listed because the language menu,
    // the only link from one language to another, is closed in the HTML.
    tanstackStart({
      pages: LOCALES.flatMap((locale) =>
        PAGE_PATHS.map((path) => ({ path: localizedPath(path, locale) })),
      ),
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
