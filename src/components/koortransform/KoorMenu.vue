<template>
    <dialog open class="koor-menu-inner">
        <InputKoor :cover-area="coverArea" :input-options="CRSOptions"/>
        <OutputKoor :cover-area="coverArea" :output-options="CRSOptions"/>
    </dialog>
</template>

<script setup>
import InputKoor from '@/components/koortransform/InputKoor.vue'
import OutputKoor from '@/components/koortransform/OutputKoor.vue'
import { computed } from 'vue'
import { useKtStore } from '@/store/store.js'

const KtStore = useKtStore()

const props = defineProps({
    coverArea: {
        type: String,
        default: 'DK'
    }
})

const CRSOptions = computed(() => {
    const getterName = 'getCRSDisplayOptions' + props.coverArea;
    return KtStore[getterName]  || []
})
</script>

<style scoped>
.koor-menu-inner {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    min-height: 10rem;
    width: 80%;
}
</style>
