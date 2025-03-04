<template>
  <KoorHeader />
  <main>
    <router-view />
  </main>
</template>


<script setup>
import KoorHeader from './components/shared/KoorHeader.vue'
import { useKtStore } from './store/store.js'
import { onBeforeMount, computed, provide } from 'vue'

const KtStore = useKtStore()

const isMobile = computed(() => window.innerWidth < 1055)
provide('isMobile', isMobile)

onBeforeMount(async () => {
  await KtStore.fetchCRSOptions()
})

</script>
