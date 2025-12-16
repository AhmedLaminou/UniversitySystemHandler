import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "localhost",
    port: 5173, // port par défaut Vite (évite le conflit avec auth-service en 8080)
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
