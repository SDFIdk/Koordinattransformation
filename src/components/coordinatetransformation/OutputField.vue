<template>
  <div class="transformed-coordinates" :class="{ hasTransformed: hasTransformed}">
    <div v-if="props.isLoading">
      <Loader size="1.5" :isLoading=isLoading />
    </div>
    <div v-else>
      <div class="output-coordinates">{{ output1 }}</div>
      <div class="output-coordinates">{{ output2 }} </div>
      <div class="output-coordinates">{{ output3 }}</div>
    </div>
  </div>
</template>

<script setup>
/** the output field to go in the output card */
import { defineAsyncComponent } from 'vue'

const Loader = defineAsyncComponent(() => import('@/components/shared/Loader'))

const props = defineProps({
  output1: String,
  output2: String,
  output3: String,

  isLoading: Boolean
})

</script>

<style scoped>
.transformed-coordinates {
  margin: 1rem 0 1rem 0.25rem;
  padding-left: 0.5rem;
  width: 98.75%;
  height: 2.5rem;
  display: flex;
  align-items: center;
  background-color: var(--white);
  border: var(--darkSteel) solid 1px;
}
.transformed-coordinates.hasTransformed {
  background-color: #3EDDC6;
  color: var(--white);
}
.transformed-coordinates::selection {
  background: var(--highlight2);
}
.output-coordinates {
  display: inline-flex;
  margin-right: 0.25rem;
}
</style>
