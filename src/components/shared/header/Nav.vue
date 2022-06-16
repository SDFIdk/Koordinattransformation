<template>
  <ul v-show="window.width > 770 || (burgerClicked && window.width < 770)" class="nav" :class="{'mobile-ul': burgerClicked}">
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
  },
  provide () {
    return window
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

@media only screen and (max-width: 770px) {
  .mobile-ul {
    position: absolute;
    display: block;
    overflow: auto;
    z-index: 3;
    background: white;
    margin: 3.5rem 0 0 0;
    border: 1px solid var(--action);
  }
  h6 {
    padding: 0;
    margin: 0.75rem 0.75rem 0.75rem 0;
  }
  li > a {
    width: 100%;
    padding: 0;
    margin: 0.5rem 0.5rem 0.5rem 0;
  }
  li > a:hover {
    color: var(--action);
    box-shadow: 0 -4px 0 var(--action) inset;
  }
  .router-link-active {
    box-shadow: none;
  }
  ul {
    display: none;
  }
}
</style>
