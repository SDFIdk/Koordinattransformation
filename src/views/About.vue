<template>
  <div class="container">
    <h1>Koordinattransformation</h1>
    <h3>Udviklet af <a href="https://kds.dk/" target="_blank">Klimadatastyrelsen</a>. </h3>
    <h4>Muliggør transformation mellem forskellige aktuelle og historisk anvendte koordinatsystemer.</h4>
    <h4>
      1. Vælg et input- og outputkoordinatsystem. Vælg derefter et sæt inputkoordinater for at foretage transformationen.
      <div><h4>Inputkoordinater vælges ved enten at indtaste dem selv, trykke på kortet, eller indtaste en addresse i søgefeltet.</h4></div>
    </h4>
    <h4>
      2. Bruger det valgte koordinatsystem enheden decimalgrader (DD), kan koordinaterne formateres mellem grader, decimalminutter (min.) og grader, minutter, sekunder (min. sek.).
      <div><h4>Ellers vil enheden stå som meter [m].</h4></div>
    </h4>
    <h4>3. Når de ønskede outputkoordinater er fundet, kan du trykke på 'Kopiér'-knappen og få koordinaterne kopieret til udklipsholderen.</h4>
    <h6>Powered by <a href="https://docs.dataforsyningen.dk/#webproj" target="_blank">Webproj</a></h6>
  </div>
</template>

<script>
export default {
  name: 'AboutView'
}
</script>

<style scoped>
ol > li {
    margin-left: 10px;
}
.container {
  margin: 2rem 0 0 2rem;
}
h1, h2, h3, h4, h5, h6 {
  margin: 1.25rem;
}
h1 {
  font-size: 30px;
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
