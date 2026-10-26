# TORT — Landing

Landing page de *Contenidors i Gestió de Residus Tort* construïda a partir de `design.MD`,
amb la marca, els colors i la tipografia del manual d'identitat, i amb les imatges de `imagenestort/`.

## Com veure-ho

```
cd landing
python3 -m http.server 8779
# → http://localhost:8779/index.html
```

No necessita build ni dependències (només Google Fonts). Els tokens són a `css/tokens.css`,
que és una còpia de `variables.css`.

## Fitxers

```
landing/
├── index.html                      # la pàgina
├── avis-legal.html                 # legal
├── politica-de-cookies.html        # legal
├── politica-de-privacitat.html     # legal
├── 404.html                        # error personalitzat
├── serveis/
│   ├── _template.html              # plantilla única de pàgina de servei
│   ├── data/serveis.json           # 18 fitxes (textos, SEO, imatge, grup)
│   ├── lloguer-de-contenidors/     # generades pel script
│   ├── transport-de-residus/
│   └── …                           # 18 carpetes en total
├── empresa/index.html               # pàgina Empresa
├── scripts/build-serveis.py        # genera les pàgines, la graella, el sitemap i robots.txt
├── sitemap.xml                     # generat
├── robots.txt                      # generat
├── css/
│   ├── tokens.css                  # còpia de variables.css de l'equip
│   └── style.css                   # sistema visual
├── js/main.js                      # scroll, vídeo del hero, formulari i cookies
└── assets/
    ├── logo/                       # logos vectorials del manual (SVG)
    ├── oficial/                    # logos SDR i Generalitat
    └── img/                        # hero, galeria i seccions (WebP + JPEG)
```

## Seccions de la pàgina

1. **Nav isla** — hamburguesa (obre el menú), logotip centrat, telèfon clicable i CTA «Demana pressupost»
2. **Hero** — carrusel de 3 vídeos de 5 s amb animació lligada al scroll
3. **Serveis** — 18 serveis en 3 blocs (Contenidors, Recollida i gestió, Serveis especials), amb icona, una línia i enllaç a la pàgina de cada servei
4. **Sectors** — indústria, construcció, alimentació, comerç i administració
5. **Contenidors** — 4 mides (3, 5, 7–9 i 14–30 m³) amb enllaç a la fitxa
6. **Empresa** — 50+ anys, empresa familiar i planta nova, amb enllaç a `/empresa/`
7. **Autoritzacions** — E-211.96, T-663, CRT de RAEE, Gremi, logos i enllaç de verificació ARC
8. **Què gestionem** — llistat de residus que es tracten
9. **Galeria** — 7 imatges en graella editorial
10. **Ubicació** — mapa OpenStreetMap + enllaç a Google Maps
11. **Contacte** — formulari amb validació, foto opcional i consentiments
12. **Peu** — CTA final, 4 columnes (Tort · Serveis · Empresa · Contacte), confiança (ARC/Generalitat i codis) i legal
13. **Barra mòbil** — Trucar / Demana pressupost, fixa a baix (≤900 px)
14. **Avís de cookies** — acceptar / rebutjar (comentat a la portada per a la proposta)

> Les seccions «Qui som», «Fotografia a sang», «Com funciona» i «Preguntes freqüents» segueixen al
> codi comentades. Es poden recuperar descomentant el bloc corresponent.

## Pàgines de servei

Les 18 pàgines de servei **no s'escriuen a mà**: surten d'una plantilla i d'un JSON.

- `serveis/data/serveis.json`: una fitxa per servei amb slug, grup, nom, H1, meta title/description,
  entradilla, «què és», «per a qui», 3 passos, residus acceptats, FAQ, CTA, imatge i relacionats.
- `serveis/_template.html`: la plantilla única (7 blocs).
- `scripts/build-serveis.py`: genera `serveis/<slug>/index.html` i actualitza la graella de la home
  entre `<!-- SERVEIS:START -->` i `<!-- SERVEIS:END -->`.

Per canviar textos o afegir un servei: editar el JSON i executar

```bash
cd landing && python3 scripts/build-serveis.py
```

Cada pàgina té set blocs:

1. **Capçalera** (`.page-hero`): fil d'Ariana, kicker, H1 «servei + Manresa» i entrada.
   Si el servei no té foto pròpia, fa servir `.page-hero--plain` (fons de marca, sense imatge).
2. **Què és** (`.service-intro`): titular, entrada i paràgrafs + «Per a qui» en columna.
3. **Com funciona** (`.steps`): tres passos.
4. **Residus acceptats** (`.materials`): llista a dues columnes.
5. **Preguntes freqüents** (`.faq`): `<details>` amb 3–4 preguntes.
6. **També et pot interessar** (`.related`): enllaços a serveis relacionats.
7. **CTA final** (`.cta.cta--page`): frase pròpia del servei + telèfon, correu i botó.

Rutes: les pàgines viuen a `serveis/<slug>/` i fan servir `../../assets/`, `../../css/`,
`../../index.html#...`. El menú i la barra s'inicialitzen a qualsevol pàgina que inclogui el markup
(`main.js` ja no depèn de `#hero`).

## Menú de navegació

Pantalla completa (`100svh`), fons carbó `#231F20`, sense panell flotant ni elements extra.

- **Esquerra (50 %)**: una sola foto a sang (`slide-operari-*`, l'operari amb l'uniforme),
  de dalt a baix i fins a les vores, sense cantonades ni textos a sobre.
- **Dreta (50 %)**: Serveis, Contenidors, Empresa, Autoritzacions, Ubicació i Contacte en tipografia molt
  gran (fins a 104 px), pes 300, alineats a l'esquerra i repartits en vertical. El telèfon i el CTA
  no són dins del menú: es queden al header, al mateix lloc.
- **Hover**: l'enllaç apuntat es manté i la resta baixa al 50 % d'opacitat (≈5:1 sobre el carbó, AA).
- **Barra**: es manté a sobre del menú (logotip centrat i la X a l'esquerra). El telèfon i el CTA
  continuen visibles i a la mateixa posició; el padding del header es compensa perquè no es moguin
  ni un píxel quan desapareix la barra de scroll.
- **Mòbil**: una sola columna, sense foto; enllaços grans a dalt. La barra inferior amb «Trucar» i
  «Demana pressupost» es manté visible sobre el menú, al mateix lloc que quan és tancat.
- **Teclat**: `aria-expanded` al botó, `aria-modal` al diàleg, `inert` quan és tancat, focus atrapat
  entre la barra, el menú i la barra mòbil, `Esc` per tancar i retorn del focus a l'hamburguesa.
- **Moviment**: fosa general i entrada escalonada dels enllaços (60–340 ms); amb
  `prefers-reduced-motion` s'anul·len els retards i les transicions.

El menú es tanca amb la X i amb `Esc` (no amb clic fora). Els CTA del header, el logo i la barra
mòbil també tanquen el menú abans de navegar.

### Ritme de color

La pàgina alterna superfícies perquè no tot sigui blanc:

| Secció | Fons |
| --- | --- |
| Hero | fotografia + capa vermella al revelar |
| Serveis | blanc |
| Autoritzacions | **blau de marca aclarit `#AED5EE`** a sang (E-211.96 / T-663 en tipografia gran) |
| Galeria | paper càlid `#F0EDE9` a sang |
| Ubicació | blanc |
| Contacte | **verd de marca aclarit `#B9DFBD`**, targeta arrodonida amb el formulari blanc a dins |

La secció de contacte fa servir `.section--wide`: el contenidor arriba fins a `100% - 48px` (amb un
màxim de 1920 px) en lloc dels 1200 px de la resta de la pàgina, de manera que la targeta verda ocupa
gairebé tota l'amplada de la finestra. A partir de 1500 px el formulari es limita a 720 px i els
contactes baixen al nivell del peu del formulari.

Els modificadors són `.section--red`, `.section--blue`, `.section--paper` i `.section--wide`. Cada franja defineix les
seves variables `--band-ink`, `--band-muted` i `--band-rule`, de manera que canviar de color és tan
simple com canviar la classe de la secció. La variant vermella queda implementada per si es vol
recuperar.

Els tons suaus surten de barrejar els corporatius amb blanc: `--blue-soft: #AED5EE` i
`--green-soft: #B9DFBD`. Sobre aquests fons el text va en tinta fosca (`#231F20`), que dona 6,7:1
sobre el verd i 10:1 sobre el blau; amb blanc no arribaríem a 3:1.

### Pàgines legals

Contingut adaptat dels textos legals de la web actual, actualitzats. **Cal revisió per part d'un
assessor abans de publicar**, i cal actualitzar-hi l'adreça quan es confirmi la nova ubicació.

## El hero (el punt central)

### Carrusel de 3 vídeos de 5 s

El hero manté el carrusel de sempre (títols, punts i pausa), però cada slide és un **vídeo de 5 s**:

| # | Contingut | Títol | Fitxers |
|---|---|---|---|
| 1 | Planta nova, vista aèria | Gestió de residus a Manresa | `hero-1-1280` / `hero-1-960` + `hero-1-poster.webp` |
| 2 | Cinta de classificació | Classificació i tractament | `hero-2-1280` / `hero-2-960` + `hero-2-poster.webp` |
| 3 | Pala movent residus | Recollida i transport | `hero-3-1280` / `hero-3-960` + `hero-3-poster.webp` |

- Cada slide passa al següent **0,3 s abans** que acabi el vídeo (`timeupdate`), amb fosa de 0,6 s:
  així no es repeteix l'últim frame. El temporitzador de 5,2 s queda com a xarxa de seguretat.
- `muted`, `playsinline`, sense controls; `loop` com a xarxa de seguretat; el JS fa `play()` del slide actiu i pausa la resta.
- **MP4 primer** (H.264, descodificació per maquinari) i WebM de reserva.
- **1280 px** en escriptori i **960 px** en mòbil (≤900 px).
- `preload="none"` i només el slide actiu descarrega el vídeo; els altres esperen.
- El primer vídeo arrenca de seguida. El poster WebP és el **primer frame** i queda superposat fins que el vídeo reprodueix; llavors es fon en 0,35 s. Així no es veu el salt del poster al vídeo.
- El **següent vídeo es precarrega als 2,5 s** perquè el canvi de slide sigui instantani.
- Si el vídeo bufferitza, torna el poster fins que reprèn; si l'autoplay falla, el botó passa a play per arrencar-lo amb un toc.
- Amb `prefers-reduced-motion`, `saveData` o connexió 2G no es descarrega cap vídeo: es veu el
  poster i els punts continuen funcionant. En 3G sí que es reprodueix.
- Es pausa en obrir el menú, en canviar de pestanya i quan el hero surt de pantalla.
- Passar el ratolí pels controls **no** atura el vídeo; només el botó de pausa.

> Mides: MP4 0,7 / 0,5 / 1,2 MB en escriptori i 0,4 / 0,3 / 0,6 MB en mòbil. Posters WebP de
> 124 / 42 / 155 KB. Orígens: `7525961-uhd_2560_1440_30fps.mp4` (planta), `14210989-uhd_4096_2160_25fps.mp4`
> (cinta) i `14099318_3840_2160_30fps.mp4` (pala), retallats a 5 s i sense àudio. Els originals
> pesats són a `../videos-origen/`, fora de `landing/`, perquè no es despleguin.

### Animació lligada al scroll

**Estat inicial (scroll = 0):** vídeo a sang, sense radis i sense franja de color. Ocupa tota
la pantalla (`100svh`) i les cantonades són rectes.

**Amb scroll:** el contenidor és `sticky` i el vídeo es transforma de manera progressiva:

- `border-radius` de 0 fins a 84 px (40 px en mòbil)
- `scale` de 1 fins a 0,93 i un lleuger desplaçament cap amunt, de manera que queden buits als
  costats i, sobretot, a baix
- per darrere hi ha una capa de **color sòlid de marca** (`--hero-layer`) que apareix pels buits

És **reversible** (en pujar, el vídeo torna a ocupar tota la pantalla) i va lligat a la posició del
scroll, no a un temporitzador: `main.js` calcula el progrés amb `scroll` passiu i `requestAnimationFrame`,
i l'escriu a la variable CSS `--p`. Tot el moviment es resol amb `calc()` sobre aquesta variable.

Amb **`prefers-reduced-motion: reduce`** no hi ha animació: es queda l'estat inicial, la secció no
és sticky i el text de la franja és visible.

Es pot passar a **CSS scroll-driven animations** (`animation-timeline: scroll()`) quan el suport
sigui universal; el JS actual té unes 15 línies i funciona a tots els navegadors.

### Aparició en fer scroll (després del hero)

Totes les seccions que venen després del hero (Serveis, Autoritzacions, Què gestionem, Galeria,
Ubicació, Contacte i el peu) apareixen amb una fosa i un lleuger desplaçament cap amunt a mesura
que entren a la pantalla.

- `main.js` marca els elements amb `.reveal` i un `IntersectionObserver` hi afegeix `.is-in` quan
  entren (una sola vegada, `unobserve`). Els blocs repetits (targetes de servei, materials, imatges
  de la galeria, credencials, columnes del peu…) es **escalonen** amb `--reveal-delay`.
- L'estat ocult només s'aplica amb la classe `html.reveal-on`, que posa el JS: **sense JavaScript tot
  el contingut es veu igualment**.
- Amb `prefers-reduced-motion: reduce` el JS no s'activa i el CSS força tot visible.
- Xarxa de seguretat: en arribar al final de la pàgina es mostren els elements que quedin per si el
  marge inferior de l'observador no els hagués activat.

## Imatges

| Ús | Origen | Sortida |
|---|---|---|
| Hero · 1 | `7525961-uhd_2560_1440_30fps.mp4` (planta aèria, 5 s) | `hero-1-1280` / `hero-1-960` + `hero-1-poster.webp` |
| Hero · 2 | `14210989-uhd_4096_2160_25fps.mp4` (cinta, 5 s) | `hero-2-1280` / `hero-2-960` + `hero-2-poster.webp` |
| Hero · 3 | `14099318_3840_2160_30fps.mp4` (pala, 5 s) | `hero-3-1280` / `hero-3-960` + `hero-3-poster.webp` |
| Serveis (hero) | `mainimage.jpeg` · `Look_Tort19` · `Look_Tort3` · `galeria-01` | `slide-interior-1600` / `slide-operari-1600` / `entrada-tort-1600` / `galeria-01-1200` |
| Secció «L'equip» | `imagenestort/Look_Tort5` | `taller-tort-1600` / `1000` |
| Ubicació | `imagenestort/Look_Tort3` (cartell d'entrada) | `entrada-tort-1600` / `1000` |

El vídeo surt en **WebM + MP4** i amb poster JPG. Les imatges de servei surten en **WebP** i
**JPEG**, amb `loading="lazy"` excepte la de la capçalera.

> Nota: `mainimage.jpeg` fa 1365×768. Per a pantalles molt grans es pot veure lleugerament tova;
> amb una foto definitiva de més resolució n'hi ha prou de substituir els fitxers mantenint el nom.

## Sistema visual

Segueix `design.MD` (referència editorial cinematogràfica), adaptat a la marca:

| Rol a `design.MD` | Aquí |
|---|---|
| Parchment cream `#f5f4df` (llenç) | Blanc `#FFFFFF` — la marca no té crema |
| Carbon ink `#0e1620` (text) | `#231F20`, el negre corporatiu del manual |
| Electric blue `#007ae5` (franja) | Vermell de marca `#E63030` |
| Outlined action `#083e6f` (acció) | Acció delineada en tinta o vermell de marca |
| jobyDisplay / jobyText | **Manrope** (l'única família digital del manual) |

**Per què vermell i no blau:** la foto del hero és blava (maquinària, terra, sostre), i una franja
blava s'hi confonia. El vermell de marca és l'únic color de la paleta que no apareix a la fotografia,
i és el color dels contenidors de l'empresa.

Es canvia en una línia, a `css/style.css`:

```css
--hero-layer: var(--brand-red);   /* o var(--brand-blue) / var(--brand-dark) */
--hero-layer-ink: #FFFFFF;        /* text de la franja */
```

> Contrast: blanc sobre `#E63030` és **4,35:1**; sobre un `#C62828` baixaria a **5,7:1**. La
> referència fa exactament el mateix (blanc sobre el seu blau elèctric = 4,0:1). Si cal AA estricte
> a la franja, es canvia `--hero-layer` per `#231F20` (blanc hi dona 15:1).

Regles que es respecten: cap botó ple rectangular (les accions són pastilles delineades),
cap degradat de superfície (l'únic és el vel del hero per llegibilitat, tal com demanava el brief),
radis 8 px (botons) / 16 px (targetes) / fins a 160 px (contenidor destacat), tipografia de titular
en pes 500 amb tracking negatiu en comptes de negretes, i una sola família.

## Decisions i desviacions

1. **Logotip de la nav centrat.** Es va provar a l'esquerra per no xocar amb el logotip imprès a la
   jaqueta del hero, però el resultat centrat és més fidel a `design.MD` i la foto del primer slide
   no hi interfereix.
2. **Vel degradat al hero.** `design.MD` diu que no s'hi posin scrims, però el brief demanava
   explícitament un degradat suau més intens a baix perquè el titular es llegís.
3. **Blanc en lloc de crema** i **blau de marca** en lloc de l'electric blue de la referència.

## SEO

- Canòniques i `og:image` a la home i a les 18 pàgines de servei.
- JSON-LD: `LocalBusiness` a la home; `Service` + `FAQPage` a cada servei (generat des del JSON).
- `sitemap.xml` i `robots.txt` generats per `scripts/build-serveis.py`.
- **Domini provisional**: `BASE_URL = "https://hernancode.github.io/tort_landing"` dins del script. Quan el lloc passi al domini final, cal canviar-lo, regenerar i actualitzar les canòniques de `index.html` i les pàgines legals.
- Pendents: `hreflang`/versió ES, 301 de la web antiga, Core Web Vitals i Google Business/NAP.

## Pendent

- [x] **Pàgines de servei**: 18 pàgines generades des de `serveis/data/serveis.json` amb
      `scripts/build-serveis.py`, agrupades a la home (Contenidors · Recollida i gestió · Serveis
      especials) + bloc de sectors.
- [ ] **Fotos reals per servei**: contenidors amb escala, destrucció de documents, residus
      perillosos, RAEE, runes, cable, vehicles, fosses, desembussos, extintors i neteges. Mentre no
      hi siguin, aquests serveis fan servir cabecera tipogràfica o imatges genèriques.
- [ ] **Fotos de contenidors**: les actuals porten el telèfon antic imprès; cal retocar-les o
      substituir-les.
- [ ] **Dades per confirmar**: mides reals dels contenidors, dies de lloguer, permisos de via
      pública, certificacions ISO/CRT/UNE i àrea de servei.
- [ ] Fotografia definitiva de les noves instal·lacions (el vídeo del hero ja és el clip de 5 s).
- [ ] Adreça postal concreta (ara només coordenades) i correu definitiu.
- [ ] **Logos oficials en qualitat**: els actuals s'han recuperat de la web antiga i són de baixa
      resolució. Cal demanar els originals a l'Agència de Residus i a la Generalitat.
- [x] `og:image` 1200×630 (`assets/img/og-tort.jpg`), canòniques, JSON-LD, `sitemap.xml` i `robots.txt`.
- [x] **Peu complet**: CTA final, 4 columnes, logos ARC/Generalitat i codis.
- [x] **Empresa**: secció a la home i pàgina `/empresa/` amb el contingut confirmat.
- [x] **Contenidors**: secció a la home i 4 fitxes a la pàgina de Lloguer.
- [x] **Autoritzacions**: CRT de RAEE, Gremi i enllaç de verificació ARC.
- [ ] **Empresa (dades)**: any de fundació, generacions, m², camions, persones, timeline i foto antiga.
- [ ] Revisió legal dels tres textos.
- [ ] Decidir l'idioma (ara tot en català).
- [ ] Connectar el formulari a un backend o servei d'enviament.
