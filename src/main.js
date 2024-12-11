import { createApp } from 'vue'
import store from '@/store'
import router from '@/router'

import App from './App.vue'

import '@dataforsyningen/designsystem/assets/designsystem.css'
import { DSLogo, DSLogoTitle, DSNavResponsive } from '@dataforsyningen/designsystem'

customElements.define('ds-logo', DSLogo)
customElements.define('ds-logo-title', DSLogoTitle)
customElements.define('ds-nav-responsive', DSNavResponsive)

const app = createApp(App)

app.config.globalProperties.append = (path, pathToAppend) => path + (path.endsWith('/') ? '' : '/') + pathToAppend
app.config.performance = (import.meta.env.VITE_NODE_ENV !== 'production')

app.use(router)
.use(store)

window.addEventListener('DOMContentLoaded', () => {
  app.mount('#app')
}, { capture: true, once: true, passive: true })
