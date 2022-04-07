<template>
  <div class="loading" v-if="isLoading">
    <Icon
      icon="LoadingIcon2"
      :width="size"
      :height="size"
      stroke-width="1"
      :color="$themeColors.turquoise"
    />
  </div>
</template>

<script>
export default {
  name: 'LoaderComponent',
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    size: {
      type: [Number, String],
      default: 3,
      validator: (value) => {
        return !isNaN(value)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.loading
  display flex
  align-content center
  justify-content center
  width 100%
</style>
