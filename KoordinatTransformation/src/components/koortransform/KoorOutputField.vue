<template>
    <p>{{ outputCoor }}</p>
    </template>
    
    <script setup>
    //meter, grader, grader+minutter, grader+minutter+sekunder
    import { computed, watch } from 'vue'
    import { useStore } from 'vuex'
    const store = useStore()
    
    const outputCoor = computed(() => store.getters['getCoordinatesTo'])
    const inputCoor = computed(() => store.getters['getCoordinatesFrom'])
    
    const props = defineProps({
        coordinateFormat: {
            type: String,
            default: ''
        }
    })

    watch(inputCoor, (to, from) => {
        store.dispatch('setCoordinatesTo')
    })
    
    </script>
    
    <style scoped>
    
    
    </style>