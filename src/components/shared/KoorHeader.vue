<template>
  <header class="ds-header koor-header">
    <router-link
      to="/"
      class="quiet KT-logo"
      role="link"
    >
      <ds-logo-title
        id="koor-hover-icon"
        title="Koordinattransformation"
        byline="Klimadatastyrelsen"
        style="margin: 0;"
      />
    </router-link>
    <ds-nav-responsive class="switch koor-nav">
      <!-- Use the #toggle slot inside a <template> -->
      <button 
        slot="toggle"
        title="Vis menu"
        class="secondary"
      >
        <svg><use href="../../assets/icons/icons.svg#burgerbar" /></svg>
      </button>

      <nav class="ds-panel ds-nav">
        <router-link to="/Denmark">
          <span class="medium">
            <svg><use href="../../assets/icons/icons.svg#denmark" /></svg>
          </span>
          <span class="KT-route"> Danmark</span>
        </router-link>
        <router-link to="/Greenland">
          <span class="medium">
            <svg><use href="../../assets/icons/icons.svg#greenland" /></svg>
          </span>
          <span class="KT-route"> Grønland</span>
        </router-link>
        <router-link to="/About">
          <span class="medium">
            <svg><use href="../../assets/icons/icons.svg#info" /></svg>
          </span>
          <span class="KT-route"> Om Koordinattransformation</span>
        </router-link>
      </nav>
    </ds-nav-responsive>
  </header>
</template>

<script setup>
</script>

<style>
</style>