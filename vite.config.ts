import { cloudflare } from '@cloudflare/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,        // Makes it easier to style with className
      },
    }),
    cloudflare(),          // Builds worker/index.ts + serves /api/* in `npm run dev`
  ],
  resolve: {
    tsconfigPaths: true,
  },
})
