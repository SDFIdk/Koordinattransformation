# Koordinattransformation

Koordinattransformation er en Vue.js applikation der gør det let at transformere koordinater mellem forskellige referencesystemer.

før projektet kan installeres, er det nødvendigt at installere
- node.js version: >=17.6.0 [link til download](https://nodejs.org/en/)
- npm version: >=8.5.2, dette gøres igennem node.js installeren.

## setup a projektet
For at kunne køre projektet, er der nogle miljøvariable, der skal føres ind i projektet.
Disse ligger i [Koordinattransformation_config](https://github.com/SDFIdk/Koordinattransformation-config) og hedder henholdsvis: `.env.development`, `.env.production` og `.env.staging`. kopier disse filer ind i root directory af projektet.

- Naviger til projektet i terminalen
- tast `npm install` for at installere npm dependencies. Disse er senere at finde i ./node_modules

Herfra har man tre muligheder:
- `npm run dev` for at køre projektet i localhost. portnummeret vil blive vist i terminalvinduet.
- `npm run build` for at compile og minify projektet til produktion
- `npm run lint` for at linte med eslint



For anden specifik konfiguration af Vue.js, se: [Configuration Reference](https://cli.vuejs.org/config/).


