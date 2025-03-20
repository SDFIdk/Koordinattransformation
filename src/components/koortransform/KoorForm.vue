<template>
  <dialog
    v-if="CRSOptions.length>0"
    open
    class="koor-menu-inner"
  >
    <InputKoor
      
      :cover-area="coverArea"
      :input-options="CRSOptions"
    />
    <div class="KT-borderline">
      <svg class="KT-ptr">
        <use
          v-if="!isMobile"
          href="../../assets/icons/icons.svg#arrow-single-right"
        />
        <use
          v-else
          href="../../assets/icons/icons.svg#arrow-single-down"
        />
      </svg>
    </div>

    <OutputKoor
      :cover-area="coverArea"
      :output-options="CRSOptions"
    />
  </dialog>
  <dialog
    v-else
    open
    class="koor-menu-inner"
  >
    <div class="KT-load-wrapper">
      <ds-spinner />
    </div>
  </dialog>
</template>

<script setup>
import InputKoor from './inputelements/InputKoor.vue'
import OutputKoor from './outputelements/OutputKoor.vue'
import { computed, inject } from 'vue'
import { useKtStore } from '../../store/store.js'

const KtStore = useKtStore()

const isMobile = inject('isMobile')

const coverArea = computed(() => KtStore.getCoverArea)

const CRSOptions = computed(() => {
  const getterName = 'getCRSDisplayOptions' + coverArea.value
  return KtStore[getterName]  || []
})
</script>

<style>
</style>
