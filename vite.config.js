import { defineConfig } from 'vite'

const nativeBuild = process.env.CAP_BUILD === '1'

export default defineConfig({
  base: nativeBuild ? '/' : '/SHEN-ZHEN-TIME/',
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['.monkeycode-ai.online']
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['.monkeycode-ai.online']
  }
})
