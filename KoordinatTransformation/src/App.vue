<template>
  <KoorHeader />
  <main>
    <router-view/>
  </main>
</template>


<script setup>
import KoorHeader from "@/components/shared/KoorHeader.vue"
import { useStore } from 'vuex'
import { onBeforeMount } from "vue";

const store = useStore()
onBeforeMount(async () => {
  await store.dispatch('fetchCRSOptions')
})

</script>