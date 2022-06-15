<template>
  <ul v-show="window.width > 770" class="nav">
    <li>
      <router-link to="/Denmark">
        <h6>
          Danmark
        </h6>
      </router-link>
    </li>
    <li>
      <router-link to="/Greenland">
        <h6>
          Grønland
        </h6>
      </router-link>
    </li>
    <li>
      <router-link to="/About">
        <h6>
          Om Koordinattransformation
        </h6>
      </router-link>
    </li>
  </ul>
  <div v-show="window.width < 770" @click="handleClick">
    <Icon
      :width="3"
      :height="3"
      :color="colors.black"
      icon="BurgerIcon"
    />
  </div>
  <div class="burger-content" :class="{burgerClicked: burgerClicked}">
    <router-link to="/Denmark">
      <h6>
        Danmark
      </h6>
    </router-link>
    <router-link to="/Denmark">
      <h6>
        Grenland
      </h6>
    </router-link>
    <router-link to="/Denmark">
      <h6>
        About
      </h6>
    </router-link>
  </div>
</template>

<script>
import { inject, ref } from 'vue'

export default {
  name: 'HeaderNavComponent',
  setup () {
    const colors = inject('themeColors')
    const burgerClicked = ref(false)
    return {
      colors,
      burgerClicked
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
    },
    handleClick () {
      console.log('click')
      this.burgerClicked = !this.burgerClicked
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.burger-menu {
  margin: 0.5rem;
}
.nav {
  margin-top: 0.5rem;
  padding-left: 1rem;
  display: flex;
  justify-content: flex-end;
}

.burger-content {
  position: absolute;
  background: white;
  margin: 3.5rem 0.25rem;
  z-index: 3;
  display: none;
  border-top: 1px solid black;
  border-left: 1px solid black;
  border-right: 1px solid black;
}

.burger-content > a {
  display: block;
  /* box-shadow: none; */
  width: 100%;
  border-bottom: 1px solid black;
}

.burger-content > a:hover {
  background: var(--action);
}

.burgerClicked {
  display: block;
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
