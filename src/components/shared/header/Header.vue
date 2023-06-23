<!-- 
    Denne komponent kunne gøres med en enkelt div og conditional rendering, 
    men så kan vi ikke bruge @dataforsyningen css 
-->

<template>
    <div class="nav-container" style="display: flex; justify-content: space-between;">
        <!-- HORIZONTAL NAVBAR -->
        <Brand />
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
        <!-- VERTICAL NAVBAR (NÅR SKÆRMEN ER MEGET SMAL) -->
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
