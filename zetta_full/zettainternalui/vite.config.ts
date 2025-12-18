import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    host: "internal.zetta.test",
    port: 5173,
  },
  build: {
    sourcemap: false, // Désactive les sourcemaps pour éviter les erreurs
    // Remove manual chunking entirely - let Vite handle it
  },
});