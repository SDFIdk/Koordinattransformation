<template>
  <div data-theme="light" class="container">
    <h1>Koordinattransformation</h1>
    <h3>Udviklet af <a href="https://kds.dk/" target="_blank">Klimadatastyrelsen</a>. </h3>
    <h4>
      Koordinattransformation.dk muliggør transformation mellem forskellige aktuelle og historisk anvendte
      koordinatsystemer i Danmark og Grønland. Applikationen giver adgang til et udvalg af de mest anvendte
      koordinatsystemer og tilhørende transformationer. I det tilfælde en ønsket transformation
      ikke er tilgængelig henvises til PROJ eller andre værktøjer der implementerer transformationer registeret
      i EPSG-databasen.
    </h4>
    <h4>
    1. Vælg hvilket land koordinaten, der skal transformeres, stammer fra. Det gøres øverst på siden, hvor der kan vælges mellem Danmark og Grønland
    </h4>
    <h4>
      2. Vælg et input- og outputkoordinatsystem. Vælg derefter et sæt inputkoordinater for at foretage transformationen.
      <div><h4>Inputkoordinater vælges ved enten at indtaste dem selv, trykke på kortet, eller indtaste en addresse i søgefeltet.</h4></div>
    </h4>
    <h4>
      3. Er det valgte koordinatsystem givet med enheder i decimalgrader (DD), kan koordinaterne formateres mellem grader, decimalminutter (min.) og grader, minutter, sekunder (min. sek.).
    </h4>
    <h4>4. Når de ønskede outputkoordinater er fundet, kan du trykke på 'Kopiér'-knappen og få koordinaterne kopieret til udklipsholderen.</h4>
    <h6><router-link to="/was" target="_blank">Tilgængelighedserklæring</router-link></h6>
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
