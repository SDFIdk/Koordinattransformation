<template>
  <Header />
  <main>
    <router-view />
  </main>
</template>

<script>
import { onErrorCaptured, ref } from 'vue'
import { useRouter } from 'vue-router'
import { isConsole, isIE, isSmartTV, isWearable } from 'mobile-device-detect'
import Header from '@/components/shared/header/Header'

export default {
  name: 'App',
  components: { Header },
  setup () {
    const error = ref('')
    onErrorCaptured((e) => {
      error.value = e
      window.setTimeout(() => { error.value = '' }, 3000)
      return true
    })
    const router = useRouter()
    if (isIE) {
      router.push({ path: '/PageBrowserIncompatible' })
    }
    if (isConsole || isWearable || isSmartTV) {
      router.push({ path: '/PageDeviceIncompatible' })
    }
    return { error }
  }
}
</script>

<style>
:root, html, body {
  height: 100%;
  margin: 0;
}

main {
  padding: 0;
}

.ol-full-screen {
  display: none;
}
</style>
