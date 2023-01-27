<template>
  <Map />
</template>

<script>
import { defineAsyncComponent } from 'vue'
export default {
  name: 'DenmarkView',
  components: {
    Map: defineAsyncComponent(() => import('@/components/map/Map.vue'))
  }
}
</script>

<style scoped>
</style>
