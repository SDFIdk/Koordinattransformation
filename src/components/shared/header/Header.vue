<!-- 
    Denne header komponent kunne gøres med en enkelt div og conditional rendering, 
    men så kan vi ikke bruge @dataforsyningen css 
-->
<template>
    <header class="ds-header" v-if='width > minWidth'>
      <nav class="ds-nav-main">
        <Brand />
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
    </header>
    <header class="ds-header" v-if='width <= minWidth'>
        <Brand />
        <BurgerIcon v-if='width < minWidth' @click='toggleVerticalMenu'/>
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
      <!--
        <div class="nav-container" v-if='!verticalMenuIsOpen' style="display: flex; justify-content: space-between;">
        -->
            <!-- HORIZONTAL NAVBAR -->
        <!--
            <nav v-if='width > minWidth'>
                <ul >
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
            -->
            <!-- VERTICAL NAVBAR (NÅR SKÆRMEN ER MEGET SMAL) -->
            <!--
            <nav class="ds-nav-vertical" v-if='verticalMenuIsOpen'>
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
            <BurgerIcon v-if='width < minWidth' @click='toggleVerticalMenu'/>
        </div>
        -->

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
.nav-container {
  text-align: left; 
  width: 25%;
  margin-top: 4rem;
  display: flex; 
  justify-content: flex-end; 
  position: fixed;
  top: 0;
  right: 0;
  background-color: #fff; 
}
.ds-header{
    display: flex;
}
.nav-container ul li a {
  color: black;
  display: flex;
  align-items: center;
  opacity: 1; /* Set opacity to 1 for no transparency */
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
    /*new stuff*/
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