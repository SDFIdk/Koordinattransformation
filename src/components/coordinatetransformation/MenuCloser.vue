<template>
    <div class="closer-content" @click="handleClose">
        <DropdownIcon :is-open="isOpen"/>
    </div>
</template>

<script setup>
import DropdownIcon from '../shared/icons/DropdownIcon.vue';
import { ref } from 'vue';

const isOpen = ref(true)

const emit = defineEmits(['handle-close'])

function handleClose() {
    isOpen.value = !isOpen.value
    emit('handle-close')
}
</script>

<style>
.closer-content {
    border-radius: 0 0 25px 25px;
    display: flex;
    justify-content: center;
    position: relative;
    width: 100%;
    height: 1.5rem;
    background: var(--hvid);
}
</style>
