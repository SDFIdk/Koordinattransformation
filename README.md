# Koordinattransformation

Koordinattransformation er en Vue.js applikation der gør det let at transformere koordinater mellem forskellige referencesystemer.

før projektet kan installeres, er det nødvendigt at installere
npm version: >=8.5.2 og
node version: >=17.6.0

## setup a projektet
```
npm install
```

### Tilpasning af konfiguration

Applikationen kræver et par *environment variables* til stede i root folderen. Disse er som følger:
```
VITE_NODE_ENV = [production | development | staging]
VITE_TOKEN = [Dataforsyning token for authentification]
VITE_API_BASEURL = [Dataforsyning API URL]
```
Du kan gemme disse variabler i .env filer i projektets root mappe **eller i parent directory** for avanceret konfiguration

For anden specifik konfiguration af Vue.js, se: [Configuration Reference](https://cli.vuejs.org/config/).

## Scripts

### Start server med hot-reload til udvikling
```
npm run serve
```

### Compile og minify til produktion
```
npm run build
```

### Linter og fixer filer
```
npm run lint
```
