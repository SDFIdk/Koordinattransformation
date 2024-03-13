<template>
    <header class="layout-2col">
      <Brand />
      <nav class="ds-nav-main" v-if='width>minWidth'>
        <ul>
            <li class="route">
                <router-link class='Denmark' to='/Denmark'>Danmark</router-link>
            </li>
            <li class="route">
                <router-link class='Greenland' to='/Greenland'>Grønland</router-link>
            </li>
            <li class="route">
                <router-link class='About' to='/About'>Om Koordinattransformation</router-link>
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
                        <router-link @click="toggleVerticalMenu" class ="route" to='/Denmark'>Danmark</router-link>
                    </li>
                    <li>
                        <router-link @click="toggleVerticalMenu" class="route"  to='/Greenland'>Grønland</router-link>
                    </li>
                    <li>
                        <router-link @click="toggleVerticalMenu" class="route" to='/About'>Om Koordinattransformation</router-link>
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
    margin-top: 0.5rem;
    display:inline-block;
    position: fixed;
    right: 0;
}
@media only screen and (max-width: 600px) {
        .burderRight {
            font-size: 0.8em;
        }
}
.nav-container {
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
.route a {
    padding: var(--space) var(--space-md);
    margin: 0px;
    margin-top: 0px;
    border-style: solid;
    border-width: 0 0 var(--space-xs) 0;
    border-color: rgba(0, 0, 0, 0);
    color: var(--color) !important;
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
.ds-nav-main{
    margin-top: 0.75rem;
    justify-content: flex-end;
}
</style>