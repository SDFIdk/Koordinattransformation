<template>
  <header class="layout-3col">
    <Brand />
    <div>
      <Nav />
    </div>
  </header>
</template>

<script>
import Brand from '@/components/shared/header/Brand.vue'
import Nav from '@/components/shared/header/Nav.vue'

export default {
  name: 'HeaderComponent',
  components: { Brand, Nav }
}
</script>

<style scoped>

header{
  width: 100%;
  height: 4rem;
  z-index: 0;
  top: 0;
  padding: 0 5vw 0 5vw;
  align-items: flex-start;
  grid-template-rows: auto;
  border-bottom: 1px solid var(--action);
}

div {
  grid-column: 2 / -1;
  justify-content: flex-end;
  display: flex;
  flex-direction: row;
}
</style>
