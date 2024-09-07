import type { NuxtPage } from 'nuxt/schema'
import { appDescription } from './app/constants/index'

export default defineNuxtConfig({

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "~/styles/theme.scss" as element;`,
        },
      },
    },

    build: {
      rollupOptions: {
        output: {
          // id 为 package.json 的 name
          manualChunks: (id: string) => {
            if (id.includes('element-plus'))
              return 'element-plus'
            if (id.includes('echarts'))
              return 'echarts'
          },
        },
      },
    },
  },

  ssr: false,

  router: {
    options: {
      hashMode: true,
    },
  },
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/eslint',
    '@element-plus/nuxt',
    'dayjs-nuxt',
    'arco-design-nuxt-module',
    'nuxt-vite-legacy',
  ],

  legacy: {
    targets: ['chrome 69'],
    modernPolyfills: ['es.global-this', 'es.object.from-entries', 'es.array.flat-map', 'es.array.flat'],
  },

  elementPlus: {
    importStyle: 'scss',
    icon: 'ElIcon',
  },

  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
  },

  css: [
    '@unocss/reset/tailwind.css',
  ],

  colorMode: {
    classSuffix: '',
  },

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: false,
      routes: ['/'],
      ignore: ['/hi'],
    },
  },

  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/nuxt.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: appDescription },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: 'white' },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#222222' },
      ],
      script: [],
    },
  },

  devtools: {
    enabled: true,
  },

  features: {
    // For UnoCSS
    inlineStyles: false,
  },

  eslint: {
    config: {
      standalone: false,
    },
  },

  future: {
    compatibilityVersion: 4,
  },

  hooks: {
    'pages:extend': function (pages) {
      // 删除含component的page路由
      function removePagesMatching(pattern: RegExp, pages: NuxtPage[] = []) {
        const pagesToRemove = []
        for (const page of pages) {
          if (pattern.test(page.file || ''))
            pagesToRemove.push(page)

          else
            removePagesMatching(pattern, page.children)
        }
        for (const page of pagesToRemove)
          pages.splice(pages.indexOf(page), 1)
      }
      removePagesMatching(/component/i, pages)
    },
  },

  compatibilityDate: '2024-08-14',
})
