<template>
  <dialog
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

<style scoped>
.koor-menu-inner {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    min-height: 10rem;
    min-width: 70%;
    width: 80%;
}
.KT-borderline {
  min-height: 100%;
  background-color: var(--c6);
  min-width: 0.15rem;
  max-width: 0.15rem;
  margin-right: 1rem;
  margin-left: 1rem;
  position: relative;
  z-index: 10;
  overflow: visible; 
}
.KT-ptr {
  position: absolute;
  top: 45%;
  left: -0.2rem;
  background-color: var(--grey2);
  --ds-icon-color: var(--c6);
  --ds-icon-stroke : 3;
  margin: 0;
}

@media only screen and (max-width: 66rem) {
  .koor-menu-inner {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 10rem;
      min-width: 100%;
      width: 80%;
      margin-left: 0;
  }
  .KT-borderline {
    min-width: 100%;
    background-color: var(--c6);
    min-height: 0.15rem;
    max-height: 0.15rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    margin-right: 0rem;
    margin-left: 0rem;
    position: relative;
    overflow: visible; 
  }
  .KT-ptr {
    position: absolute;
    top: -0.2rem;
    margin: 0;
    left: 45%;
  }
}


</style>
