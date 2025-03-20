<template>
  <div
    data-theme="light"
    class="ds-container about"
  >
    <h1>Koordinattransformation</h1>

    <h3>
      Udviklet af <a
        href="https://kds.dk/"
        target="_blank"
      >Klimadatastyrelsen</a>.
    </h3>
    <p>
      Denne webapplikation tilbyder et simpelt interface til transformation af koordinater i forskellige koordinatsystemer. Der kan vælges mellem de mest udbredte koordinatsystemer brugt i Danmark og Grønland.
      Læs mere om koordinattransformationer på <a href="https://www.klimadatastyrelsen.dk/kortlaegning/geodaesi/koordinattransformation">Klimadatastyrelsens webside</a>
    </p>

    <h4>Vejledning</h4>
    <p>
      Start med at vælge hvilke koordinatsystemer der skal transformeres mellem. Vælg listerne i henholdvis input- og outputsektionerne. Herefter gives en inputkoordinat. 
      Dette kan gøres enten ved at indtaste i koordinatfeltet, klikke på en lokation på koortet eller ved at indtaste en adresse.
      <br>
      Øverst til højre kan skiftes mellem Danmark og Grønland.
    </p>


    <h6>
      <router-link
        to="/was"
        target="_blank"
      >
        Tilgængelighedserklæring
      </router-link>
    </h6>
    <h6>
      Powered by <a
        href="https://docs.dataforsyningen.dk/#webproj"
        target="_blank"
      >Webproj</a>
    </h6>
  </div>
</template>

<script setup>

</script>

<style>
</style>
