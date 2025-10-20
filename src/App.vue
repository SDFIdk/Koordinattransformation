<template>
  <KoorHeader />
  <main>
    <router-view />
  </main>
</template>


<script setup>
import KoorHeader from './components/shared/KoorHeader.vue'
import { useKtStore } from './store/store.js'
import { onBeforeMount, onMounted, computed, provide, onBeforeUnmount, ref, nextTick, watch } from 'vue'

import { showToast } from '@dataforsyningen/designsystem/assets/designsystem.js'

const KtStore = useKtStore()

const isMobile = ref(window.innerWidth < 1055)
provide('isMobile', isMobile)

const errorActive = computed(() => KtStore.isErrorState)

onBeforeMount(async () => {
  await KtStore.fetchCRSOptions()
  await nextTick()
})

onMounted(() => {
  const handleResize = () => {
    isMobile.value = window.innerWidth < 1055
  }
  window.addEventListener('resize', handleResize)


  showToast({
    message: KtStore.getErrorMsg,
    duration: 3000
  })

})
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})


watch(errorActive, (to) => {
  console.log('we trigger this correctly', to)
  if(to) {
    showToast({
      message: KtStore.getErrorMsg,
      duration: 3000
    })
  }
  KtStore.resetErrorState()
})

</script>
