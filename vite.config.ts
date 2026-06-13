import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Vercel's "Public Environment Variables Prefix" set to "VITE_" doubles up the
// prefix on vars already named VITE_* (e.g. "VITE_ VITE_SUPABASE_URL").
// Clean them up before Vite processes env vars so the build doesn't fail.
for (const key of Object.keys(process.env)) {
  if (key.startsWith("VITE_ ")) {
    const clean = key.slice("VITE_ ".length);
    process.env[clean] ??= process.env[key];
    delete process.env[key];
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
