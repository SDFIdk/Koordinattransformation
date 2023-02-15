import
/* webpackChunkName: "Vue" */
/* webpackPreload: true */
{ createApp, defineAsyncComponent } from 'vue'

// import '~@/RegisterServiceWorker'

import
/* webpackChunkName: "store" */
/* webpackPreload: true */
store from '@/store'

import
/* webpackChunkName: "router" */
/* webpackPreload: true */
router from '@/router'

import
/* webpackPreload: true */
colors from '@/plugins/colors'

import
/* webpackPreload: true */
App from './App.vue'

import(
  /* webpackChunkName: "sanitize" */
  /* webpackPreload: true */
  'sanitize.css'
)
import(
  /* webpackChunkName: "sanitize_forms" */
  /* webpackPreload: true */
  'sanitize.css/forms.css'
)
import(
  /* webpackChunkName: "sanitize_assets" */
  /* webpackPreload: true */
  'sanitize.css/assets.css'
)
import(
  /* webpackChunkName: "sanitize_reduce-motion" */
  /* webpackPreload: true */
  'sanitize.css/reduce-motion.css'
)

import(
  /* webpackChunkName: "fonts" */
  /* webpackPreload: true */
  '@/assets/css/fonts.css'
)

import(
  /* webpackChunkName: "base" */
  /* webpackPreload: true */
  '@/assets/css/base.css'
)

import(
  /* webpackChunkName: "classes" */
  /* webpackPreload: true */
  '@/assets/css/classes.css'
)

import(
  /* webpackChunkName: "grid" */
  /* webpackPreload: true */
  '@/assets/css/grid.css'
)

const app = createApp(App)

app.config.globalProperties.append = (path, pathToAppend) => path + (path.endsWith('/') ? '' : '/') + pathToAppend
app.config.performance = (process.env.NODE_ENV !== 'production')
app.config.globalProperties.$store = store

app.use(colors)
  .component(
    'Icon', defineAsyncComponent(() => import(
      /* webpackMode: "lazy" */
      /* webpackChunkName: "IconWrapper" */
      /* webpackPreload: true */
      '@/components/shared/Icon'
    ))
  )
  .use(router)
  .use(store)

window.addEventListener('DOMContentLoaded', () => {
  app.mount('#app')
}, { capture: true, once: true, passive: true })
