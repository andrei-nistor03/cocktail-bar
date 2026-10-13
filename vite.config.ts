import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://dev/config/
export default defineConfig({
  plugins: [tailwindcss(), [react()]],
  assetsInclude: ["**/*.glb"],
  build: {
    rolldownOptions: {
      output: {
        // Long-lived vendor chunks: cached across deploys, downloaded in parallel.
        codeSplitting: {
          groups: [
            { name: "three", test: /node_modules[\\/](three|three-stdlib|@react-three)/ },
            { name: "motion", test: /node_modules[\\/](gsap|@gsap|lenis)/ },
            { name: "swiper", test: /node_modules[\\/]swiper/ },
            { name: "react", test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
          ],
        },
      },
    },
  },
});
