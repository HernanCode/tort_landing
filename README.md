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
│   ├── gestio-de-residus.html      # pàgina de servei (avui enllaçada com a «Reciclatge»)
│   ├── transport-de-residus.html   # pàgina de servei
│   └── assessoria-tecnica.html     # pàgina de servei
├── css/
│   ├── tokens.css                  # còpia de variables.css de l'equip
│   └── style.css                   # sistema visual
├── js/main.js                      # scroll, carrusel, formulari i cookies
└── assets/
    ├── logo/                       # logos vectorials del manual (SVG)
    ├── oficial/                    # logos SDR i Generalitat
    └── img/                        # hero, galeria i seccions (WebP + JPEG)
```

## Seccions de la pàgina

1. **Nav isla** — hamburguesa (obre el menú), logotip centrat i enllaç «Pressupost»
2. **Hero** — carrusel de 3 imatges amb animació lligada al scroll
3. **Serveis** — 3 blocs amb imatge (gestió, reciclatge i transport) i enllaç «Veure més» a la pàgina de cada servei
4. **Autoritzacions** — franja blava amb E-211.96 i T-663 en tipografia gran + logos oficials
5. **Què gestionem** — llistat de residus que es tracten
6. **Galeria** — 7 imatges en graella editorial
7. **Ubicació** — mapa OpenStreetMap + dades de contacte
8. **Contacte** — formulari amb validació i consentiments
9. **Peu** — navegació, legal i acreditacions
10. **Avís de cookies** — acceptar / rebutjar, amb el consentiment guardat

> Les seccions «Qui som», «Fotografia a sang», «Com funciona» i «Preguntes freqüents» segueixen al
> codi comentades. Es poden recuperar descomentant el bloc corresponent.

## Pàgines de servei

Patró comú i **deliberadament curt** a `serveis/` (`gestio-de-residus.html` —avui enllaçada des de
la targeta «Reciclatge»—, `transport-de-residus.html` i `assessoria-tecnica.html`):

1. **Capçalera fotogràfica** (`.page-hero`, `data-page-hero`): foto a sang, fil d'Ariana, kicker,
   títol gran i entrada. La barra hi va a sobre i es torna sòlida en passar-la.
2. **«Què fem»** (`.section` + `.split`): titular, entrada i dos paràgrafs, amb una imatge al
   costat. És tot el contingut de la pàgina.
3. **«Explica'ns quins residus generes»** (`.cta.cta--page`): bloc verd amb telèfon, correu i botó
   cap al formulari de la portada.
4. **Peu i avís de cookies** idèntics a la portada.

No hi ha franja d'autoritzacions, ni llistes «Què inclou», ni blocs addicionals: cada servei és una
pàgina curta, no una web dins la web. Els botons intermedis tampoc no calen perquè el CTA final és
just a sota.

Les rutes són totes relatives (`../assets/`, `../css/`, `../index.html#...`). El menú i la barra
s'inicialitzen a qualsevol pàgina que inclogui el markup (`main.js` ja no depèn de `#hero`).

## Menú de navegació

Pantalla completa (`100svh`), fons carbó `#231F20`, sense panell flotant ni elements extra.

- **Esquerra (50 %)**: una sola foto a sang (`slide-operari-*`, l'operari amb l'uniforme),
  de dalt a baix i fins a les vores, sense cantonades ni textos a sobre.
- **Dreta (50 %)**: Serveis, Què gestionem, Llicències, Ubicació i Contacte en tipografia molt
  gran (fins a 104 px), pes 300, alineats a l'esquerra i repartits en vertical; a baix a la dreta,
  només el telèfon 93 873 02 37 i el botó vermell «Pressupost».
- **Hover**: l'enllaç apuntat es manté i la resta baixa al 50 % d'opacitat (≈5:1 sobre el carbó, AA).
- **Barra**: es manté a sobre del menú (logotip centrat i la X a l'esquerra); l'enllaç «Pressupost»
  de la barra s'amaga mentre el menú és obert, i l'avís de cookies també.
- **Mòbil**: una sola columna, sense foto; enllaços grans a dalt i telèfon + botó a baix.
- **Teclat**: `aria-expanded` al botó, `aria-modal` al diàleg, `inert` quan és tancat, focus atrapat
  entre la barra i el menú, `Esc` per tancar i retorn del focus a l'hamburguesa.
- **Moviment**: fosa general i entrada escalonada dels enllaços (60–340 ms) i del peu; amb
  `prefers-reduced-motion` s'anul·len els retards i les transicions.

El menú es tanca amb la X i amb `Esc` (no amb clic fora). Les pàgines de servei viuen a
`serveis/` (`gestio-de-residus.html` —enllaçada avui com a «Reciclatge»—, `transport-de-residus.html`
i `assessoria-tecnica.html`).

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

### Carrusel de 3 imatges

El hero gira entre **tres imatges** amb un **fosa encreuada** (crossfade) de 1,2 s, una cada 3,25 s.
Cada diapositiva porta el seu **títol i subtítol**, que canvien amb la imatge (el text s'esvaeix,
es canvia i torna a aparèixer):

| # | Imatge | Títol | Subtítol |
|---|---|---|---|
| 1 | `mainimage.jpeg` — nau de tractament i tria | Gestió de residus a Manresa | Ens encarreguem de la classificació, el tractament i la destinació final de cada residu |
| 2 | `Look_Tort19` — operari a les instal·lacions | Transport i processament de residus | Recollim al teu centre de treball i ho portem al gestor autoritzat, amb mitjans propis |
| 3 | `Look_Tort5` — jaqueta de treball | Destrucció de documents importants | Recollida i destrucció confidencial de documentació, amb el certificat corresponent |

Els textos viuen a `data-title` i `data-sub` de cada `figure.hero__slide`; el títol i el subtítol
del HTML corresponen a la primera diapositiva (per a SEO i per si falla el JavaScript).

Controls: tres punts (canvi manual) i un botó de **pausa/represa** a baix a la dreta. La rotació
s'atura quan el punter o el focus són damunt dels controls, quan la pestanya no és visible i quan
el hero surt de pantalla (`IntersectionObserver`). Amb `prefers-reduced-motion` no hi ha rotació
automàtica i el botó de pausa s'amaga; els punts continuen funcionant.

> El botó de pausa no és decoratiu: la norma **WCAG 2.2.2** exigeix un mecanisme per aturar el
> contingut que es mou sol durant més de 5 segons.

### Animació lligada al scroll

**Estat inicial (scroll = 0):** foto a sang, sense radis i sense franja de color. Ocupa tota
la pantalla (`100svh`) i les cantonades són rectes.

**Amb scroll:** el contenidor és `sticky` i la foto es transforma de manera progressiva:

- `border-radius` de 0 fins a 84 px (40 px en mòbil)
- `scale` de 1 fins a 0,93 i un lleuger desplaçament cap amunt, de manera que queden buits als
  costats i, sobretot, a baix
- per darrere hi ha una capa de **color sòlid de marca** (`--hero-layer`) que apareix pels buits

És **reversible** (en pujar, la foto torna a ocupar tota la pantalla) i va lligat a la posició del
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
| Hero · 1 | `mainimage.jpeg` (nau de tractament i tria) | `slide-interior-1600` / `1000` |
| Hero · 2 | `imagenestort/Look_Tort19` (operari) | `slide-operari-1600` / `1000` |
| Hero · 3 | `imagenestort/Look_Tort5` (jaqueta) | `slide-jaqueta-1600` / `1000` |
| Secció «L'equip» | `imagenestort/Look_Tort5` | `taller-tort-1600` / `1000` |
| Ubicació | `imagenestort/Look_Tort3` (cartell d'entrada) | `entrada-tort-1600` / `1000` |

Cada imatge surt en **WebP** i **JPEG**; la primera diapositiva del hero va amb `fetchpriority="high"`
i la resta amb `loading="lazy"`.

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

## Pendent

- [ ] **Pàgines de servei**: fetes `serveis/gestio-de-residus.html`,
      `serveis/transport-de-residus.html` i `serveis/assessoria-tecnica.html`. Falta decidir el nom
      final de la primera (la portada l'enllaça com a «Reciclatge»).
- [ ] Fotografia i vídeo definitius de les noves instal·lacions.
- [ ] Adreça postal concreta (ara només coordenades) i correu definitiu.
- [ ] **Logos oficials en qualitat**: els actuals s'han recuperat de la web antiga i són de baixa
      resolució. Cal demanar els originals a l'Agència de Residus i a la Generalitat.
- [ ] `og:image` real (1200×630).
- [ ] Revisió legal dels tres textos.
- [ ] Decidir l'idioma (ara tot en català).
- [ ] Connectar el formulari a un backend o servei d'enviament.
