<template>
  <Map :isDenmark="false" inputEPSG='EPSG:3178' />
</template>

<script>
import { defineAsyncComponent } from 'vue'
export default {
  name: 'GreenlandView',
  components: {
    Map: defineAsyncComponent(() => import('@/components/map/Map'))
  }
}
</script>

<style scoped>

</style>
