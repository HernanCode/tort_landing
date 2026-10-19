# Estat del projecte — punt de represa

Fitxer per continuar en una sessió nova sense reconstruir el context. El detall llarg és al
`README.md`; aquí només hi ha el que fa falta per reprendre.

## Què és

Proposta de look & feel de la landing de **Contenidors i Gestió de Residus Tort** (Manresa) per a
Cabra Design. Contingut en català. Objectiu: captació de pressupostos. Referència visual:
`design.MD` (Joby Aviation), adaptada a la paleta i la tipografia de la marca.

## Com veure-ho

Servidor local al port **8779** servint `/home/samuel/proyectos/tort/landing`:

```bash
cd /home/samuel/proyectos/tort/landing && python3 -m http.server 8779
```

## Estat actual

- `index.html` completa i navegable.
- Seccions vives: Hero (carrusel 3 imatges + revelat al scroll), Serveis, Autoritzacions,
  Què gestionem, Galeria, Ubicació, Contacte, Peu, avís de cookies.
- Seccions **comentades** al codi: «Qui som», «Fotografia a sang», «Com funciona», «Preguntes».
- Menú a pantalla completa (foto a l'esquerra + enllaços gegants a la dreta, telèfon i
  «Pressupost» a baix), amb focus atrapat, `aria`, mòbil i `prefers-reduced-motion`.
- Revelat en scroll de tot el que va després del hero (fosa + desplaçament, escalonat als blocs
  repetits), amb `IntersectionObserver`, sense JS tot visible i `prefers-reduced-motion` respectat.
- Ritme de color: hero foto → Serveis blanc → Autoritzacions blau suau `#AED5EE` → Què gestionem
  blanc → Galeria paper `#F0EDE9` → Ubicació blanc → Contacte verd suau `#B9DFBD` (targeta ampla).
- Pàgines legals: `avis-legal.html`, `politica-de-cookies.html`, `politica-de-privacitat.html`,
  `404.html`.

## Decisions clau

- Tipografia: **Manrope** només; titulars pes 500, tracking negatiu. Mai 700.
- Accions: pastilles delineades. Única excepció: botó «Pressupost» del menú, ple en vermell.
- No hi ha degradats de superfície (només el vel del hero).
- Sobre fons de color suau el text va en tinta `#231F20` (contrast 6,7–10,6:1). Blanc sobre
  `#E63030` és 4,35:1: només per a text gran.
- `--blue-soft` i `--green-soft` surten de barrejar els corporatius amb blanc.
- Contacte: `.section--wide` (fins a 1920 px) en lloc dels 1200 px de la resta.
- Secció de contacte: formulari limitat a 720 px a partir de 1500 px.

## Pendent (per ordre suggerit)

1. **Pàgines de servei** `serveis/gestio-de-residus.html`, `reciclatge-de-residus.html` i
   `transport-de-residus.html`. Ara donen 404: hi enllacen els «Veure més» de la landing i el
   submenú del menú.
2. **Slide 3 del hero**: el títol parla de «Destrucció de documents importants» però la imatge és
   la de la jaqueta. Cal una foto de documentació / trituradora / arxiu.
3. **Textos dels slides**: només hi ha els 3 títols; falten subtítols o textos llargs si el client
   els vol.
4. **Revisió legal** de les tres pàgines: els textos són adaptats dels del client i encara hi apareix
   l'adreça antiga (Carretera Viladordis).
5. **Logos oficials** (`assets/oficial/`): SDR i Generalitat són de baixa resolució; calen els
   originals.
6. **Telèfon als contenidors**: a les fotos hi ha el 93 872 85 69 al costat del 93 873 02 37.
   Decidir quin és el bo o si es retoquen les imatges.
7. **Formulari**: és un prototip (`preventDefault`, sense backend).
8. Decidir si s'eliminen les carpetes antigues `propuesta/` i `propuesta-v2/`.

## Avisos tècnics

- **Cau de memòria cau**: `style.css` i `main.js` es carreguen amb `?v=20261019-7` a totes les
  pàgines. En tocar CSS o JS cal pujar aquest valor o el navegador servirà la versió vella.
- Les captures de pàgina sencera del navegador donen artefactes (hero, imatges lazy): verificar
  secció a secció per `id`.
- El navegador pot trigar un frame a pintar el panell del menú (`backdrop-filter`); no és un error.
- `--p` del hero s'actualitza amb el scroll; si es fa `scrollTo(0,0)` cal esperar ~400 ms.

## Fitxers

- `index.html`, `css/style.css`, `css/tokens.css`, `js/main.js`
- `README.md` — decisions, tokens, mapa d'imatges, seccions
- `continguts-web-actual.md` — inventari del web actual del client
- `design.MD`, `variables.css`, `tailwind.css` — referència i tokens de l'equip
