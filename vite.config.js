import { defineConfig } from 'vite'

export default defineConfig({
  base: '/SHEN-ZHEN-TIME/',
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
