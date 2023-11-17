import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  base: path.resolve(__dirname, "/dist"),
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: true,
    __INTLIFY_PROD_DEVTOOLS__: false,
  },
  test: {
    globals: true,
    deps: {
      inline: ["vuetify"],
    },
  },
  plugins: [vue(), vuetify()],
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});