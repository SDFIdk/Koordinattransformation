import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  resolve: {
    //forces vite to use the full vue bundler even when running in test
    alias: {
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('ds-') || tag.includes('g-')
        }
      }
    }),
    viteStaticCopy({
      targets: [
        {
          src: './src/assets/icons/icons.svg',
          dest: ''
        }
      ]
    })
  ],
  
})