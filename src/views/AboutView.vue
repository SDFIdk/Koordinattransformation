<template>
  <div data-theme="light" class="container">
    <h1>Koordinattransformation</h1>
    <h3>Udviklet af <a href="https://kds.dk/" target="_blank">Klimadatastyrelsen</a>. </h3>
    <h4>Muliggør transformation mellem forskellige aktuelle og historisk anvendte koordinatsystemer.</h4>
    <ol>
      <li>
        Vælg et input- og outputkoordinatsystem. Vælg derefter et sæt inputkoordinater for at foretage transformationen. <br>
        Inputkoordinater vælges ved enten at indtaste dem selv, trykke på kortet, eller indtaste en addresse i søgefeltet.
      </li>
      <li>
        Bruger det valgte koordinatsystem enheden decimalgrader (DD), kan koordinaterne formateres mellem grader, decimalminutter (min.) og grader, minutter, sekunder (min. sek.).
        <br> Ellers vil enheden stå som meter [m].
      </li>
      <li>
        Når de ønskede outputkoordinater er fundet, kan du trykke på 'Kopiér'-knappen og få koordinaterne kopieret til udklipsholderen.
      </li>
    </ol>
    <h6><router-link to="/was" target="_blank">Tilgængelighedserklæring</router-link></h6>
    <h6>Powered by <a href="https://docs.dataforsyningen.dk/#webproj" target="_blank">Webproj</a></h6>
  </div>
</template>

<script setup>

</script>

<style scoped>
h1, h2, h3, h4, h5, h6, ol{
  margin: 1.25rem;
}
h1 {
  font-size: 1.875rem;
}
h3 {
  margin: 1.5rem 1.25rem;
}
h6 {
  margin-top: 2rem;
}
h4 {
  font-weight: normal;
}
</style>
