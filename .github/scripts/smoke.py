#!/usr/bin/env python3
"""
Kiespret smoke-test — vangt de soort regressies die Tessa anders pas op
productie ontdekt:

1. Relatieve script/link-paden (breken onder Vercel trailingSlash=true)
2. app.html laad-volgorde: analytics.js moet vóór het main script
3. Share-URLs moeten /app/?...  genereren, niet /app.html?...
4. vercel.json is geldig JSON
5. robots.txt disallow-regels voor persoonlijke URLs aanwezig
6. CSP-header verwijst niet naar ontbrekende hosts

Exit code != 0 stopt de GitHub Action en daarmee de merge.
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
errors = []


def err(msg):
    errors.append(msg)


HTML_PAGES = ["index.html", "app.html", "over.html", "privacybeleid.html", "voorwaarden.html", "404.html"]


# ── CHECK 1: relatieve <script src="..."> en <a href="...html"> ────────────
REL_SCRIPT_RE = re.compile(r'<script\s+src="(?!https?://|/)([^"]+)"')
REL_HTML_LINK_RE = re.compile(r'<a\s[^>]*href="(?!https?://|/|mailto:|tel:|#|javascript:)([a-z][a-z0-9_/-]*\.html[^"]*)"', re.IGNORECASE)

for name in HTML_PAGES:
    path = ROOT / name
    if not path.exists():
        continue
    text = path.read_text()
    for m in REL_SCRIPT_RE.finditer(text):
        line = text[: m.start()].count("\n") + 1
        err(f"{name}:{line}: relatieve <script src=\"{m.group(1)}\"> — breekt onder Vercel trailingSlash")
    for m in REL_HTML_LINK_RE.finditer(text):
        line = text[: m.start()].count("\n") + 1
        err(f"{name}:{line}: relatieve href=\"{m.group(1)}\" — gebruik absolute cleanURL (/over, /app, etc.)")


# ── CHECK 2: app.html laad-volgorde ────────────────────────────────────────
app_html = (ROOT / "app.html").read_text()
scripts_in_order = re.findall(r'<script(?:\s+src="([^"]+)")?', app_html)
# Vind index van analytics.js en de eerste inline script
analytics_idx = next((i for i, s in enumerate(scripts_in_order) if s and "analytics.js" in s), -1)
inline_idx = next((i for i, s in enumerate(scripts_in_order) if not s), -1)
if analytics_idx == -1:
    err("app.html: <script src=\"/analytics.js\"> ontbreekt")
elif inline_idx != -1 and analytics_idx > inline_idx:
    err(
        "app.html: /analytics.js laadt na inline script — "
        "init() roept kiespretTrack aan die dan nog niet bestaat"
    )


# ── CHECK 3: share-URL's gebruiken /app/?... niet /app.html?... ────────────
for bad in re.finditer(r"/app\.html\?(?:shortlist|duo)=", app_html):
    line = app_html[: bad.start()].count("\n") + 1
    err(f"app.html:{line}: share-URL gebruikt /app.html — redirect naar /app/ kan query kwijt maken")


# ── CHECK 4: vercel.json is geldig JSON ────────────────────────────────────
try:
    vercel_cfg = json.loads((ROOT / "vercel.json").read_text())
except json.JSONDecodeError as e:
    err(f"vercel.json: ongeldige JSON — {e}")
    vercel_cfg = {}


# ── CHECK 5: robots.txt blokkeert persoonlijke URLs ────────────────────────
robots = (ROOT / "robots.txt").read_text()
for needle in ["/app/?shortlist=", "/app/?duo="]:
    if needle not in robots:
        err(f"robots.txt: mist 'Disallow: {needle}' — gedeelde URLs kunnen in Google komen")


# ── CHECK 6: CSP-header host-consistency ───────────────────────────────────
csp_header = None
for block in vercel_cfg.get("headers", []):
    for h in block.get("headers", []):
        if h.get("key") == "Content-Security-Policy":
            csp_header = h.get("value", "")
if csp_header:
    # Elke host die in HTML/JS wordt gebruikt MOET in CSP staan
    used_hosts = set()
    for name in HTML_PAGES + ["analytics.js", "affiliate.js", "cookie-consent.js"]:
        p = ROOT / name
        if not p.exists():
            continue
        for m in re.finditer(r"https?://([a-zA-Z0-9.-]+)", p.read_text()):
            host = m.group(1)
            # Skip outbound-only hosts (gebruikt in window.open / JSON-LD @context)
            if host in {"schema.org", "wa.me", "www.tui.nl", "www.sunweb.nl",
                        "www.corendon.nl", "www.d-reizen.nl", "www.kiespret.nl"}:
                continue
            used_hosts.add(host)
    for host in used_hosts:
        if host not in csp_header:
            err(f"vercel.json CSP: host '{host}' wordt gebruikt maar ontbreekt in Content-Security-Policy")
else:
    err("vercel.json: Content-Security-Policy header ontbreekt")


# ── Rapporteer ──────────────────────────────────────────────────────────────
if errors:
    print("SMOKE-TEST GEFAALD:")
    for e in errors:
        print(f"  ✗ {e}")
    sys.exit(1)
else:
    print("SMOKE-TEST OK — alle checks geslaagd")
    sys.exit(0)
