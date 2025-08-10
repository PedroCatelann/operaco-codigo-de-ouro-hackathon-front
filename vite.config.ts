import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

//const NGROK_HOST = "c1c79a0382f6.ngrok-free.app";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  /* server: {
    host: "0.0.0.0", // permite acesso externo
    allowedHosts: [NGROK_HOST], // adiciona a URL do ngrok como host permitido
  }, */
  build: {
    outDir: "dist",
  },
});
