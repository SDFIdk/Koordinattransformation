<template>
    <button @click="store.dispatch('temp/setTemp', 'hello')">
        Set temp to hello
    </button>
    <p>{{ temp }}</p>
</template>

<script setup>
import { useStore } from 'vuex'
import { ref } from 'vue'
const store = useStore()

const temp = ref(store.getters['temp/getTemp']);


</script>