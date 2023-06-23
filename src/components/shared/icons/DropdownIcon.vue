<template>
    <div :class="{pointUp: props.isOpen}">
        <svg width="24" height="24" viewBox="0 0 24 24" class="ds-svg-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9L12 15L18 9" stroke="hsl(186,100%,33%)" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </div>
</template>

<script setup>
const props = defineProps({
    isOpen: Boolean
})
</script>

<style>
.pointUp {
    transform: rotate(180deg);
}
</style>