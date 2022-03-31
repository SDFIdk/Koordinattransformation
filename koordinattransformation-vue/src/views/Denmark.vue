<template>
  <Map />
</template>

<script>
import { defineAsyncComponent } from 'vue'
export default {
  name: 'DenmarkView',
  components: {
    Map: defineAsyncComponent(() => import('@/components/map/Map'))
  }
}
</script>

<style scoped>
</style>
