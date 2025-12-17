import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  theme : {
    extends : {
      colors : {
        'primary' : '#5f6fff'
      },
      griddTemplateColumns : {
        'auto' : 'reapeat(auto-fill minmax(200px, 1fr))'
      }
    }
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  server : {port: 5173}
});
