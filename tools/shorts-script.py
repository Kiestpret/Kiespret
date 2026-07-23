#!/usr/bin/env python3
"""
Shorts-scriptgenerator voor Kiespret.

Zet een vergelijkingspagina om in een kant-en-klaar script voor een korte video
(TikTok / Reels / YouTube Shorts) van circa 30 seconden.

Uitgangspunt: ALLES komt letterlijk uit de pagina zelf. Er wordt niets bedacht,
niets geschat en niets aangevuld. Wat niet op de pagina staat, staat niet in het
script. Zo kan een script nooit een feit bevatten dat de site niet onderbouwt.

Gebruik:
    python3 tools/shorts-script.py gids/turkije/turkse-riviera
    python3 tools/shorts-script.py --alle
    python3 tools/shorts-script.py --alle --uit scripts/
"""

import re
import sys
import html
import glob
import os
import argparse

SITE = "https://www.kiespret.nl"


# ---------- extractie ----------

def _tekst(s: str) -> str:
    """Strip tags, unescape entities, normaliseer witruimte."""
    s = re.sub(r"<[^>]+>", "", s)
    return re.sub(r"\s+", " ", html.unescape(s)).strip()


def lees_pagina(pad: str) -> dict:
    with open(pad, encoding="utf-8") as f:
        ruw = f.read()

    # scripts/styles weg zodat JSON-LD niet meegeparsed wordt
    body = re.sub(r"(?s)<script.*?</script>|<style.*?</style>", "", ruw)

    d = {"pad": pad, "url": SITE + "/" + pad.replace("index.html", "")}

    m = re.search(r"<h1[^>]*>(.*?)</h1>", body, re.S)
    d["titel"] = _tekst(m.group(1)) if m else ""

    m = re.search(r'<p class="subtitle">(.*?)</p>', body, re.S)
    d["subtitel"] = _tekst(m.group(1)) if m else ""

    m = re.search(r'<div class="tldr">(.*?)</div>', body, re.S)
    tldr = _tekst(m.group(1)) if m else ""
    d["tldr"] = re.sub(r"^Kort antwoord:\s*", "", tldr)

    # quick-picks: <div class="quick-pick-item pick-x"><strong>Label</strong> rest</div>
    d["picks"] = []
    for blok in re.findall(r'<div class="quick-pick-item[^"]*">(.*?)</div>', body, re.S):
        m = re.match(r"\s*<strong>(.*?)</strong>(.*)", blok, re.S)
        if m:
            d["picks"].append((_tekst(m.group(1)), _tekst(m.group(2))))

    # eerste compare-table
    d["kolommen"], d["rijen"] = [], []
    t = re.search(r"<table class=\"compare-table\">(.*?)</table>", body, re.S)
    if t:
        tab = t.group(1)
        koppen = re.findall(r"<th>(.*?)</th>", tab, re.S)
        d["kolommen"] = [_tekst(k) for k in koppen]
        for rij in re.findall(r"<tr>(?!\s*<th)(.*?)</tr>", tab, re.S):
            cellen = [_tekst(c) for c in re.findall(r"<td[^>]*>(.*?)</td>", rij, re.S)]
            if cellen:
                d["rijen"].append(cellen)
    return d


# ---------- opbouw ----------

def maak_hook(d: dict) -> str:
    """Hook uit de titel. Vergelijkingstitels zijn al vragend."""
    t = d["titel"]
    kop = re.split(r":", t)[0].strip()
    if "?" in t:
        vraag = t.split("?")[0].strip() + "?"
        return vraag if len(vraag) <= 70 else kop + "?"
    return kop + "?"


def schoon_label(label: str) -> str:
    """'Kies Albanië als...' -> 'Albanië'. Maakt labels bruikbaar als beat-titel én als matchsleutel."""
    L = label.strip()
    L = re.sub(r"^(kies|ga naar|neem)\s+", "", L, flags=re.I)
    L = re.sub(r"\s*(als|voor|wanneer)\b.*$", "", L, flags=re.I)
    L = L.strip(" .…:-")
    return L or label.strip()


def _kolom_index(label: str, d: dict):
    naam = schoon_label(label).lower()
    for i, kop in enumerate(d["kolommen"]):
        k = kop.lower().strip()
        if k and (k in naam or naam in k):
            return i
    return None


def _rij_voor(label: str, d: dict):
    naam = schoon_label(label).lower()
    for rij in d["rijen"]:
        eerste = rij[0].lower().strip() if rij else ""
        if eerste and (eerste in naam or naam in eerste):
            return rij
    return None


NUTTIG = ["prijs", "kosten", "budget", "drukte", "vliegduur", "vlieg", "transfer",
          "nachtleven", "strand", "ligbed", "sfeer", "reistijd", "seizoen"]
TRIVIA = ["grootte", "oppervlak", "inwoners", "km²", "km2", "aantal"]

def _nut(criterium: str) -> int:
    c = criterium.lower()
    if any(t in c for t in TRIVIA):  return 2   # slechtste
    if any(n in c for n in NUTTIG):  return 0   # beste
    return 1

def gedeeld_feit(labels: list, d: dict) -> dict:
    """
    Kies één criterium dat voor ALLE onderwerpen een waarde heeft, zodat de
    overlays onderling vergelijkbaar zijn. Voorkeur voor een rij/kolom met cijfers.
    Geeft {label: (criterium, waarde)}.
    """
    if not d["rijen"]:
        return {}

    # vorm B: onderwerpen staan in de kolomkoppen
    idx = {l: _kolom_index(l, d) for l in labels}
    if all(v is not None for v in idx.values()) and idx:
        kandidaten = []
        for rij in d["rijen"]:
            waarden = {l: (rij[i] if i < len(rij) else "") for l, i in idx.items()}
            if not all(w and w != "—" for w in waarden.values()):
                continue
            cijfers = sum(1 for w in waarden.values() if re.search(r"\d", w))
            lengte = max(len(w) for w in waarden.values())
            uniek = len(set(w.strip().lower() for w in waarden.values()))
            kandidaten.append((_nut(rij[0]), -uniek, -cijfers, lengte, rij[0], waarden))
        if kandidaten:
            kandidaten.sort(key=lambda x: (x[0], x[1], x[2], x[3]))
            _, _, _, _, crit, waarden = kandidaten[0]
            return {l: (crit, w) for l, w in waarden.items()}
        return {}

    # vorm A: onderwerpen staan in de eerste kolom
    rijen = {l: _rij_voor(l, d) for l in labels}
    if all(r is not None for r in rijen.values()) and rijen:
        kandidaten = []
        for j in range(1, len(d["kolommen"])):
            waarden = {l: (r[j] if j < len(r) else "") for l, r in rijen.items()}
            if not all(w and w != "—" for w in waarden.values()):
                continue
            cijfers = sum(1 for w in waarden.values() if re.search(r"\d", w))
            lengte = max(len(w) for w in waarden.values())
            uniek = len(set(w.strip().lower() for w in waarden.values()))
            crit = d["kolommen"][j]
            kandidaten.append((_nut(crit), -uniek, -cijfers, lengte, crit, waarden))
        if kandidaten:
            kandidaten.sort(key=lambda x: (x[0], x[1], x[2], x[3]))
            _, _, _, _, crit, waarden = kandidaten[0]
            return {l: (crit, w) for l, w in waarden.items()}
    return {}


def maak_beats(d: dict, maxbeats: int = 4) -> list:
    """Eén beat per onderwerp, met voor alle onderwerpen hetzelfde vergelijkingscriterium."""
    samen, volgorde = {}, []
    for label, reden in d["picks"]:
        if label not in samen:
            samen[label] = []
            volgorde.append(label)
        samen[label].append(reden)

    labels = volgorde[:maxbeats]
    kan_samen = all(
        len(samen[l]) > 1 and len(" — ".join(samen[l][:2])) <= 80 for l in labels
    )
    feiten = gedeeld_feit(labels, d)

    beats = []
    for label in labels:
        redenen = samen[label]
        reden = " — ".join(redenen[:2]) if kan_samen else redenen[0]
        reden = reden.rstrip(" .")
        crit, waarde = feiten.get(label, ("", ""))
        beats.append({"label": schoon_label(label), "reden": reden,
                      "criterium": crit, "waarde": waarde.rstrip(" .")})
    return beats


def maak_payoff(d: dict) -> str:
    """Eerste zin van de tldr; dat is doorgaans het oordeel."""
    if not d["tldr"]:
        return ""
    zin = re.split(r"(?<=[.!?])\s+", d["tldr"])[0]
    return zin.strip()


def shotlist(d: dict, beats: list) -> list:
    shots = [f"Hook — sfeerbeeld van {d['titel'].split(':')[0].strip()}"]
    for b in beats:
        shots.append(f"{b['label']} — echte beelden van {b['label']} (géén AI-gegenereerde plaats)")
    shots.append("Payoff — koppel dat samen kiest / schermopname van de keuzehulp")
    return shots


# ---------- rendering ----------

WPS = 2.6  # woorden per seconde bij rustig Nederlands inspreken


def _duur(tekst: str, minimum: float = 2.5) -> float:
    return max(minimum, round(len(tekst.split()) / WPS, 1))


def render(d: dict) -> str:
    beats = maak_beats(d)
    hook = maak_hook(d)
    payoff = maak_payoff(d)
    cta = "Wij hebben ze eerlijk naast elkaar gezet. Link in bio."

    regels = []
    for b in beats:
        r = f"{b['label']}: {b['reden']}"
        if b["waarde"]:
            r += f". {b['criterium']}: {b['waarde']}." if b["criterium"] else f". {b['waarde']}."
        regels.append(r)

    blokken = [("Hook", hook)] + [(b["label"], r) for b, r in zip(beats, regels)]
    if payoff:
        blokken.append(("Payoff", payoff))
    blokken.append(("CTA", cta))

    r = []
    r.append(f"# Shorts-script — {d['titel']}")
    r.append(f"\nBron: {d['url']}")

    t, tijden = 0.0, []
    for naam, tekst in blokken:
        dur = _duur(tekst)
        tijden.append((naam, tekst, t, t + dur))
        t += dur
    r.append(f"Geschatte lengte: {t:.0f} seconden ({WPS} woorden/sec)")
    if t > 45:
        r.append(f"\n> **Let op:** dit script is met {t:.0f} seconden aan de lange kant voor Shorts. "
                 f"Schrap een beat of kort de payoff in.")
    r.append("")

    r.append("## Voice-over\n")
    for naam, tekst, a, b in tijden:
        r.append(f"**[{a:.0f}-{b:.0f}s] {naam}**\n> {tekst}\n")

    r.append("## Tekst in beeld\n")
    r.append(f"- Opening: **{hook}**")
    for b in beats:
        if b["waarde"]:
            kort = f"{b['criterium']}: {b['waarde']}" if b["criterium"] else b["waarde"]
        else:
            kort = b["reden"]
        r.append(f"- {b['label']} — {kort}")
    r.append("- Slot: kiespret.nl\n")

    r.append("## Shotlist\n")
    for sh in shotlist(d, beats):
        r.append(f"- {sh}")
    r.append("")

    if d["kolommen"] and d["rijen"]:
        r.append("## Alle cijfers van deze pagina (voor extra overlays)\n")
        r.append("| " + " | ".join(d["kolommen"]) + " |")
        r.append("|" + "---|" * len(d["kolommen"]))
        for rij in d["rijen"][:8]:
            r.append("| " + " | ".join(rij) + " |")
        r.append("")

    r.append("## Caption\n")
    r.append(f"{hook} {payoff}\n")
    r.append(f"Volledige vergelijking: {d['url']}\n")

    r.append("---")
    r.append("_Alles hierboven komt letterlijk van de bronpagina; er is niets bijbedacht. "
             "Controleer cijfers tegen FEITENTABEL.md voor je publiceert, en gebruik echte "
             "beelden van de plaats — geen AI-gegenereerde landschappen._")
    return "\n".join(r)


# ---------- cli ----------

def main():
    p = argparse.ArgumentParser(description="Shorts-scripts uit Kiespret-vergelijkingspagina's")
    p.add_argument("pagina", nargs="?", help="pad naar pagina, bijv. gids/turkije/turkse-riviera")
    p.add_argument("--alle", action="store_true", help="alle geschikte pagina's")
    p.add_argument("--uit", help="schrijf naar deze map in plaats van stdout")
    a = p.parse_args()

    if a.alle:
        paden = [f for f in glob.glob("gids/**/index.html", recursive=True)
                 if "quick-pick-item" in open(f, encoding="utf-8").read()]
    elif a.pagina:
        pad = a.pagina.rstrip("/")
        paden = [pad if pad.endswith(".html") else pad + "/index.html"]
    else:
        p.print_help()
        return

    for pad in sorted(paden):
        if not os.path.exists(pad):
            print(f"niet gevonden: {pad}", file=sys.stderr)
            continue
        d = lees_pagina(pad)
        if not d["picks"]:
            print(f"overgeslagen (geen quick-picks): {pad}", file=sys.stderr)
            continue
        tekst = render(d)
        if a.uit:
            os.makedirs(a.uit, exist_ok=True)
            naam = pad.replace("gids/", "").replace("/index.html", "").replace("/", "-") + ".md"
            with open(os.path.join(a.uit, naam), "w", encoding="utf-8") as f:
                f.write(tekst)
            print(f"geschreven: {os.path.join(a.uit, naam)}")
        else:
            print(tekst)


if __name__ == "__main__":
    main()
