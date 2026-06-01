import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// conf for dev-only substitution of ${VITE_*} placeholders in index.html,
// grabbed from the loaded .env.<mode>
// the same placeholders are substituted by envsubst in prod (at container startup)
function devConfigSubst(env) {
  return {
    name: 'kt-dev-config-subst',
    apply: 'serve',
    transformIndexHtml(html) {
      return html.replace(/\$\{(VITE_[A-Z0-9_]+)\}/g, (_, name) => env[name] ?? '')
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    resolve: {
      //forces vite to use the full vue bundler even when running in test
      alias: {
        'vue': 'vue/dist/vue.esm-bundler.js'
      }
    },
    plugins: [
      devConfigSubst(env),
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
  }
})
