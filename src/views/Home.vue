<template>
<h1>This is home</h1>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'HomeView',
  setup () {
    const router = useRouter()
    // router.push('Greenland')
    router.push('Denmark')
  }
}
</script>

<style scoped>

</style>
