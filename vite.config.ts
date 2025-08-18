import { paraglideVitePlugin } from '@inlang/paraglide-js'
import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mkcert from 'vite-plugin-mkcert'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
const isStorybook = process.env.STORYBOOK === 'true'

export default defineConfig({
  plugins: [paraglideVitePlugin({ 
    project: './project.inlang', 
    outdir: './src/paraglide',
    strategy: ['url', 'cookie'],
    urlPatterns: [
      {
        pattern: '/:path(.*)?',
        localized: [
          ['en', '/en/:path(.*)?'],
          ['pt-BR', '/:path(.*)?'],
        ],
      },
    ],
  }),
    TanStackRouterVite({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'logo192.png', 'logo512.png'],
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        navigateFallback: 'index.html',
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      devOptions: {
        enabled: true,
        suppressWarnings: true,
      },
      disable: isStorybook,
    }),
    mkcert()
  ],
  server: {
    port: 9091,
    host: true,
    allowedHosts: ['https://6b70f4d2.purplefy---spotify-api-frontend.pages.dev/'],
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
})
