<template>
  <router-link @click="clearFilters"
               to="/"
               class="brand"
  >
    <Icon
        icon="KoorTransCrown"
        :width="3"
        :height="3"
        class="brand-logo cursor-point"
        @mouseenter.stop="isHovering = true"
        @mouseleave.stop="isHovering = false"
    />
    <div
        class="brand-name"
        @mouseenter.stop="isHovering = true"
        @mouseleave.stop="isHovering = false"
    >
      <h5
          class="cursor-point"
      >
        Koordinattransformation
      </h5>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'HeaderBrandComponent',
  data () {
    return {
      isHovering: false
    }
  },

  methods: {
    clearFilters () {
      window.location.replace(window.location.protocol + '//' + window.location.host)
      // this.$store.dispatch('Filters/clear')
    }
  }
}
</script>

<style scoped>
.brand {
  padding-top: 0.5rem;
  display: flex;
  cursor: default;
  grid-column: 1;
}

.brand-logo {
  flex-shrink: 0;
}

.brand-name {
  align-self: flex-start;
  padding-left: 1rem;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
}

h5 {
  white-space: nowrap;
  word-break: keep-all;
  break-inside: avoid;
  line-break: strict;
  hyphens: none;
  color: var(--black);
}
</style>
