<template>
  <Header />
  <main>
    <router-view />
  </main>
</template>

<script>
/**
 * Familietræet af forældrekomponenter og deres børn er som følgende:
 * Map -> CoordinateTransformation
 * CoordinateTransformation -> InputCoordinates -> CoordinateSelection
 * CoordinateTransformation -> OutputCoordinates -> CoordinateSelection
 * CoordinateTransformation -> MenuCloser
 */
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
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
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

.autocomplete-container {
    /* relative position for at de absolut positionerede forslag får korrekt placering.*/
    position: relative;
}

.autocomplete-container input {
    /* Både input og forslag får samme bredde som omkringliggende DIV */
    box-sizing: border-box;
}

.dawa-autocomplete-suggestions {
    margin: 1em 0 0 0;
    padding: 0;
    text-align: left;
    border-radius: 0.3125em;
    background: #fcfcfc;
    box-shadow: 0 0.0625em 0.15625em rgba(0,0,0,.15);
    position: absolute;
    left: 1.75rem;
    right: 0%;
    z-index: 9999;
    overflow-y: auto;
    box-sizing: border-box;
    width: 75%;
}

.dawa-autocomplete-suggestions .dawa-autocomplete-suggestion {
    margin: 0;
    list-style: none;
    cursor: pointer;
    padding: 0.4em 0.6em;
    color: #333;
    border: 0.0625em solid #ddd;
    border-bottom-width: 0;
}

.dawa-autocomplete-suggestions .dawa-autocomplete-suggestion:first-child {
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
}

.dawa-autocomplete-suggestions .dawa-autocomplete-suggestion:last-child {
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
    border-bottom-width: 0.0625em;
}

.dawa-autocomplete-suggestions .dawa-autocomplete-suggestion.dawa-selected,
.dawa-autocomplete-suggestions .dawa-autocomplete-suggestion:hover {
    background: #f0f0f0;
}
</style>
