import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index.js'

import App from './App.vue'

import '@dataforsyningen/designsystem/assets/designsystem.css'
import { DSLogo, DSLogoTitle, DSNavResponsive } from '@dataforsyningen/designsystem'

import { GSearchUI } from '@dataforsyningen/gsearch-ui'
import { Spinner } from '@dataforsyningen/designsystem/assets/designsystem.js'   


customElements.define('ds-spinner', Spinner)
customElements.define('g-search', GSearchUI)
customElements.define('ds-logo', DSLogo)
customElements.define('ds-logo-title', DSLogoTitle)
customElements.define('ds-nav-responsive', DSNavResponsive)

const app = createApp(App)
app.config.compilerOptions = {
  isCustomElement: (tag) => tag.startsWith('ds-'),
}

app.config.globalProperties.append = (path, pathToAppend) => path + (path.endsWith('/') ? '' : '/') + pathToAppend
app.config.performance = (import.meta.env.VITE_NODE_ENV !== 'production')

app.use(router)
  .use(createPinia())

window.addEventListener('DOMContentLoaded', () => {
  app.mount('#app')
}, { capture: true, once: true, passive: true })
