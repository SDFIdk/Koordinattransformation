<template>
  <div class="container">
    <h1>Koordinattransformation</h1>
    <h3>Udviklet af <a href="https://sdfi.dk/" target="_blank">SDFI</a>.</h3>
    <h4>
      Muliggør transformation mellem forskellige aktuelle og historisk anvendte koordinatsystemer.
      <br>
      <br>
      Vælg et input- og outputkoordinatsystem. Vælg derefter et sæt inputkoordinater for at fortage transformationen.
      <br>
      <br>
      Inputkoordinater vælges ved enten at indtaste dem selv, trykke på kortet, eller indtaste en addresse i søgefeltet.
      <br>
      <br>
      Bruger det valgte koordinatsystem enheden decimalgrader (DD), kan koordinaterne formateres mellem grader, decimalminutter (min.) og grader, minutter, sekunder (min. sek.).
      <!-- <br>
      <br> -->
      Ellers vil enheden stå som meter [m].
      <br>
      <br>
      Når de ønskede outputkoordinater er fundet, kan du trykke på 'Kopiér'-knappen og få koordinaterne kopieret til udklipsholderen.
      <br>
      <br>
      <a href="https://dataforsyningen.dk/help">Kontakt support for hjælp.</a>
    </h4>
    <h6>Powered by <a href="https://docs.dataforsyningen.dk/#webproj" target="_blank">Webproj</a></h6>
  </div>
</template>

<script>
export default {
  name: 'AboutView'
}
</script>

<style scoped>
.container {
  margin-left: 5rem;
}
h1, h2, h3, h4, h5, h6 {
  margin: 1.25rem;
}
h4 {
  font-weight: normal;
}
</style>
