<template>
  <ul class="nav">
    <li>
      <router-link to="/Denmark">
        <h6 v-if="window.width > 770">
          Danmark
        </h6>
      </router-link>
    </li>
    <li>
      <router-link to="/Greenland">
        <h6 v-if="window.width > 770">
          Grønland
        </h6>
      </router-link>
    </li>
    <li>
      <router-link to="/About">
        <h6 v-if="window.width > 770">
          Om Koordinattransformation
        </h6>
      </router-link>
    </li>
  </ul>
</template>

<script>
import { inject } from 'vue'

export default {
  name: 'HeaderNavComponent',
  setup () {
    const colors = inject('themeColors')
    return {
      colors
    }
  },
  data () {
    return {
      window: {
        width: 0,
        height: 0
      }
    }
  },
  created () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  methods: {
    handleResize () {
      this.window.width = window.innerWidth
      this.window.height = window.innerHeight
    }
  }
}
</script>

<style scoped>
.nav {
  margin-top: 0.5rem;
  padding-left: 1rem;
  display: flex;
  justify-content: flex-end;
}

ul {
  margin: 0;
  display: flex;
  flex-direction: row;
  list-style: none;
}

li, li > a {
  display: flex;
  flex-direction: row;
  align-items: center;
}

li {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.router-link-active {
  color: var(--action);
  box-shadow: 0 -4px 0 var(--action) inset;
}
a {
  padding: 0.5rem 1rem;
}
h6 {
  color: var(--black2);
  white-space: nowrap;
  word-break: keep-all;
  flex-shrink: 0;
  padding: 0.5rem;
}
</style>
