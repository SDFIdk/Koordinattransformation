<script>
import { useRouter } from 'vue-router'

export default {
  name: 'HomeView',
  setup () {
    const router = useRouter()
    router.push('Denmark')
  }
}
</script>

<style scoped>

</style>
