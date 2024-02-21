<template>
    <header class="layout-2col">
      <Brand />
      <nav class="ds-nav-main" v-if='width>minWidth'>
        <ul>
            <li>
                <router-link to='/Denmark'>Danmark</router-link>
            </li>
            <li>
                <router-link to='/Greenland'>Grønland</router-link>
            </li>
            <li>
                <router-link to='/About'>Om Koordinattransformation</router-link>
            </li>
        </ul>
    </nav>
        <div class='burgerRight'>
            <BurgerIcon v-if='width < minWidth' @click='toggleVerticalMenu'/>
        </div>
    </header>
    <div class="nav-container" v-if='verticalMenuIsOpen'>
        <nav class="ds-nav-vertical">
                <ul>
                    <li>
                        <router-link @click="toggleVerticalMenu"  to='/Denmark'>Danmark</router-link>
                    </li>
                    <li>
                        <router-link @click="toggleVerticalMenu" to='/Greenland'>Grønland</router-link>
                    </li>
                    <li>
                        <router-link @click="toggleVerticalMenu" to='/About'>Om Koordinattransformation</router-link>
                    </li>
                </ul>
        </nav>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Brand from '@/components/shared/header/Brand.vue'
import BurgerIcon from '../icons/BurgerIcon.vue'

const width = ref(window.innerWidth)
const minWidth = 880
const verticalMenuIsOpen = ref(false)

const toggleVerticalMenu = () => { verticalMenuIsOpen.value = !verticalMenuIsOpen.value; }

const handleResize = () => { width.value = window.innerWidth }

onMounted(() => window.addEventListener('resize', handleResize))
</script>

<style scoped>
.burgerRight{
    position: fixed;
    right: 0;
}
.nav-container {
  text-align: left; 
  margin-top: 3.5rem;
  display: flex; 
  justify-content: flex-end; 
  position: fixed;
  top: 0;
  right: 0;
  background-color: #fff; 
  z-index: 1;
  border-radius: 10px; 
  color-scheme: light;
  border: 2px solid var(--aktion);
}
.nav-container ul li a {
  color: black;
  display: flex;
  align-items: center;
  opacity: 1;
  justify-content: space-between;
}
header  {
    width: 100%;
    height: 4rem;
    z-index: 0;
    top: 0;
    padding: 0 5vw 0 5vw;
    align-items: flex-start;
    grid-template-rows: auto;
    border-bottom: 1px solid var(--teal);
}
.ds-nav-vertical ul li {
  align-content: right;
}
.nav-container ul li a {
  color: black;
  display: flex;
  align-items: center;
  opacity: 1; /* Set opacity to 1 for no transparency */
}
</style>