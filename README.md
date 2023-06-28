# Koordinattransformation

Koordinattransformation er en Vue.js applikation der gør det let at transformere koordinater mellem forskellige referencesystemer.
Projektet er scaffolded med [Vite]{https://vitejs.dev/} og kørt igennem NPM

For at udvikle og bygge projektet skal man have følgende
- node.js version: >=17.6.0 [link til download](https://nodejs.org/en/)
- npm version: >=8.5.2, dette gøres igennem node.js installeren.

---

## Setup a projektet
For at kunne køre projektet, er der nogle miljøvariable, der skal føres ind i projektet.
Disse ligger i [Koordinattransformation_config](https://github.com/SDFIdk/Koordinattransformation-config) og hedder henholdsvis: 
- `.env.development`, 
- `.env.production` 
- `.env.staging`. <br>

***kopier disse filer ind i root directory af projektet.***

disse refereres efterfølgende med `import.meta.env.[field]` <br>
læs mere om Vite og miljøvariable [her](https://vitejs.dev/guide/env-and-mode.html)


- Naviger til projektet i terminalen <br>

- Installer dependencies igennem npm
```
npm install
```
dependencies er senere at finde i ./node_modules

Herfra har man tre muligheder: <br>
Kør projektet i localhost. (portnummeret vil blive vist i terminalvinduet):
```
npm run dev 
```
Compile og minify projektet til produktion:
```
npm run build
```

Lint med eslint:
```
npm run lint
```
***

Selve transformationerne sker igennem [WEBPROJ](https://github.com/SDFIdk/WEBPROJ/tree/master) <br>
dokumentation til WEBPROJ findes [her](https://docs.dataforsyningen.dk/#webproj)

Koderne fra WEBPROJ bliver derefter store'et i en VUEX store. Under runtime, kan denne ses i developer tools i browseren med Vue extention til henholdsvis [Chrome](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd), 
[firefox](https://devtools.vuejs.org/) 
[Edge](https://microsoftedge.microsoft.com/addons/detail/vuejs-devtools/olofadcdnkkjdfgjcmjaadnlehnnihnl)


## formattering af koordinater
| Koordinater                  | Antal decimaler   |
| ---------------------------- | ----------------- |
| Meter                        | 4 decimaler       |
| Grader                       | 8 decimaler       |
| Grader og minutter           | 0, 6 decimaler    |
| Grader, minutter og sekunder | 0, 0, 4 decimaler |

## Geodæsi
Nogle gode generelle ting at vide:
- [CRS](https://en.wikipedia.org/wiki/Spatial_reference_system) (coordinate reference system) er måde at vise data geospatial data på. det har formatet: DATUM/PROJEKTION[+HØJDESYSTEM] <br>
- [EPSG](https://epsg.io/) er en database over CRS'er varetaget af 'International Association of Oil and Gas Producers'
- En transformation, hvor et to-dimensionelt system indgår, enten som in- eller output, skal ikke have en højdeparameter på outputtet, selvom man umiddelbart har lyst. I en geodætisk sammenhæng er det meningsløst og i sidste ende misvisende at tage højdeparameteren med. 


## Note om Vue
Vue bliver hele tiden opdateret, og der er mange forskellige måder at gøre de samme ting på.
Denne applikation kører på Vue 3 igennem [composition API'en](https://vuejs.org/guide/extras/composition-api-faq.html) med script setup syntax. Dette giver mindre boilerplate og exposer variable og functioner direkte til template'en uden explicit skulle expose dem. <br>
***Vær opmærksom, når du finder referencer og tutorials rundt omkring på nettet, at der bliver snakket om den rigtige version.***
### Liste over indlejrede teknologier
- [Vuex](https://vuex.vuejs.org/) til state management
- [Vite](https://vitejs.dev/) som det underliggende build-step
- [Sass](https://sass-lang.com/) til nemmere styling
- [Vue Router](https://router.vuejs.org/) til... ja... routing

## Note om Inputs og Outputs
Det er ikke helt let at holde styr på hvad input og output er i de forskellige sammenhænge.
eksempelvis har `OutputCard` et output field, som har både inputkoordinater og outputKoordinater.
Disse inputkoordinater skal ikke forvirres med koordinaterne i `InputCard`. Vær opmærksom på, hvor ting kommer fra og skal hen.


## integration af SDFI design system
Alt styling så vidt muligt (nogle ting er specifikke for Koordinattransformation) følger [SDFI design system](https://sdfidk.github.io/design-system-css/).
Også at finde på [Github](https://github.com/SDFIdk/design-system-css). 

Der er to måder hvorpå man kan bruge variabler fra @dataforsyningen:
- `<style>` tag må ikke være scoped
- inline css

inline CSS er ikke muligt på pseudo elementer og heller ikke på conditional classes (`:class={someClass: booleanValue}`)
Derfor giver det mening slet ikke at bruge `<style scoped>` for at holde koden strømlinet og ensformig.

### ikoner
Alle ikoner kommer fra [design-system-icons](https://sdfidk.github.io/design-system-icons/) <br>
Findes også på [Github](https://github.com/sdfidk/design-system-icons). Disse bliver i øjeblikket implementeret som separate Vue components i `components/shared/icons`, da farverne ikke kan tilpasses, hvis man hiver dem fra npm. Nogle ikoner som `ArrowIcon.vue` er implementeret med et par props til at vende den korrekt.

## Baggrundskort
danmarkskortet kommer fra [dataforsyningen's API](https://dataforsyningen.dk/data/962), mens grønlandskortet er en OMS integration. Vi har indtil nu ikke haft en intern WMTS over grønland, men der ligger nu en [WMS version på dataforsyningen](https://dataforsyningen.dk/data/4771)
