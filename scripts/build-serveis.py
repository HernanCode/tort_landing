#!/usr/bin/env python3
"""
Genera les pàgines de servei a partir de serveis/data/serveis.json i
serveis/_template.html, i actualitza la graella de serveis de la portada.

Ús:  python3 scripts/build-serveis.py
"""
import html
import json
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SERVEIS = ROOT / "serveis"
DATA = SERVEIS / "data" / "serveis.json"
TEMPLATE = SERVEIS / "_template.html"
INDEX = ROOT / "index.html"

# Domini provisional de la beta. Canviar quan el lloc passi al domini definitiu.
BASE_URL = "https://hernancode.github.io/tort_landing"

GROUPS = [
    ("contenidors", "Contenidors"),
    ("recollida-gestio", "Recollida i gestió"),
    ("serveis-especials", "Serveis especials"),
]

# Nous blocs de la home: 3 destacats + 15 compactes agrupats per necessitat
FEATURED = [
    ("lloguer-de-contenidors", "assets/img/hero-1-poster.webp",
     "Vista aèria de la planta i els contenidors de Tort", "Contenidors"),
    ("transport-de-residus", "assets/img/slide-operari-1600.webp",
     "Operari de Tort amb camió i contenidors", "Recollida"),
    ("gestio-de-residus", "assets/img/slide-interior-1600.webp",
     "Nau de classificació i tractament de residus de Tort", "Planta"),
]

COMPACT = [
    ("Reciclatge i recuperació", [
        "paper-i-carto", "ferralla-i-metalls", "cable-de-coure",
        "raee-i-electronica", "vehicles-fora-d-us",
    ]),
    ("Obra, buidatges i destrucció", [
        "runes-i-obra", "buidatge-de-naus", "destruccio-de-documents",
        "destruccio-d-estocs", "residus-perillosos",
    ]),
    ("Serveis especials", [
        "fosses-septiques", "desembussaments", "neteges-industrials",
        "reciclatge-d-extintors", "assessoria-tecnica",
    ]),
]

ARROW = ('<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.2 5.2a1 1 0 0 1 1.4 0l5.6 5.6a1.7 1.7 0 0 1 0 2.4'
         'l-5.6 5.6a1 1 0 0 1-1.4-1.4l3.9-3.9H4.6a1 1 0 0 1 0-2h12.5l-3.9-3.9a1 1 0 0 1 0-1.4Z"/></svg>')

ICONS = {
    "container": '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="18" height="12" rx="1.2"/><path d="M3 11h18M7 7v12M17 7v12"/></svg>',
    "truck": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/></svg>',
    "recycle": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v4h-4"/></svg>',
    "document": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M9 12h6M9 16h6"/></svg>',
    "hazard": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l9 16H3z"/><path d="M12 9v4"/><circle cx="12" cy="16" r=".8" fill="currentColor" stroke="none"/></svg>',
    "construction": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h16"/><path d="M7 20V9l5-4 5 4v11"/><path d="M9 20v-5h6v5"/></svg>',
    "electronics": '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="4" width="12" height="9" rx="1"/><path d="M9 20h6M12 13v7"/></svg>',
    "special": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z"/><path d="M18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15Z"/></svg>',
}


def esc(value):
    return html.escape(str(value), quote=False)


def icon(name):
    return ICONS.get(name, ICONS["special"])


def sizes_section(service):
    sizes = service.get("sizes", [])
    if not sizes:
        return ""
    cards = []
    for size in sizes:
        cards.append(
            f'        <article class="container-card">\n'
            f'          <h3 class="container-card__size">{esc(size["capacity"])}</h3>\n'
            f'          <p class="container-card__system">{esc(size["system"])}</p>\n'
            f'          <p class="container-card__ideal">{esc(size["ideal"])}</p>\n'
            f'          <p class="container-card__not"><strong>No hi pot anar:</strong> {esc(size["not"])}</p>\n'
            f'          <a class="container-card__cta" href="../../index.html#contacte">Demana pressupost →</a>\n'
            f'        </article>'
        )
    return (
        '\n  <!-- ============ MIDES ============ -->\n'
        '  <section class="section section--tight" id="mides">\n'
        '    <div class="wrap">\n'
        '      <p class="kicker" style="color:var(--brand-red-ink)">Mides</p>\n'
        '      <h2 class="display h-section" style="margin:24px 0 40px; max-width:22ch">Quin contenidor necessites?</h2>\n'
        '      <div class="container-cards">\n'
        + "\n".join(cards) + "\n"
        '      </div>\n'
        '    </div>\n'
        '  </section>\n'
    )


def render(service, by_slug):
    paragraphs = service.get("intro", [])
    intro = ""
    if paragraphs:
        intro = f'        <p class="lead">{esc(paragraphs[0])}</p>'
        for p in paragraphs[1:]:
            intro += f'\n        <p class="body">{esc(p)}</p>'

    audience = "\n".join(f'          <li>{esc(x)}</li>' for x in service.get("audience", []))

    steps = []
    for i, step in enumerate(service.get("steps", []), 1):
        steps.append(
            f'        <li class="step">\n'
            f'          <p class="service__num">{i:02d}</p>\n'
            f'          <h3>{esc(step["title"])}</h3>\n'
            f'          <p>{esc(step["text"])}</p>\n'
            f'        </li>'
        )

    waste = "\n".join(f'        <li>{esc(x)}</li>' for x in service.get("waste", []))

    faq = []
    for item in service.get("faq", []):
        faq.append(
            f'        <details>\n'
            f'          <summary>{esc(item["q"])}<svg class="faq-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="11" y="5" width="2" height="14" rx="1"/><rect x="5" y="11" width="14" height="2" rx="1"/></svg></summary>\n'
            f'          <p>{esc(item["a"])}</p>\n'
            f'        </details>'
        )

    related = []
    for slug in service.get("related", []):
        rel = by_slug.get(slug)
        if rel:
            related.append(f'        <li><a href="../{slug}/">{esc(rel["name"])} {ARROW}</a></li>')

    if service.get("heroImage"):
        hero_class = ""
        hero_media = (f'    <div class="page-hero__media" aria-hidden="true">'
                      f'<img src="../../{service["heroImage"]}" alt="" fetchpriority="high"></div>')
        preload = (f'<link rel="preload" as="image" href="../../{service["heroImage"]}" '
                   f'type="image/webp">')
    else:
        hero_class = " page-hero--plain"
        hero_media = ""
        preload = ""

    canonical = f"{BASE_URL}/serveis/{service['slug']}/"
    faq_items = [
        {
            "@type": "Question",
            "name": item["q"],
            "acceptedAnswer": {"@type": "Answer", "text": item["a"]},
        }
        for item in service.get("faq", [])
    ]
    jsonld = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Service",
                "name": service["h1"],
                "description": service["metaDescription"],
                "serviceType": service["name"],
                "url": canonical,
                "provider": {
                    "@type": "LocalBusiness",
                    "name": "Contenidors i Gestió de Residus Tort",
                    "telephone": "+34938730237",
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Manresa",
                        "addressRegion": "Barcelona",
                        "addressCountry": "ES",
                    },
                },
                "areaServed": ["Manresa", "Bages"],
            }
        ],
    }
    if faq_items:
        jsonld["@graph"].append({"@type": "FAQPage", "mainEntity": faq_items})
    jsonld_html = (
        '<script type="application/ld+json">\n'
        + json.dumps(jsonld, ensure_ascii=False, indent=2)
        + "\n</script>"
    )

    template = TEMPLATE.read_text(encoding="utf-8")
    values = {
        "TITLE": service["metaTitle"],
        "DESC": service["metaDescription"],
        "H1": service["h1"],
        "LEAD": service["lead"],
        "NAME": service["name"],
        "INTRO_HEADING": service["introHeading"],
        "INTRO": intro,
        "AUDIENCE": audience,
        "STEPS": "\n".join(steps),
        "WASTE": waste,
        "FAQ": "\n".join(faq),
        "RELATED": "\n".join(related),
        "CTA": service["cta"],
        "HERO_CLASS": hero_class,
        "HERO_MEDIA": hero_media,
        "PRELOAD": preload,
        "SIZES_SECTION": sizes_section(service),
        "CANONICAL": canonical,
        "OG_IMAGE": f"{BASE_URL}/assets/img/og-tort.jpg",
        "JSONLD": jsonld_html,
    }
    out = template
    for key, value in values.items():
        out = out.replace("{{" + key + "}}", value)

    leftover = [line for line in out.splitlines() if "{{" in line or "}}" in line]
    if leftover:
        raise SystemExit(f"Placeholders sense substituir a {service['slug']}: {leftover}")

    target = SERVEIS / service["slug"] / "index.html"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(out, encoding="utf-8")
    return target


def build_services(data):
    by_slug = {s["slug"]: s for s in data}

    featured = []
    for slug, image, alt, tag in FEATURED:
        service = by_slug[slug]
        featured.append(
            f'        <a class="featured-service" href="serveis/{slug}/">\n'
            f'          <figure class="featured-service__media"><img src="{image}" alt="{esc(alt)}" loading="lazy"></figure>\n'
            f'          <div class="featured-service__body">\n'
            f'            <p class="featured-service__tag">{esc(tag)}</p>\n'
            f'            <h3 class="featured-service__title">{esc(service["name"])}</h3>\n'
            f'            <p class="featured-service__text">{esc(service["summary"])}</p>\n'
            f'            <span class="featured-service__more">Veure servei {ARROW}</span>\n'
            f'          </div>\n'
            f'        </a>'
        )

    groups = []
    for title, slugs in COMPACT:
        items = []
        for slug in slugs:
            service = by_slug[slug]
            items.append(
                f'            <li class="compact-item"><a href="serveis/{slug}/">'
                f'{esc(service["name"])} <span class="compact-item__arrow" aria-hidden="true">→</span></a></li>'
            )
        groups.append(
            f'      <section class="compact-group">\n'
            f'        <h3 class="compact-group__title">{esc(title)}</h3>\n'
            f'        <ul class="compact-grid">\n'
            + "\n".join(items) + "\n"
            f'        </ul>\n'
            f'      </section>'
        )

    return (
        '<div class="featured-services">\n' + "\n".join(featured) + '\n      </div>\n\n'
        '      <div class="compact-services">\n' + "\n".join(groups) + '\n      </div>'
    )


def update_index(data):
    html_text = INDEX.read_text(encoding="utf-8")
    start_marker = "<!-- SERVEIS:START -->"
    end_marker = "<!-- SERVEIS:END -->"
    start = html_text.index(start_marker) + len(start_marker)
    end = html_text.index(end_marker)
    grid = build_services(data)
    html_text = html_text[:start] + "\n" + grid + "\n      " + html_text[end:]
    INDEX.write_text(html_text, encoding="utf-8")


def build_seo_files(data):
    today = date.today().isoformat()
    urls = [f"{BASE_URL}/", f"{BASE_URL}/empresa/"]
    urls += [f"{BASE_URL}/serveis/{s['slug']}/" for s in data]
    urls += [
        f"{BASE_URL}/{name}"
        for name in ("avis-legal.html", "politica-de-cookies.html", "politica-de-privacitat.html")
    ]
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for url in urls:
        lines.append(f"  <url><loc>{url}</loc><lastmod>{today}</lastmod></url>")
    lines.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(lines) + "\n", encoding="utf-8")
    (ROOT / "robots.txt").write_text(
        "User-agent: *\nAllow: /\n\nSitemap: " + BASE_URL + "/sitemap.xml\n",
        encoding="utf-8",
    )
    print("  ✓ sitemap.xml i robots.txt")


def main():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    by_slug = {s["slug"]: s for s in data}

    if len(data) != len(by_slug):
        raise SystemExit("Hi ha slugs duplicats al JSON")

    for service in data:
        if service["group"] not in dict(GROUPS):
            raise SystemExit(f"Grup desconegut: {service['group']} ({service['slug']})")
        for slug in service.get("related", []):
            if slug not in by_slug:
                raise SystemExit(f"Relacionat inexistent: {slug} ({service['slug']})")

    used = [slug for slug, _, _, _ in FEATURED] + [slug for _, slugs in COMPACT for slug in slugs]
    if len(used) != len(set(used)) or set(used) != set(by_slug):
        raise SystemExit("Els serveis destacats i compactes no cobreixen exactament les 18 fitxes")

    for service in data:
        target = render(service, by_slug)
        print(f"  ✓ {target.relative_to(ROOT)}")

    update_index(data)
    print("  ✓ index.html (secció de serveis)")

    build_seo_files(data)

    for old in ("gestio-de-residus.html", "transport-de-residus.html", "assessoria-tecnica.html"):
        path = SERVEIS / old
        if path.exists():
            path.unlink()
            print(f"  − {path.relative_to(ROOT)} (antic)")

    print(f"\nFet: {len(data)} pàgines de servei generades.")


if __name__ == "__main__":
    main()
