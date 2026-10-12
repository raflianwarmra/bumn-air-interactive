/* BUMN Air interactive — engine.
   One continuous value `pos` (0..3) drives the whole diagram. It is moved by an
   interruptible spring (Apple "Designing Fluid Interfaces" style): every change
   starts from the live on-screen value, drags track 1:1, releases hand their
   velocity to the spring, and momentum projection picks the landing stop. */
(() => {
  'use strict';
  const D = window.BUMN_DATA;
  const NS = 'http://www.w3.org/2000/svg';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = reduceMQ.matches;
  reduceMQ.addEventListener?.('change', (e) => { reduced = e.matches; kick(); });

  let lang = 'id';
  try { lang = localStorage.getItem('bumnair-lang') || 'id'; } catch (_) { /* storage blocked */ }
  const tr = (o) => (o == null ? '' : typeof o === 'string' ? o : o[lang] ?? o.id);

  function el(tag, attrs, parent) {
    const n = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  /* ================= Spring ================= */
  class Spring {
    constructor(value, response = 0.45, damping = 1) {
      this.value = value; this.target = value; this.velocity = 0;
      this.config(response, damping);
    }
    config(response, damping) {
      this.k = Math.pow((2 * Math.PI) / response, 2);
      this.c = (4 * Math.PI * damping) / response;
      return this;
    }
    to(target, velocity) { this.target = target; if (velocity != null) this.velocity = velocity; kick(); }
    jump(v) { this.value = this.target = v; this.velocity = 0; }
    step(dt) {
      if (this.value === this.target && this.velocity === 0) return false;
      const n = Math.max(1, Math.ceil(dt / (1 / 240)));
      const h = dt / n;
      for (let i = 0; i < n; i++) {
        const a = -this.k * (this.value - this.target) - this.c * this.velocity;
        this.velocity += a * h;
        this.value += this.velocity * h;
      }
      if (Math.abs(this.velocity) < 1e-4 && Math.abs(this.value - this.target) < 1e-4) {
        this.value = this.target; this.velocity = 0;
      }
      return true;
    }
  }
  const springs = [];
  const spring = (...a) => { const s = new Spring(...a); springs.push(s); return s; };

  /* ================= Colour (OKLCH) ================= */
  const PAL = {
    gov: { fill: [0.945, 0.03, 245], stroke: [0.50, 0.13, 250], text: [0.30, 0.08, 252] },
    bumn: { fill: [0.945, 0.05, 65], stroke: [0.68, 0.165, 55], text: [0.36, 0.10, 50] },
    pdam: { fill: [0.945, 0.04, 155], stroke: [0.55, 0.115, 155], text: [0.30, 0.07, 155] },
    cust: { fill: [0.95, 0.035, 350], stroke: [0.60, 0.15, 350], text: [0.34, 0.09, 350] },
    lost: { fill: [0.975, 0.003, 250], stroke: [0.66, 0.012, 250], text: [0.50, 0.012, 250] },
    support: { fill: [0.955, 0.02, 290], stroke: [0.47, 0.08, 290], text: [0.30, 0.06, 290] },
    jv: { fill: [0.945, 0.05, 65], stroke: [0.62, 0.14, 95], text: [0.33, 0.08, 80] },
  };
  const LINE = { pdam: [0.58, 0.12, 155], bumn: [0.70, 0.165, 55] };
  const BAND = { pdam: [0.86, 0.075, 155], bumn: [0.87, 0.10, 65] };
  const BAND_TEXT = { pdam: [0.32, 0.08, 155], bumn: [0.38, 0.11, 50] };
  const KIND = {
    money: { line: [0.40, 0.035, 80], text: [0.33, 0.04, 80] },
    auth: { line: [0.52, 0.12, 250], text: [0.36, 0.10, 252] },
    asset: { line: [0.62, 0.012, 250], text: [0.45, 0.012, 250] },
  };
  const WATER = [0.66, 0.13, 228];
  const WASTE = [0.48, 0.04, 60];
  const MONEY = [0.80, 0.15, 88];

  function mixColor(a, b, t) {
    let h1 = a[2], h2 = b[2];
    if (a[1] < 0.02) h1 = h2; else if (b[1] < 0.02) h2 = h1;
    let dh = h2 - h1;
    if (dh > 180) dh -= 360; else if (dh < -180) dh += 360;
    return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), (h1 + dh * t + 360) % 360];
  }
  const css = (c, alpha) => `oklch(${c[0].toFixed(4)} ${c[1].toFixed(4)} ${c[2].toFixed(2)}${alpha != null ? ' / ' + alpha.toFixed(3) : ''})`;

  /* ================= Model interpolation ================= */
  function split(pos) { const p = clamp(pos, 0, 3); const i = Math.min(2, Math.floor(p)); return [i, p - i]; }
  const mix = (arr, pos) => { const [i, f] = split(pos); return lerp(arr[i], arr[i + 1], f); };
  const mixC = (arr, pos) => { const [i, f] = split(pos); return mixColor(arr[i], arr[i + 1], f); };
  const nearestOf = (pos) => clamp(Math.round(pos), 0, 3);
  // text cross-fade: fully visible near a stop, invisible half-way between
  const fadeAt = (pos) => { const [, f] = split(pos); return clamp(Math.abs(f - 0.5) * 4 - 0.25, 0, 1); };
  const per = (v) => (Array.isArray(v) ? v : [v, v, v, v]);
  const sameText = (a, b) => tr(a) === tr(b);

  /* ================= State ================= */
  const pos = spring(0, 0.5, 1);
  const kindVis = { water: spring(1, 0.3, 1), money: spring(1, 0.3, 1), auth: spring(1, 0.3, 1) };
  const ghostOp = spring(0, 0.3, 1);
  const focusOp = { gov: spring(0, 0.35, 1), assets: spring(0, 0.35, 1) };
  let pinned = null;
  let lensKey = 'pemda';
  let shownModel = -1;
  let time = 0;
  let stageVisible = true, recVisible = false, mapVisible = false;

  /* ================= Diagram build ================= */
  const svgD = $('#diagram');
  const defs = el('defs', null, svgD);
  for (const k of Object.keys(KIND)) {
    const m = el('marker', { id: 'arr-' + k, viewBox: '0 0 10 10', refX: 8.5, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse', markerUnits: 'userSpaceOnUse' }, defs);
    el('path', { d: 'M1,1.2 L9,5 L1,8.8 z', fill: css(KIND[k].line) }, m);
  }
  const gGov = el('g', null, svgD);
  const gFocus = el('g', { 'aria-hidden': 'true' }, svgD);
  const gTrack = el('g', null, svgD);
  const gBand = el('g', null, svgD);
  const gFlows = el('g', null, svgD);
  const gGhost = el('g', { 'pointer-events': 'none' }, svgD);
  const gNodes = el('g', null, svgD);
  const gLabels = el('g', null, svgD);
  const gParticles = el('g', { 'pointer-events': 'none' }, svgD);

  // governance caption
  el('line', { x1: 20, x2: 980, y1: 100, y2: 100, stroke: 'oklch(0.88 0.01 245)', 'stroke-width': 1, 'stroke-dasharray': '2 4' }, gGov);
  const govCap = el('text', { x: 20, y: 120, class: 'gov-caption' }, gGov);
  const GOV_CAP = { id: '↑ Tata kelola: sama di semua model', en: '↑ Governance: same in every model' };

  // focus rings for the tour
  const ringGov = el('rect', { x: 10, y: 14, width: 980, height: 112, rx: 18, class: 'focus-ring', opacity: 0 }, gFocus);
  const ringAssets = el('rect', { x: 50, y: 548, width: 800, height: 48, rx: 14, class: 'focus-ring', opacity: 0 }, gFocus);

  // ---- nodes
  const nodeEls = {};
  for (const [id, n] of Object.entries(D.nodes)) {
    const g = el('g', { 'data-node': id }, gNodes);
    const rect = el('rect', { rx: 12, 'stroke-width': 2 }, g);
    const title = el('text', { class: 'n-title', 'text-anchor': 'middle' }, g);
    const sub = el('text', { class: 'n-sub', 'text-anchor': 'middle' }, g);
    nodeEls[id] = { g, rect, title, sub, n, cache: {} };
  }
  function nodeRect(id, model) {
    const n = D.nodes[id];
    return n.fixed || n.rects[model];
  }
  function nodeRectAt(id, p) {
    const n = D.nodes[id];
    if (n.fixed) return n.fixed;
    const [i, f] = split(p);
    const a = n.rects[i], b = n.rects[i + 1];
    return [lerp(a[0], b[0], f), lerp(a[1], b[1], f), lerp(a[2], b[2], f), lerp(a[3], b[3], f)];
  }

  // ---- track
  const S = D.stations, TY = D.trackY;
  const segX = S.map((s, i) => [s.x, i < S.length - 1 ? S[i + 1].x : D.custX]);
  const segEls = segX.map(([x1, x2]) => el('line', { x1, x2, y1: TY, y2: TY, 'stroke-width': 9, 'stroke-linecap': 'round' }, gTrack));
  const wastePathD = `M ${D.custX + 72} ${TY + 30} V 522 H ${S[2].x}`;
  const wasteEl = el('path', { d: wastePathD, fill: 'none', 'stroke-width': 4.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, gTrack);
  const stEls = S.map((s) => el('circle', { cx: s.x, cy: TY, r: 8.5, fill: 'var(--surface)', 'stroke-width': 3.5 }, gTrack));
  const stLabels = S.map((s) => el('text', { x: s.x, y: TY - 20, 'text-anchor': 'middle', class: 'st-label' }, gTrack));
  const ipalEl = el('circle', { cx: S[2].x, cy: 522, r: 6.5, fill: 'var(--surface)', 'stroke-width': 3 }, gTrack);
  const ipalLabel = el('text', { x: S[2].x, y: 544, 'text-anchor': 'middle', class: 'st-label-sm' }, gTrack);
  const IPAL = { id: 'IPAL / IPLT · air limbah kembali', en: 'Wastewater treatment · return line' };
  // WPA boundary marker (Bulk only)
  const wpaG = el('g', { opacity: 0 }, gTrack);
  el('line', { x1: 407, x2: 407, y1: 420, y2: 502, stroke: 'var(--ink)', 'stroke-width': 1.5, 'stroke-dasharray': '3 3' }, wpaG);
  el('rect', { x: 400, y: TY - 7, width: 14, height: 14, transform: `rotate(45 407 ${TY})`, fill: 'var(--surface)', stroke: 'var(--ink)', 'stroke-width': 2.2 }, wpaG);
  const wpaText = el('text', { x: 407, y: TY + 34, 'text-anchor': 'middle', class: 'st-label', style: 'fill: var(--ink)' }, wpaG);

  // ---- asset band
  const bandLabel = el('text', { x: 70, y: 560, class: 'band-label' }, gBand);
  const BANDLBL = { id: 'Pemilik aset', en: 'Asset owner' };
  const bandCells = segX.map(([x1, x2]) => el('rect', { x: x1 + 1, y: 566, width: x2 - x1 - 2, height: 24, rx: 5 }, gBand));
  const bandTexts = [el('text', { y: 582, 'text-anchor': 'middle', class: 'band-text' }, gBand), el('text', { y: 582, 'text-anchor': 'middle', class: 'band-text' }, gBand)];

  // ---- ghost (compare)
  const ghostBumn = el('rect', { rx: 12, fill: 'none', stroke: 'var(--ink)', 'stroke-width': 1.5, 'stroke-dasharray': '5 4' }, gGhost);
  const ghostPdam = el('rect', { rx: 12, fill: 'none', stroke: 'var(--ink)', 'stroke-width': 1.5, 'stroke-dasharray': '5 4' }, gGhost);

  // ---- flows
  const SIDE_N = { t: [0, -1], b: [0, 1], l: [-1, 0], r: [1, 0] };
  function anchor(r, side, frac) {
    const [x, y, w, h] = r;
    if (side === 't') return [x + w * frac, y];
    if (side === 'b') return [x + w * frac, y + h];
    if (side === 'l') return [x, y + h * frac];
    return [x + w, y + h * frac];
  }
  function endpoint(spec, p) {
    const [node, side, frac] = spec;
    if (Array.isArray(node)) {
      const [i, f] = split(p);
      const a = anchor(nodeRectAt(node[i], i), side, frac);
      const b = anchor(nodeRectAt(node[i + 1], i + 1), side, frac);
      return [lerp(a[0], b[0], f), lerp(a[1], b[1], f)];
    }
    return anchor(nodeRectAt(node, p), side, frac);
  }
  const bez = (P, t) => {
    const u = 1 - t;
    return [
      u * u * u * P[0][0] + 3 * u * u * t * P[1][0] + 3 * u * t * t * P[2][0] + t * t * t * P[3][0],
      u * u * u * P[0][1] + 3 * u * u * t * P[1][1] + 3 * u * t * t * P[2][1] + t * t * t * P[3][1],
    ];
  };
  const flowEls = D.flows.map((f) => {
    const g = el('g', { 'data-flow': f.id }, gFlows);
    const k = KIND[f.kind];
    const path = el('path', { fill: 'none', stroke: css(k.line), 'stroke-width': f.kind === 'money' ? 1.6 : 1.5, 'marker-end': `url(#arr-${f.kind})` }, g);
    if (f.kind !== 'money') path.setAttribute('stroke-dasharray', f.kind === 'auth' ? '5 4' : '3 4');
    const lg = el('g', null, gLabels);
    const lbg = el('rect', { rx: 6, class: 'f-label-bg', height: 18 }, lg);
    const lt = el('text', { class: 'f-label', fill: css(k.text) }, lg);
    const parts = [];
    if (f.kind === 'money') {
      const n = f.id.startsWith('g-') ? 1 : 2;
      for (let i = 0; i < n; i++) parts.push(el('circle', { r: 3.4, fill: css(MONEY), stroke: css(KIND.money.line), 'stroke-width': 1.2 }, gParticles));
    }
    return { f, g, path, lg, lbg, lt, parts, on: per(f.on), labels: per(f.label ?? null), labelKey: null, labelW: 0 };
  });

  // ---- water particles
  const waterParts = Array.from({ length: 16 }, () => el('ellipse', { rx: 4.2, ry: 2.4, fill: css([0.93, 0.06, 215]) }, gParticles));
  const wasteParts = Array.from({ length: 7 }, () => el('ellipse', { rx: 3.4, ry: 1.8, fill: css([0.94, 0.03, 80]) }, gParticles));
  const wasteLen = (522 - (TY + 30)) + (D.custX + 72 - S[2].x);

  /* ---- text fitting (only on text change) */
  function setText(node, text, maxW) {
    if (node.__t === text && node.__w === maxW) return;
    node.__t = text; node.__w = maxW;
    node.textContent = text;
    node.removeAttribute('textLength'); node.removeAttribute('lengthAdjust');
    if (maxW && text) {
      const w = node.getComputedTextLength();
      if (w > maxW) { node.setAttribute('textLength', maxW); node.setAttribute('lengthAdjust', 'spacingAndGlyphs'); }
    }
  }

  /* ================= Diagram render ================= */
  function renderDiagram() {
    const p = clamp(pos.value, 0, 3);
    const near = nearestOf(p);
    const fade = fadeAt(p);
    const [si, sf] = split(p);

    // nodes
    for (const [id, o] of Object.entries(nodeEls)) {
      const n = o.n;
      const r = nodeRectAt(id, p);
      o.rect.setAttribute('x', r[0]); o.rect.setAttribute('y', r[1]);
      o.rect.setAttribute('width', r[2]); o.rect.setAttribute('height', r[3]);
      const st = per(n.style);
      const fill = mixColor(PAL[st[si]].fill, PAL[st[si + 1]].fill, sf);
      const stroke = mixColor(PAL[st[si]].stroke, PAL[st[si + 1]].stroke, sf);
      const text = mixColor(PAL[st[si]].text, PAL[st[si + 1]].text, sf);
      o.rect.setAttribute('fill', css(fill));
      o.rect.setAttribute('stroke', css(stroke));
      const dash = n.dashed ? mix(n.dashed, p) : 0;
      o.rect.setAttribute('stroke-dasharray', dash < 0.02 ? 'none' : `${lerp(60, 6, dash).toFixed(1)} ${lerp(0, 5, dash).toFixed(1)}`);
      o.g.setAttribute('opacity', n.dashed ? lerp(1, 0.85, dash).toFixed(3) : 1);
      const titles = per(n.title), subs = per(n.sub);
      const cx = r[0] + r[2] / 2, cy = r[1] + r[3] / 2;
      o.title.setAttribute('x', cx); o.title.setAttribute('y', cy - 2);
      o.sub.setAttribute('x', cx); o.sub.setAttribute('y', cy + 15);
      o.title.setAttribute('fill', css(text)); o.sub.setAttribute('fill', css(text));
      const fs = r[2] < 200 ? 13.5 : 15;
      if (o.title.__fs !== fs) { o.title.__fs = fs; o.title.setAttribute('font-size', fs); o.title.__t = null; }
      setText(o.title, tr(titles[near]), r[2] - 18);
      setText(o.sub, tr(subs[near]), r[2] - 18);
      o.title.setAttribute('opacity', sameText(titles[si], titles[si + 1]) ? 1 : fade);
      o.sub.setAttribute('opacity', sameText(subs[si], subs[si + 1]) ? 1 : fade);

    }

    // track
    segEls.forEach((s, i) => {
      const c = mixColor(LINE[D.segOperator[si][i]], LINE[D.segOperator[si + 1][i]], sf);
      s.setAttribute('stroke', css(c));
      stEls[i].setAttribute('stroke', css(c));
    });
    wasteEl.setAttribute('stroke', css(mixColor(LINE[D.wasteOperator[si]], LINE[D.wasteOperator[si + 1]], sf), 0.85));
    ipalEl.setAttribute('stroke', css(mixColor(LINE[D.wasteOperator[si]], LINE[D.wasteOperator[si + 1]], sf)));
    wpaG.setAttribute('opacity', mix([0, 1, 0, 0], p).toFixed(3));

    // asset band
    bandCells.forEach((c, i) => c.setAttribute('fill', css(mixColor(BAND[D.segAssets[si][i]], BAND[D.segAssets[si + 1][i]], sf))));
    const labs = D.assetLabels[near];
    const changedBand = JSON.stringify(D.assetLabels[si].map((l) => tr(l[2]))) !== JSON.stringify(D.assetLabels[si + 1].map((l) => tr(l[2])));
    bandTexts.forEach((t, k) => {
      const l = labs[k];
      if (!l) { t.setAttribute('opacity', 0); return; }
      const x1 = segX[l[0]][0], x2 = segX[l[1]][1];
      t.setAttribute('x', (x1 + x2) / 2);
      setText(t, tr(l[2]), x2 - x1 - 16);
      t.setAttribute('fill', css(BAND_TEXT[D.segAssets[near][l[0]]]));
      t.setAttribute('opacity', changedBand ? fade : 1);
    });

    // flows
    const vis = { money: kindVis.money.value, auth: kindVis.auth.value, asset: kindVis.auth.value };
    for (const fe of flowEls) {
      const { f } = fe;
      const op = clamp(mix(fe.on, p), 0, 1) * clamp(vis[f.kind], 0, 1);
      fe.op = op;
      if (op < 0.005) {
        fe.g.setAttribute('visibility', 'hidden'); fe.lg.setAttribute('visibility', 'hidden');
        for (const c of fe.parts) c.setAttribute('visibility', 'hidden');
        continue;
      }
      fe.g.setAttribute('visibility', 'visible');
      const s = endpoint(f.a, p), e = endpoint(f.b, p);
      const ns = SIDE_N[f.a[1]], ne = SIDE_N[f.b[1]];
      const dist = Math.hypot(e[0] - s[0], e[1] - s[1]);
      const sameDir = ns[0] * ne[0] + ns[1] * ne[1] > 0;
      const dn = Math.abs((e[0] - s[0]) * ns[0] + (e[1] - s[1]) * ns[1]);
      const d = sameDir ? clamp(dist * 0.45, 30, 150) : clamp(Math.min(dist * 0.45, dn * 0.7 + 14), 14, 150);
      const s2 = [s[0] + ns[0] * 2, s[1] + ns[1] * 2];
      const e2 = [e[0] + ne[0] * 3, e[1] + ne[1] * 3];
      const P = [s2, [s2[0] + ns[0] * d, s2[1] + ns[1] * d], [e2[0] + ne[0] * d, e2[1] + ne[1] * d], e2];
      fe.P = P; fe.len = dist + d * 0.6;
      fe.path.setAttribute('d', `M${P[0][0].toFixed(1)},${P[0][1].toFixed(1)} C${P[1][0].toFixed(1)},${P[1][1].toFixed(1)} ${P[2][0].toFixed(1)},${P[2][1].toFixed(1)} ${P[3][0].toFixed(1)},${P[3][1].toFixed(1)}`);
      fe.g.setAttribute('opacity', op.toFixed(3));
      if (f.kind === 'auth' && !reduced) fe.path.setAttribute('stroke-dashoffset', (-time * 12).toFixed(1));

      // label
      const lab = fe.labels[near];
      const text = tr(lab);
      if (!text) { fe.lg.setAttribute('visibility', 'hidden'); }
      else {
        fe.lg.setAttribute('visibility', 'visible');
        if (fe.labelKey !== text) {
          fe.labelKey = text; fe.lt.textContent = text;
          fe.labelW = fe.lt.getComputedTextLength();
        }
        const pt = bez(P, f.lt ?? 0.5);
        const lo = f.lo || [0, 0];
        const anchorMode = f.anchor || 'middle';
        let x = pt[0] + lo[0], y = pt[1] + lo[1];
        let rx = anchorMode === 'start' ? x - 5 : x - fe.labelW / 2 - 5;
        rx = clamp(rx, 4, 996 - fe.labelW - 10);
        fe.lbg.setAttribute('x', rx.toFixed(1)); fe.lbg.setAttribute('y', (y - 12).toFixed(1));
        fe.lbg.setAttribute('width', (fe.labelW + 10).toFixed(1));
        fe.lt.setAttribute('x', (rx + 5).toFixed(1)); fe.lt.setAttribute('y', (y + 1.5).toFixed(1));
        const labs4 = fe.labels;
        const tf = sameText(labs4[si], labs4[si + 1]) ? 1 : fade;
        fe.lg.setAttribute('opacity', (op * tf).toFixed(3));
      }

      // money particles
      const showParts = !reduced && stageVisible;
      fe.parts.forEach((c, k) => {
        if (!showParts) { c.setAttribute('visibility', 'hidden'); return; }
        const speed = 55 / Math.max(60, fe.len);
        const t = (time * speed + k / fe.parts.length + (f.id.length * 0.137)) % 1;
        const q = bez(P, t);
        c.setAttribute('visibility', 'visible');
        c.setAttribute('cx', q[0].toFixed(1)); c.setAttribute('cy', q[1].toFixed(1));
        c.setAttribute('opacity', (op * Math.sin(Math.PI * t) * 1.2).toFixed(3));
      });
    }

    // water + wastewater particles
    const wv = kindVis.water.value;
    const showWater = !reduced && stageVisible && wv > 0.01;
    const x0 = S[0].x, x1 = D.custX - 4;
    waterParts.forEach((c, k) => {
      if (!showWater) { c.setAttribute('visibility', 'hidden'); return; }
      const t = (time * 0.055 + k / waterParts.length) % 1;
      c.setAttribute('visibility', 'visible');
      c.setAttribute('cx', lerp(x0, x1, t).toFixed(1)); c.setAttribute('cy', TY);
      c.removeAttribute('transform');
      c.setAttribute('opacity', (wv * Math.min(1, Math.sin(Math.PI * t) * 3)).toFixed(3));
    });
    wasteParts.forEach((c, k) => {
      if (!showWater) { c.setAttribute('visibility', 'hidden'); return; }
      const t = (time * 0.07 + k / wasteParts.length) % 1;
      let dd = t * wasteLen; let x, y;
      const sx = D.custX + 72, sy = TY + 30;
      const vert = dd < 522 - sy;
      if (vert) { x = sx; y = sy + dd; } else { x = sx - (dd - (522 - sy)); y = 522; }
      c.setAttribute('visibility', 'visible');
      c.setAttribute('transform', vert ? `rotate(90 ${x.toFixed(1)} ${y.toFixed(1)})` : '');
      c.setAttribute('cx', x.toFixed(1)); c.setAttribute('cy', y.toFixed(1));
      c.setAttribute('opacity', (wv * 0.9 * Math.min(1, Math.sin(Math.PI * t) * 3)).toFixed(3));
    });

    // ghost (compare)
    const go = ghostOp.value;
    gGhost.setAttribute('opacity', (go * 0.75).toFixed(3));
    if (pinned != null && go > 0.005) {
      const rb = nodeRect('bumn', pinned), rp = nodeRect('pdam', pinned);
      [[ghostBumn, rb], [ghostPdam, rp]].forEach(([g, r]) => { g.setAttribute('x', r[0]); g.setAttribute('y', r[1]); g.setAttribute('width', r[2]); g.setAttribute('height', r[3]); });
    }
    ringGov.setAttribute('opacity', focusOp.gov.value.toFixed(3));
    ringAssets.setAttribute('opacity', focusOp.assets.value.toFixed(3));

    if (near !== shownModel) { onModelChange(near, shownModel); shownModel = near; }
    renderSpectrum();
    renderMeters(p);
  }

  function staticDiagramText() {
    S.forEach((s, i) => setText(stLabels[i], tr(s.label)));
    setText(ipalLabel, tr(IPAL));
    setText(govCap, tr(GOV_CAP));
    setText(bandLabel, tr(BANDLBL));
    wpaText.textContent = 'WPA';
    for (const o of Object.values(nodeEls)) { o.title.__t = o.sub.__t = null; }
    for (const fe of flowEls) fe.labelKey = null;
    bandTexts.forEach((t) => { t.__t = null; });
  }

  /* ================= Spectrum slider ================= */
  const rail = $('#specRail'), thumb = $('#specThumb'), fill = $('#specFill');
  const stopsWrap = $('#specStops'), labelsWrap = $('#specLabels');
  const stopEls = D.models.map((m, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'spec-stop'; b.style.left = `${(i / 3) * 100}%`; b.tabIndex = -1;
    stopsWrap.appendChild(b);
    return b;
  });
  const labelEls = D.models.map((m, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'spec-label'; b.style.left = `${(i / 3) * 100}%`;
    b.addEventListener('click', () => goTo(i));
    labelsWrap.appendChild(b);
    return b;
  });
  let railW = rail.clientWidth;
  new ResizeObserver(() => { railW = rail.clientWidth; kick(); }).observe(rail);

  function renderSpectrum() {
    const v = pos.value;
    thumb.style.transform = `translate3d(${((v / 3) * railW).toFixed(2)}px,0,0)`;
    fill.style.transform = `scaleX(${clamp(v / 3, 0, 1).toFixed(4)})`;
    stopEls.forEach((s, i) => s.classList.toggle('passed', v >= i - 0.02));
  }
  function spectrumText() {
    labelEls.forEach((b, i) => { b.innerHTML = `<span class="n">${i + 1}</span>${tr(D.models[i].short)}`; });
    stopEls.forEach((b, i) => b.setAttribute('aria-label', tr(D.models[i].name)));
    rail.setAttribute('aria-label', tr(D.ui.sliderLabel));
  }

  const rubber = (x, c = 0.55) => (x * c) / (1 + c * Math.abs(x));
  function goTo(i, velocity) {
    i = clamp(i, 0, 3);
    if (reduced) { crossfade(() => { pos.jump(i); }); kick(); return; }
    const dist = Math.abs(i - pos.value);
    pos.config(0.42 + Math.min(0.3, dist * 0.09), velocity && Math.abs(velocity) > 0.6 ? 0.82 : 1);
    pos.to(i, velocity);
  }
  function crossfade(change) {
    svgD.style.transition = 'opacity 140ms ease-out';
    svgD.style.opacity = '0.15';
    setTimeout(() => { change(); renderDiagram(); svgD.style.opacity = '1'; }, 140);
  }

  let drag = null;
  rail.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    rail.setPointerCapture(e.pointerId);
    const r = rail.getBoundingClientRect();
    const thumbX = r.left + (pos.value / 3) * r.width;
    drag = { r, startX: e.clientX, offset: e.clientX - thumbX, moved: false, onThumb: Math.abs(e.clientX - thumbX) < 26, hist: [[e.clientX, performance.now()]] };
    if (drag.onThumb) { rail.classList.add('dragging'); pos.jump(pos.value); } // catch it mid-flight
  });
  rail.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const now = performance.now();
    drag.hist.push([e.clientX, now]);
    while (drag.hist.length > 2 && now - drag.hist[0][1] > 100) drag.hist.shift();
    if (!drag.moved && Math.abs(e.clientX - drag.startX) > 6) {
      drag.moved = true; rail.classList.add('dragging');
      if (!drag.onThumb) { drag.offset = e.clientX - (drag.r.left + (pos.value / 3) * drag.r.width); pos.jump(pos.value); }
    }
    if (drag.moved) {
      const raw = ((e.clientX - drag.offset - drag.r.left) / drag.r.width) * 3;
      const v = raw < 0 ? -rubber(-raw) : raw > 3 ? 3 + rubber(raw - 3) : raw;
      pos.jump(v); kick();
    }
  });
  function endDrag(e) {
    if (!drag) return;
    const d = drag; drag = null;
    rail.classList.remove('dragging');
    if (!d.moved) {
      const raw = ((e.clientX - d.r.left) / d.r.width) * 3;
      goTo(Math.round(clamp(raw, 0, 3)));
      return;
    }
    const h = d.hist, a = h[0], b = h[h.length - 1];
    const dt = Math.max(0.016, (b[1] - a[1]) / 1000);
    const vPx = (b[0] - a[0]) / dt;
    const v = (vPx / d.r.width) * 3; // model-units per second
    const projected = pos.value + ((v / 1000) * 0.996) / (1 - 0.996); // Apple's momentum projection
    let target = Math.round(clamp(projected, 0, 3));
    // a clear flick commits in its direction, even if short (decide by velocity sign, not position)
    if (Math.abs(v) > 0.8 && target !== pos.value && Math.sign(target - pos.value) !== Math.sign(v)) {
      target = clamp(v > 0 ? Math.ceil(pos.value) : Math.floor(pos.value), 0, 3);
    }
    goTo(target, v);
  }
  rail.addEventListener('pointerup', endDrag);
  rail.addEventListener('pointercancel', endDrag);
  rail.addEventListener('keydown', (e) => {
    const cur = nearestOf(pos.target);
    let to = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') to = cur + 1;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') to = cur - 1;
    else if (e.key === 'Home') to = 0; else if (e.key === 'End') to = 3;
    if (to != null) { e.preventDefault(); e.stopPropagation(); goTo(to); }
  });

  /* ================= Panel ================= */
  const SCORE_KEYS = [['role', 'scoreRole'], ['operator', 'scoreOperator'], ['assets', 'scoreAssets'], ['tariff', 'scoreTariff'], ['pdam', 'scorePdam'], ['link', 'scoreLink'], ['pre', 'scorePre'], ['prec', 'scorePrec']];
  const scoreEl = $('#score');
  const scoreRows = SCORE_KEYS.map(([k, lk]) => {
    const row = document.createElement('div');
    row.innerHTML = '<dt></dt><dd></dd>';
    scoreEl.appendChild(row);
    return { k, lk, row, dt: row.firstChild, dd: row.lastChild };
  });
  const METERS = [['legal', 'meterLegal'], ['tariff', 'meterTariff'], ['control', 'meterControl']];
  const metersEl = $('#meters');
  const meterRows = METERS.map(([k, lk]) => {
    const row = document.createElement('div');
    row.className = 'meter';
    row.innerHTML = '<span class="m-name"></span><span class="meter-val"></span><div class="meter-track"><div class="meter-fill"></div><div class="meter-ticks"></div><div class="meter-ghost"></div></div>';
    metersEl.appendChild(row);
    return { k, lk, name: row.querySelector('.m-name'), val: row.querySelector('.meter-val'), fill: row.querySelector('.meter-fill'), ghost: row.querySelector('.meter-ghost') };
  });
  function renderMeters(p) {
    for (const m of meterRows) {
      const v = mix(D.models.map((x) => x.meters[m.k]), p);
      m.fill.style.transform = `scaleX(${clamp(v / 3, 0.015, 1).toFixed(4)})`;
    }
  }
  function swapText(node, html) {
    if (node.__h === html) return;
    node.__h = html;
    if (reduced || !node.isConnected) { node.innerHTML = html; return; }
    node.classList.add('swap', 'out');
    clearTimeout(node.__to);
    node.__to = setTimeout(() => { node.innerHTML = html; node.classList.remove('out'); }, 120);
  }
  function panelText(model, prev, flash) {
    const m = D.models[model];
    swapText($('#modelTag'), `${model + 1} / 4`);
    swapText($('#modelName'), tr(m.name));
    swapText($('#modelTagline'), tr(m.tagline));
    swapText($('#modelSummary'), tr(m.summary));
    swapText($('#pros'), tr(m.pros));
    swapText($('#cons'), tr(m.cons));
    swapText($('#lensText'), tr(m.lens[lensKey]));
    for (const r of scoreRows) {
      r.dt.textContent = tr(D.ui[r.lk]);
      const now = tr(m.score[r.k]);
      let html = esc(now);
      if (pinned != null && pinned !== model) {
        const was = tr(D.models[pinned].score[r.k]);
        if (was !== now) html = `<span class="was">${esc(was)}</span>${esc(now)}`;
      }
      swapText(r.dd, html);
      if (flash && prev >= 0 && tr(D.models[prev].score[r.k]) !== now) {
        r.row.classList.remove('changed'); void r.row.offsetWidth; r.row.classList.add('changed');
      }
    }
    for (const mr of meterRows) {
      mr.name.textContent = tr(D.ui[mr.lk]);
      mr.val.textContent = tr(D.meterWords[mr.k][model]);
      if (pinned != null) mr.ghost.style.left = `${(D.models[pinned].meters[mr.k] / 3) * 100}%`;
    }
    rail.setAttribute('aria-valuenow', model);
    rail.setAttribute('aria-valuetext', tr(m.name));
    labelEls.forEach((b, i) => b.classList.toggle('active', i === model));
    compareText();
  }
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function onModelChange(model, prev) { panelText(model, prev, prev >= 0); }

  // lens
  $$('#lensTabs [data-lens]').forEach((b) => b.addEventListener('click', () => {
    lensKey = b.dataset.lens;
    $$('#lensTabs [data-lens]').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    swapText($('#lensText'), tr(D.models[shownModel < 0 ? 0 : shownModel].lens[lensKey]));
  }));

  // compare
  const compareBtn = $('#compareBtn');
  compareBtn.addEventListener('click', () => {
    if (pinned == null) { pinned = nearestOf(pos.value); ghostOp.to(1); }
    else { pinned = null; ghostOp.to(0); }
    document.body.classList.toggle('compare-on', pinned != null);
    compareBtn.setAttribute('aria-pressed', String(pinned != null));
    panelText(nearestOf(pos.value), -1, false);
    kick();
  });
  function compareText() {
    const lbl = $('#compareLabel');
    if (pinned == null) { lbl.textContent = tr(D.ui.compare); $('#compareHint').hidden = false; }
    else { lbl.textContent = `${tr(D.ui.compareOn)} ${tr(D.models[pinned].short)}  ✕`; $('#compareHint').hidden = true; }
    $('#compareBtn').setAttribute('aria-label', pinned == null ? tr(D.ui.compare) : `${tr(D.ui.compareOn)} ${tr(D.models[pinned].short)}. ${tr(D.ui.compareOff)}`);
  }

  // flow toggles
  $$('[data-flow]').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.flow;
    const on = b.getAttribute('aria-pressed') !== 'true';
    b.setAttribute('aria-pressed', String(on));
    b.classList.toggle('on', on);
    if (reduced) kindVis[k].jump(on ? 1 : 0); else kindVis[k].to(on ? 1 : 0);
    kick();
  }));

  /* ================= Archipelago map ================= */
  const mapSvg = $('#mapSvg');
  const dots = [];
  (function buildMap() {
    let seed = 391;
    const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const total = D.islands.reduce((a, s) => a + s[5], 0);
    const counts = D.islands.map((s) => Math.round((391 * s[5]) / total));
    counts[1] += 391 - counts.reduce((a, b) => a + b, 0);
    const pts = [];
    D.islands.forEach(([cx, cy, rx, ry, rot, ], k) => {
      const a = (rot * Math.PI) / 180, cos = Math.cos(a), sin = Math.sin(a);
      let placed = 0, tries = 0;
      const minD = Math.max(5.2, Math.sqrt((Math.PI * rx * ry) / counts[k]) * 0.62);
      while (placed < counts[k] && tries < 20000) {
        tries++;
        const u = rnd() * 2 - 1, v = rnd() * 2 - 1;
        if (u * u + v * v > 1) continue;
        const x = cx + u * rx * cos - v * ry * sin, y = cy + u * rx * sin + v * ry * cos;
        const md = tries > 12000 ? minD * 0.6 : minD;
        if (pts.some((q) => (q[0] - x) ** 2 + (q[1] - y) ** 2 < md * md)) continue;
        pts.push([x, y]); placed++;
      }
    });
    pts.forEach(([x, y]) => {
      const L = 0.45 + rnd() * 0.3, C = 0.06 + rnd() * 0.08, H = 140 + rnd() * 35;
      const c = el('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: 3.7, fill: css([L, C, H]) }, mapSvg);
      c.style.transformBox = 'fill-box'; c.style.transformOrigin = 'center';
      if (!reduced) { c.style.transform = 'scale(0)'; c.style.transition = `transform 520ms cubic-bezier(0.22,1,0.36,1) ${(x / 1000) * 900 + rnd() * 250}ms`; }
      dots.push(c);
    });
    mapSvg.setAttribute('aria-label', `${pts.length} PDAM`);
  })();
  function revealMap() { dots.forEach((c) => { c.style.transform = 'scale(1)'; }); }

  /* ================= Recommendation ================= */
  const recSvg = $('#recSvg');
  const recDefs = el('defs', null, recSvg);
  const pat = el('pattern', { id: 'jvHatch', width: 10, height: 10, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, recDefs);
  el('rect', { width: 10, height: 10, fill: css(PAL.bumn.fill) }, pat);
  el('rect', { width: 4.5, height: 10, fill: css([0.90, 0.06, 155]) }, pat);
  const rm = el('marker', { id: 'rec-arr', viewBox: '0 0 10 10', refX: 8.5, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse', markerUnits: 'userSpaceOnUse' }, recDefs);
  el('path', { d: 'M1,1.2 L9,5 L1,8.8 z', fill: css(KIND.auth.line) }, rm);
  const rmw = el('marker', { id: 'rec-arr-w', viewBox: '0 0 10 10', refX: 8.5, refY: 5, markerWidth: 8, markerHeight: 8, orient: 'auto-start-reverse', markerUnits: 'userSpaceOnUse' }, recDefs);
  el('path', { d: 'M1,1.2 L9,5 L1,8.8 z', fill: css(WATER) }, rmw);

  const R = {};
  function recBox(key, x, y, w, h, style) {
    const g = el('g', null, recSvg);
    const r = el('rect', { x, y, width: w, height: h, rx: 12, 'stroke-width': 2, fill: css(PAL[style].fill), stroke: css(PAL[style].stroke) }, g);
    const hatch = el('rect', { x, y, width: w, height: h, rx: 12, fill: 'url(#jvHatch)', opacity: 0 }, g);
    const t = el('text', { x: x + w / 2, y: y + h / 2 - 1, 'text-anchor': 'middle', class: 'n-title', fill: css(PAL[style].text) }, g);
    const s = el('text', { x: x + w / 2, y: y + h / 2 + 16, 'text-anchor': 'middle', class: 'n-sub', fill: css(PAL[style].text) }, g);
    R[key] = { g, r, hatch, t, s, w };
    return R[key];
  }
  const recLines = el('g', null, recSvg);
  const mkLine = (d) => el('path', { d, fill: 'none', stroke: css(KIND.auth.line), 'stroke-width': 1.6, 'marker-end': 'url(#rec-arr)' }, recLines);
  const L1 = mkLine('M240,80 C240,115 170,112 170,146');
  const L2 = mkLine('M360,80 C360,115 470,112 470,146');
  const L3 = mkLine('M560,80 C560,110 560,118 560,146');
  const svc = el('path', { d: 'M470,230 C470,280 452,306 414,306', fill: 'none', stroke: css(WATER), 'stroke-width': 4, 'marker-end': 'url(#rec-arr-w)' }, recLines);
  const recLbl = (x, y) => { const g = el('g', null, recSvg); const b = el('rect', { rx: 6, height: 18, class: 'f-label-bg' }, g); const t = el('text', { class: 'f-label', fill: css(KIND.auth.text), 'text-anchor': 'middle', x, y: y + 4 }, g); return { g, b, t, x, y }; };
  recBox('hold', 150, 16, 300, 64, 'bumn');
  recBox('pemda', 478, 16, 146, 64, 'gov');
  const capUp = el('text', { x: 40, y: 140, class: 'band-label' }, recSvg);
  const capDown = el('text', { x: 340, y: 140, class: 'band-label' }, recSvg);
  recBox('up', 40, 148, 260, 82, 'bumn');
  recBox('down', 340, 148, 260, 82, 'pdam');
  recBox('cust', 230, 282, 180, 52, 'cust');
  const lab1 = recLbl(205, 110), lab2 = recLbl(415, 110), lab3 = recLbl(560, 112);
  const linkG = el('g', null, recSvg);
  const linkBg = el('rect', { rx: 11, height: 24, fill: 'var(--ink)' }, linkG);
  const linkT = el('text', { x: 320, y: 193, 'text-anchor': 'middle', class: 'f-label', fill: 'var(--surface)' }, linkG);
  const recWater = Array.from({ length: 4 }, () => el('circle', { r: 3.4, fill: css(WATER), stroke: 'var(--surface)', 'stroke-width': 1.3 }, recSvg));

  let channel = 0, variant = false;
  const recP = spring(1, 0.5, 1);
  let recFrom = null, recTo = null;
  const stateKey = () => (channel === 0 ? (variant ? 'jvVar' : 'jv') : channel === 1 ? 'bulk' : 'e2e');
  function recVector(key) {
    const s = D.recStates[key];
    return {
      upFill: PAL[s.up === 'jv' ? 'bumn' : s.up].fill, upStroke: PAL[s.up].stroke, upText: PAL[s.up].text, upJv: s.up === 'jv' ? 1 : 0,
      dnFill: PAL[s.down === 'jv' ? 'bumn' : s.down].fill, dnStroke: PAL[s.down].stroke, dnText: PAL[s.down].text, dnJv: s.down === 'jv' ? 1 : 0,
      l2: s.l2, l3dash: s.l3dash,
    };
  }
  function blendVec(a, b, t) {
    const o = {};
    for (const k in a) o[k] = Array.isArray(a[k]) ? mixColor(a[k], b[k], t) : lerp(a[k], b[k], t);
    return o;
  }
  let recCur = recVector('jv');
  function setChannel(c, v) {
    channel = c; if (v != null) variant = v;
    recFrom = recCur; recTo = recVector(stateKey());
    if (reduced) { recP.jump(1); } else { recP.jump(0); recP.config(0.5, 1); recP.to(1); }
    $$('.rec-opt').forEach((b, i) => { b.setAttribute('aria-checked', String(i === channel)); b.tabIndex = i === channel ? 0 : -1; });
    const vw = $('#variantWrap');
    vw.setAttribute('aria-disabled', String(channel !== 0));
    $('#variantToggle').disabled = channel !== 0;
    recText();
    kick();
  }
  function recText() {
    const ch = D.channels[channel], st = D.recStates[stateKey()];
    const isVar = channel === 0 && variant;
    swapText($('#recStructure'), esc(tr(isVar ? ch.structureVariant : ch.structure)));
    swapText($('#recPemda'), esc(tr(ch.pemda)));
    swapText($('#recContract'), esc(tr(st.contract || ch.contract)));
    const set = (o, a, b) => { setText(o.t, a, o.w - 16); setText(o.s, b, o.w - 16); };
    set(R.hold, tr(D.ui.recHoldingBox), tr(D.ui.recHoldingSub));
    set(R.pemda, tr(D.nodes.pemda.title), tr(st.pemda));
    set(R.up, tr(ch.upLabel), lang === 'id' ? 'air baku · IPA · IPAL/IPLT' : 'raw water · treatment · wastewater');
    set(R.down, tr(isVar ? ch.downLabelVariant : ch.downLabel), lang === 'id' ? 'distribusi · tagihan · layanan' : 'distribution · billing · service');
    set(R.cust, tr(D.ui.recCustomers), '');
    R.cust.t.setAttribute('y', 312);
    capUp.textContent = tr(D.ui.recUpstream); capDown.textContent = tr(D.ui.recDownstream);
    const lt = (L, text) => { L.t.textContent = text; const w = text ? L.t.getComputedTextLength() : 0; L.b.setAttribute('x', L.x - w / 2 - 5); L.b.setAttribute('y', L.y - 9); L.b.setAttribute('width', w + 10); L.g.setAttribute('visibility', text ? 'visible' : 'hidden'); };
    lt(lab1, tr(st.l1)); lt(lab2, tr(st.l2t)); lt(lab3, tr(st.l3));
    linkT.textContent = tr(isVar ? ch.linkVariant : ch.link);
    const lw = linkT.getComputedTextLength();
    linkBg.setAttribute('x', 320 - lw / 2 - 10); linkBg.setAttribute('y', 177); linkBg.setAttribute('width', lw + 20);
  }
  function renderRec() {
    const t = recP.value;
    const v = recFrom ? blendVec(recFrom, recTo, clamp(t, 0, 1.05)) : recCur;
    recCur = v;
    R.up.r.setAttribute('fill', css(v.upFill)); R.up.r.setAttribute('stroke', css(v.upStroke)); R.up.hatch.setAttribute('opacity', (v.upJv * 0.9).toFixed(3));
    R.up.t.setAttribute('fill', css(v.upText)); R.up.s.setAttribute('fill', css(v.upText));
    R.down.r.setAttribute('fill', css(v.dnFill)); R.down.r.setAttribute('stroke', css(v.dnStroke)); R.down.hatch.setAttribute('opacity', (v.dnJv * 0.9).toFixed(3));
    R.down.t.setAttribute('fill', css(v.dnText)); R.down.s.setAttribute('fill', css(v.dnText));
    L2.setAttribute('opacity', v.l2.toFixed(3));
    L3.setAttribute('stroke-dasharray', v.l3dash > 0.5 ? '5 4' : 'none');
    const tf = recFrom ? clamp(Math.abs(t - 0.5) * 3, 0, 1) : 1;
    [R.up.t, R.up.s, R.down.t, R.down.s, R.pemda.s, lab1.g, lab2.g, lab3.g, linkG].forEach((n) => n.setAttribute('opacity', tf.toFixed(3)));
    lab2.g.setAttribute('opacity', (tf * v.l2).toFixed(3));
    const show = !reduced && recVisible;
    recWater.forEach((c, k) => {
      if (!show) { c.setAttribute('visibility', 'hidden'); return; }
      const u = (time * 0.4 + k / recWater.length) % 1;
      const P = [[470, 232], [470, 280], [452, 306], [416, 306]];
      const q = bez(P, u);
      c.setAttribute('visibility', 'visible');
      c.setAttribute('cx', q[0].toFixed(1)); c.setAttribute('cy', q[1].toFixed(1));
      c.setAttribute('opacity', Math.sin(Math.PI * u).toFixed(3));
    });
  }
  const recOptions = $('#recOptions');
  D.channels.forEach((ch, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'rec-opt'; b.setAttribute('role', 'radio');
    b.innerHTML = `<span class="num">${i + 1}</span><b></b><span class="fit"></span>`;
    b.addEventListener('click', () => setChannel(i));
    b.addEventListener('keydown', (e) => {
      if (['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(e.key)) {
        e.preventDefault(); e.stopPropagation();
        const n = (channel + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : 2)) % 3;
        setChannel(n); recOptions.children[n].focus();
      }
    });
    recOptions.appendChild(b);
  });
  function recOptionsText() {
    [...recOptions.children].forEach((b, i) => {
      b.querySelector('b').textContent = tr(D.channels[i].fit);
      b.querySelector('.fit').textContent = tr(D.channels[i].name);
    });
  }
  $('#variantToggle').addEventListener('change', (e) => setChannel(0, e.target.checked));

  /* ================= Animation loop ================= */
  let raf = 0, last = 0;
  function kick() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    let active = false;
    for (const s of springs) if (s.step(dt)) active = true;
    time += dt;
    renderDiagram();
    renderRec();
    const ambient = !reduced && !document.hidden && (stageVisible || recVisible);
    raf = active || ambient || drag ? requestAnimationFrame(frame) : 0;
  }
  document.addEventListener('visibilitychange', kick);

  /* ================= Visibility, nav ================= */
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.target === svgD) stageVisible = e.isIntersecting;
      if (e.target === recSvg) recVisible = e.isIntersecting;
      if (e.target === mapSvg && e.isIntersecting && !mapVisible) { mapVisible = true; revealMap(); }
    }
    kick();
  }, { threshold: 0.05 });
  [svgD, recSvg, mapSvg].forEach((n) => io.observe(n));

  const navLinks = $$('.nav a');
  const secIO = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['problem', 'models', 'rec'].forEach((id) => secIO.observe(document.getElementById(id)));
  const bar = $('#bar');
  addEventListener('scroll', () => bar.style.setProperty('--bar-shadow', scrollY > 8 ? 1 : 0), { passive: true });

  /* ================= Language ================= */
  function applyLang() {
    document.documentElement.lang = lang;
    $$('[data-t]').forEach((n) => { const v = D.ui[n.dataset.t]; if (v) n.textContent = tr(v); });
    $$('[data-t-aria]').forEach((n) => n.setAttribute('aria-label', tr(D.ui[n.dataset.tAria])));
    $$('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    document.title = lang === 'id' ? 'BUMN Air · Model Kelembagaan Interaktif' : 'BUMN Air · Interactive Institutional Models';
    staticDiagramText();
    spectrumText();
    recOptionsText();
    recText();
    const m = shownModel < 0 ? 0 : shownModel;
    panelText(m, -1, false);
    if (tourIdx >= 0) showTourStep(tourIdx, true);
    kick();
  }
  function setLang(l) {
    lang = l;
    try { localStorage.setItem('bumnair-lang', l); } catch (_) { /* ignore */ }
    applyLang();
  }
  $$('[data-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));

  /* ================= Tour ================= */
  const tourEl = $('#tour');
  let tourIdx = -1;
  function scrollToId(id) {
    const n = document.getElementById(id);
    if (!n) return;
    n.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }
  function showTourStep(i, textOnly) {
    tourIdx = i;
    const st = D.tour[i];
    $('#tourCount').textContent = `${i + 1} ${tr(D.ui.tourOf)} ${D.tour.length}`;
    $('#tourText').textContent = tr(st.text);
    $('#tourFill').style.transform = `scaleX(${(i + 1) / D.tour.length})`;
    $('#tourPrev').disabled = i === 0;
    $('#tourNextLabel').textContent = tr(i === D.tour.length - 1 ? D.ui.tourDone : D.ui.tourNext);
    if (textOnly) return;
    const sectionId = st.section === 'problem' ? 'problem' : st.section === 'models' ? 'spectrum' : 'rec';
    scrollToId(sectionId);
    if (st.pos != null) goTo(st.pos);
    if (st.channel != null) setChannel(st.channel, false);
    focusOp.gov.to(st.focus === 'gov' ? 1 : 0);
    focusOp.assets.to(st.focus === 'assets' ? 1 : 0);
  }
  function startTour() {
    tourEl.hidden = false; tourEl.classList.remove('enter'); void tourEl.offsetWidth; tourEl.classList.add('enter');
    document.body.classList.add('tour-on');
    showTourStep(0);
    $('#tourNext').focus({ preventScroll: true });
  }
  function endTour() {
    tourEl.hidden = true; tourIdx = -1;
    document.body.classList.remove('tour-on');
    focusOp.gov.to(0); focusOp.assets.to(0);
    $('#tourBtn').focus({ preventScroll: true });
  }
  const tourNext = () => (tourIdx >= D.tour.length - 1 ? endTour() : showTourStep(tourIdx + 1));
  const tourPrev = () => tourIdx > 0 && showTourStep(tourIdx - 1);
  $('#tourBtn').addEventListener('click', () => (tourIdx >= 0 ? endTour() : startTour()));
  $('#tourNext').addEventListener('click', tourNext);
  $('#tourPrev').addEventListener('click', tourPrev);
  $('#tourClose').addEventListener('click', endTour);

  /* ================= Keyboard ================= */
  const modelsSec = $('#models');
  addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;
    const k = e.key;
    if (tourIdx >= 0) {
      if (k === 'ArrowRight' || k === ' ' || k === 'PageDown') { e.preventDefault(); tourNext(); return; }
      if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); tourPrev(); return; }
      if (k === 'Escape') { e.preventDefault(); endTour(); return; }
    }
    if (k === 't' || k === 'T') { e.preventDefault(); tourIdx >= 0 ? endTour() : startTour(); return; }
    if (k === 'l' || k === 'L') { e.preventDefault(); setLang(lang === 'id' ? 'en' : 'id'); return; }
    if (/^[1-4]$/.test(k)) { e.preventDefault(); goTo(Number(k) - 1); return; }
    const r = modelsSec.getBoundingClientRect();
    const inView = r.top < innerHeight * 0.6 && r.bottom > innerHeight * 0.4;
    if (inView && (k === 'ArrowRight' || k === 'ArrowLeft') && !e.target.closest?.('[role=tablist],[role=radiogroup],.seg')) {
      e.preventDefault(); goTo(nearestOf(pos.target) + (k === 'ArrowRight' ? 1 : -1));
    }
  });

  /* ================= Init ================= */
  const hashModel = { '#holding': 0, '#bulk': 1, '#konsesi': 2, '#concession': 2, '#e2e': 3 }[location.hash];
  if (hashModel != null) pos.jump(hashModel);
  applyLang();
  setChannel(0, false);
  recP.jump(1);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => applyLang());
  renderDiagram();
  renderRec();
  kick();

  // test hook (used by the verification script; harmless in production)
  window.__bumn = { goTo, setLang, setChannel, startTour, get pos() { return pos.value; } };
})();
