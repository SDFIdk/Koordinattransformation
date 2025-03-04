<template>
  <KoorHeader />
  <main>
    <router-view />
  </main>
</template>


<script setup>
import KoorHeader from './components/shared/KoorHeader.vue'
import { useKtStore } from './store/store.js'
import { onBeforeMount, onMounted, provide, onBeforeUnmount, ref } from 'vue'

const KtStore = useKtStore()

const isMobile = ref(window.innerWidth < 1055)
provide('isMobile', isMobile)

onBeforeMount(async () => {
  await KtStore.fetchCRSOptions()
})

onMounted(() => {
  const handleResize = () => {
    isMobile.value = window.innerWidth < 1055
  }
  window.addEventListener('resize', handleResize)

})
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

</script>
