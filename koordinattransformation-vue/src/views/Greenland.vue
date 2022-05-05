<template>
  <Map :isDenmark="false"/>
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
