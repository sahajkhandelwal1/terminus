Product Requirements Document: Terminus
Version: 1.0
Author: Sahaj
Status: Draft — Stardance build

1. Overview
Terminus is a browser-based, real-time customizable map poster generator. A user types any city or address, gets a live-rendered street-map artwork they can fully customize (colors, layers, typography, layout), downloads for free at high resolution, and optionally orders as a physical print via a print-on-demand fulfillment partner.
One-line pitch: Type a place. Watch a poster of it build itself, live, in your browser — customize every layer, download free, print if you want it on your wall.

2. Problem
Existing custom map poster tools (Mapiful, OwnHomeMap, Positive Prints) share the same weaknesses:

Closed, server-side rendering — users see static previews, not live edits
Limited style presets with no deep layer control
No free tier; digital downloads are paywalled ($29+) even though the marginal cost is near zero
Editors feel dated and slow

There's no tool that lets someone play with a map of their city in real time, in the browser, for free, and only pay when they want a physical object.

3. Goals
Primary goals

Ship a working, demoable product for Stardance within 4 weeks
Real-time, browser-rendered map customization — the core technical and experiential differentiator
A completely free path to a high-res download (no account, no paywall)
An optional, low-friction path to a paid physical print

Non-goals (v1)

Mobile-native app (responsive web only)
User accounts / saved projects (may come post-Stardance)
Multi-language localization
Non-map product types (star maps, topographic-only maps) — explicitly deferred to post-ship phase


4. Target users

Primary (Stardance judges/demo audience): technically literate reviewers who will type their own city and expect an immediate, impressive, bug-free result within seconds
Secondary (real-world users post-ship): people looking for a personalized gift or home-decor item tied to a meaningful place (hometown, alma mater, engagement location, etc.)


5. Core user flow

Landing page — search box, prompt: "Type any city or address"
User searches → map renders live, centered on the result, default style preset applied
User customizes via a side panel: layers, colors, typography, paper size/orientation, shape mask
User can reposition/zoom the map by dragging/scrolling
User clicks Download → free high-res PNG generated and downloaded, no login required
User optionally clicks Order Print → selects size/paper/framing → Stripe checkout → order sent to print fulfillment API → confirmation screen with tracking info


6. Feature requirements
6.1 Map rendering engine

Real-time WebGL rendering via MapLibre GL JS
Vector tile data sourced from OpenStreetMap via a free/low-cost vector tile provider (e.g. Protomaps or MapTiler free tier)
Search-to-location via a geocoding API (city, address, or landmark name → lat/lng + bounding box)
Smooth pan/zoom directly on the canvas, synced to the export frame

6.2 Customization panel
CategoryControlsLayersIndependent toggle + color picker for: roads, highways, water, parks/green space, buildings, railways, labelsStyle presets8 curated presets (Minimal, Noir, Blueprint, Terrain, Neon, Vintage, Monochrome, Custom/blank) — one-click apply, fully editable afterTypographyHeadline (place name), subheadline (coordinates or custom text), font (6 Google Fonts options), size, weight, letter-spacing, color, position (top/bottom/overlay)Paper/formatA3, A2, A1, 18×24", 24×36", square; portrait/landscape toggle; border style (borderless, thin rule, thick frame)Shape maskRectangle, circle, hexagonPositionDrag-to-pan, scroll/pinch-to-zoom
6.3 Export

Free tier: high-resolution PNG export (min. 300 DPI equivalent at chosen paper size), watermark-free, no account required
Paid digital tier ($4.99): print-ready PDF with bleed marks and CMYK-safe color profile, for users printing locally
Export handled client-side where feasible (canvas composite of MapLibre WebGL frame + text/border layer); fall back to server-side headless rendering (e.g. Puppeteer) if resolution/quality requirements exceed client capability

6.4 Print fulfillment

Integration with a print-on-demand API (Gelato, chosen for developer-friendly API, wall-art print quality, and global local production in 32+ countries)
Order flow: rendered file → Gelato order creation → Stripe payment → Gelato handles print + ship, no inventory held
Pricing: $29–$59 base print, +$25–$40 framing upsell, target margin ~$15–20/order after production cost

6.5 Explore page (stretch goal, Week 3)

Public gallery of community-generated posters (opt-in) to showcase variety and drive organic interest


7. Technical architecture
LayerChoiceFrontend frameworkReact + ViteMap renderingMapLibre GL JS (WebGL, vector tiles)Tile/data sourceOpenStreetMap data via Protomaps or MapTiler free tierStylingTailwind CSSMotion/UI transitionsFramer MotionExportClient-side canvas composite; server-side Puppeteer fallback for high-res/PDFPaymentsStripePrint fulfillmentGelato APIHostingVercel (frontend + edge functions for Gelato/Stripe proxy calls)
Key technical risks

High-res export performance in-browser at large paper sizes — may require server-side rendering fallback earlier than planned
Vector tile provider rate limits/cost at scale if the Explore page or demo traffic spikes
Gelato API integration complexity/timing — should be de-risked early (Week 4 is late; consider a Week 3 spike)


8. Monetization
TierPriceNotesFree PNG download$0No account required, always availablePrint-ready PDF$4.99Bleed marks, CMYK profilePhysical print$29–$59Via Gelato, size-dependentFramed upgrade+$25–$40Gelato native framing option