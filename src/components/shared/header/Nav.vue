<template>
  <ul
    v-show='window.width > minWidth || (burgerClicked && window.width < minWidth)'
    class='nav'
    :class="{'menuDropDown': burgerClicked}">
    <li @click='handleClick'>
      <router-link to='/Denmark'>
        <h6>
          Danmark
        </h6>
      </router-link>
    </li>
    <li @click='handleClick'>
      <router-link to='/Greenland'>
        <h6>
          Grønland
        </h6>
      </router-link>
    </li>
    <li @click='handleClick'>
      <router-link to='/About'>
        <h6>
          Om Koordinattransformation
        </h6>
      </router-link>
    </li>
  </ul>
    <Icon v-show='window.width < minWidth' @click='handleClick'
      :width='3'
      :height='3'
      :color='colors.black'
      icon='BurgerIcon'
      class='burger-icon'
    />
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
      },

      minWidth: 880
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
.burger-icon {
  margin: 0.5rem 0 0 0;
  cursor: pointer;
}
.nav {
  margin: 0.5rem 0;
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

@media only screen and (max-width: 880px) {
  .menuDropDown {
    position: absolute;
    display: block;
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
  ul {
    display: none;
  }
}
</style>
