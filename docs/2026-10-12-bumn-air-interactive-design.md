# BUMN Air Interactive Explainer — Design Spec

Date: 2026-10-12 · Status: approved in chat (approach A), built autonomously at user's request.

## Goal
One interactive web page where policy makers, Danantara, and the general public can see how each BUMN Air business model works and, by switching models with animation, understand what changes between them.

## Decisions (from brainstorming)
- Scope: 4 models on a spectrum (Holding → Bulk → Concession & O&M → End-to-End) + final "Recommendation: 3 channels by region" scene (July 2026 "3 Kanal" diagram).
- Language: Bahasa Indonesia default, one-tap EN toggle.
- Use: presented live (projector, keyboard Tour) and self-explored (laptop/phone).
- Shareholder: Danantara (Kemenkeu as PMN channel).
- Not included (phase 2): PSO/subsidy finance mechanics, LG-satisfaction finance models.

## Structure
1. **Problem** — 391 PDAM shown as dots over an abstract archipelago (illustrative), three facts from the concept notes, the framing question.
2. **Living diagram** — single SVG:
   - Fixed governance strip: Pemerintah Pusat, Badan Regulator, Kemenko IPK, Danantara, Investor & PT SMI.
   - Value-chain track (transit-map style): Sumber air → Air baku → Produksi (IPA) → Transmisi → Distribusi → Layanan & tagihan → Pelanggan; wastewater return line to IPAL/IPLT.
   - Track colour = who operates. Asset band = who owns. Moving nodes: BUMN Air, PDAM/AMC; fixed: Pemda, Pelanggan.
   - Flows: water (particles on track), money (gold particles), authority (dashed). Toggleable.
   - One continuous value `pos` ∈ [0,3] drives everything; the spectrum slider can be dragged 1:1, clicked, or stepped with ←/→; release uses momentum projection + spring.
   - Scorecard: role, operator, asset owner, tariff setter, PDAM position, region link, precondition, precedent; meters for legislative burden, tariff fragmentation solved, BUMN operational control (continuous with `pos`).
   - Lens tabs: Pemda / Danantara & investors / Customers.
   - Compare: pin a model; ghost outlines + side-by-side scorecard.
3. **Recommendation** — pick a region condition → mini schematic morphs to the channel (JV / Bulk / End-to-End), with JV variant toggle.
4. **Tour** — 8 captioned steps, keyboard driven.

## Visual & motion
- Light theme (bright meeting rooms, projectors). Transit-map / infrastructure-schematic lane.
- Mandatory entity colour code (OKLCH): government blue, BUMN orange, PDAM/BUMD green, customers pink, lost-role grey dashed; supporting violet for regulator/Danantara/investors.
- Atkinson Hyperlegible Next, embedded (offline). Size-specific tracking.
- Springs (critically damped by default, slight bounce only after a flick), interruptible from the live value. Reduced motion: no particles, instant state change with cross-fade.

## Build
- `src/` (template, CSS, data, app) → `build.mjs` inlines everything incl. base64 font into a single offline `index.html`.
- Published via GitHub Pages.
- Verification: headless Chromium screenshots of each model/lang/viewport, console-error check, keyboard + tour run-through.
