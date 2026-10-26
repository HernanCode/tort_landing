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

- `index.html` completa i navegable, amb els serveis agrupats en 3 blocs (Contenidors, Recollida i
  gestió, Serveis especials) + bloc de sectors.
- 18 pàgines de servei a `serveis/<slug>/` generades des de `serveis/data/serveis.json` i
  `serveis/_template.html` amb `scripts/build-serveis.py`. Model de 7 blocs: capçalera, què és,
  per a qui, 3 passos, residus acceptats, FAQ, relacionats i CTA.
- Peu complet: 4 columnes, logos ARC/Generalitat i codis; formulari amb foto i els 18 serveis.
- Empresa: secció a la home + pàgina `/empresa/` (50+ anys, empresa familiar, planta nova).
- Contenidors: 4 mides a la home i fitxes a `/serveis/lloguer-de-contenidors/#mides`.
- Autoritzacions: E-211.96, T-663, CRT de RAEE, Gremi i enllaç de verificació ARC.
- SEO: canòniques, `og:image`, JSON-LD (`LocalBusiness`, `Service`, `FAQPage`), `sitemap.xml` i `robots.txt`.
- Seccions vives: Hero (carrusel de 3 vídeos de 5 s optimitzats: 1280/960, MP4 primer, posters WebP i càrrega diferida), Serveis, Autoritzacions,
  Què gestionem, Galeria, Ubicació, Contacte, Peu, avís de cookies.
- Seccions **comentades** al codi: «Qui som», «Fotografia a sang», «Com funciona», «Preguntes».
- Menú a pantalla completa (foto a l'esquerra + enllaços gegants a la dreta). El telèfon i el CTA
  es queden al header, al mateix lloc; a mòbil, la barra inferior es manté visible sobre el menú.
- Header amb logotip gran, telèfon clicable i CTA «Demana pressupost»; barra fixa que passa a
  blanca en fer scroll. A ≤900 px, barra inferior fixa amb «Trucar» i «Demana pressupost».
- Revelat en scroll de tot el que va després del hero (fosa + desplaçament, escalonat als blocs
  repetits), amb `IntersectionObserver`, sense JS tot visible i `prefers-reduced-motion` respectat.
- Ritme de color: hero foto → Serveis blanc amb 3 columnes per tipus i tints pàl·lids (`--blue-wash`, `--green-wash`, paper) → Sectors paper →
  Contenidors verd molt clar `#EFF8F0` → Empresa paper → Autoritzacions blau suau `#AED5EE` →
  Què gestionem blanc → Galeria paper → Ubicació blau molt clar → Contacte blanc + targeta verda
  `#B9DFBD`.
- Pàgines legals: `avis-legal.html`, `politica-de-cookies.html`, `politica-de-privacitat.html`,
  `404.html`.

## Decisions clau

- Tipografia: **Manrope** només; titulars pes 500, tracking negatiu. Mai 700.
- CTA principal únic: **«Demana pressupost»**, pastilla plena en `--brand-red-ink` (header, menú,
  barra mòbil i formulari). La resta d'accions són pastilles delineades.
- No hi ha degradats de superfície (només el vel del hero).
- Sobre fons de color suau el text va en tinta `#231F20` (contrast 6,7–10,6:1). Blanc sobre
  `#E63030` és 4,35:1: només per a text gran; per a text petit es fa servir `--brand-red-ink`
  (`#C42A2A`, 5,6:1), que també passa sobre els tints `--blue-wash` i `--green-wash`.
- `--blue-soft` i `--green-soft` surten de barrejar els corporatius amb blanc.
- Contacte: `.section--wide` (fins a 1920 px) en lloc dels 1200 px de la resta.
- Secció de contacte: formulari limitat a 720 px a partir de 1500 px.

## Pendent (per ordre suggerit)

1. **Pàgines de servei**: 18 pàgines generades des del JSON. Per canviar textos o afegir un servei,
   editar `serveis/data/serveis.json` i executar `python3 scripts/build-serveis.py`.
2. **Fotos reals per servei** (contenidors amb escala, documents, perillosos, RAEE, runes, cable,
   vehicles, fosses, desembussos, extintors, neteges) i retocar les fotos de contenidors amb el
   telèfon antic.
3. **Dades per confirmar**: mides de contenidors, dies de lloguer, permisos de via pública,
   ISO/CRT/UNE i àrea de servei.
4. **Revisió legal** de les tres pàgines: els textos són adaptats dels del client i encara hi apareix
   l'adreça antiga (Carretera Viladordis).
5. **Logos oficials** (`assets/oficial/`): SDR i Generalitat són de baixa resolució; calen els
   originals.
6. **Formulari**: és un prototip (`preventDefault`, sense backend). Ja té foto opcional i els 18 serveis.
7. **Empresa (dades)**: fundació, generacions, m², camions, persones, timeline i foto antiga.
8. **Autoritzacions pendents**: ISO 9001/14001/45001 i UNE-EN 15713 (CRT, Gremi i verificació ARC ja hi són).
9. **Contenidors pendents**: mesures reals, permisos/dies, selector i fotos amb escala.
10. **SEO pendent**: `hreflang`/ES, 301, Core Web Vitals i Google Business/NAP.
11. **Gremi**: logo i enllaç al peu.
12. Decidir si s'eliminen les carpetes antigues `propuesta/` i `propuesta-v2/`.

## Avisos tècnics

- **Vídeos**: els originals 4K són a `../videos-origen/` (fora del deploy). A `assets/videos/` només hi ha les versions 1280/960 en MP4 i WebM.
- **Cau de memòria cau**: `style.css` i `main.js` es carreguen amb `?v=20261019-47` a totes les
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
