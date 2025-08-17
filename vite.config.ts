import { paraglideVitePlugin } from '@inlang/paraglide-js'
import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mkcert from 'vite-plugin-mkcert'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [paraglideVitePlugin({ 
    project: './project.inlang', 
    outdir: './src/paraglide',
    strategy: ['url', 'cookie'],
    urlPatterns: [
      {
        pattern: '/:path(.*)?',
        localized: [
          ['pt-BR', '/:path(.*)?'],
          ['en', '/en/:path(.*)?'],
        ],
      },
    ],
  }),
    TanStackRouterVite({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
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
