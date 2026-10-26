// Ink spills that open the next chapter (full-motion-web §1ב, pattern K1).
// Every <section class="spill"> holds a sticky .stage. Scrolling through the section:
//   spill: a drop forms (at the hero pen's nib or above the page), falls, lands and spreads into a stain;
//          the next chapter (.over) is visible only inside the ink.
//   drain: the ink recedes into a drop at the bottom edge and the paper underneath returns,
//          with the next chapter (.over) visible only on the paper.
// The stain is drawn in WebGL: a fractal edge that grows in lobes, a darker rim where ink pools,
// capillary fibers bleeding into the paper and a few splash droplets. data-tex paints the inside
// of the stain with a photo instead of flat ink (the desk under the will).
(() => {
  const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`;
  const FRAG = `precision highp float;
uniform vec2 uRes; uniform vec2 uO; uniform float uR, uSeed, uDpr, uHasTex; uniform vec3 uInk; uniform sampler2D uTex; uniform vec2 uTexScale;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 5; i++) { v += a * n(p); p = p * 2.03 + 17.1; a *= .5; } return v; }
void main(){
  vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec2 d = px - uO; float r = length(d), ang = atan(d.y, d.x);
  float R = uR;
  // the stain grows in lobes; the lobe shape evolves slowly as it spreads
  float lobes = fbm(vec2(cos(ang), sin(ang)) * 1.7 + vec2(uSeed, R * .0009));
  float edge = fbm(px / (90. * uDpr) + uSeed * 3.1);
  float RR = R * (.74 + .52 * lobes) + (edge - .5) * min(R * .22, 90. * uDpr);
  float aa = 1.6 * uDpr;
  float core = 1. - smoothstep(RR - aa, RR + aa, r);
  // capillary fibers: radial streaks that bleed a little past the edge
  float fib = fbm(vec2(ang * 38. + uSeed, r / (260. * uDpr)));
  float fw = R * .055 + 9. * uDpr;
  float fiber = smoothstep(.6, .9, fib) * (1. - smoothstep(RR, RR + fw, r)) * step(RR - aa, r);
  // splash droplets around the point of impact
  float drops = 0.;
  for (int i = 0; i < 7; i++) {
    float fi = float(i), a = h(vec2(fi, uSeed)) * 6.2832, dist = (1.15 + .9 * h(vec2(uSeed, fi))) * (34. * uDpr + R * .2);
    float rad = (2. + 5. * h(vec2(fi * 3.1, uSeed))) * uDpr * smoothstep(0., 60. * uDpr, R);
    drops = max(drops, 1. - smoothstep(rad - aa, rad + aa, length(px - uO - vec2(cos(a), sin(a)) * dist)));
  }
  float alpha = max(max(core, fiber * .42), drops);
  if (alpha < .002) { gl_FragColor = vec4(0.); return; }
  // pooled rim: ink gathers and darkens at the edge as it dries
  float rimW = 6. * uDpr + R * .025;
  float rim = smoothstep(RR - rimW * 3., RR - aa, r) * core;
  vec3 ink = uInk * (.9 + .16 * fbm(px / (420. * uDpr) + uSeed * 5.));
  vec3 col = ink * (1. - .38 * rim);
  if (uHasTex > .5) {
    vec2 uv = (px / uRes - .5) / uTexScale + .5;
    vec3 photo = texture2D(uTex, uv).rgb;
    col = mix(photo, ink * .85, clamp(rim * .75 + (1. - core) * .9, 0., 1.));
  }
  gl_FragColor = vec4(col * alpha, alpha);
}`;
  const ease = (cur, target, tau, dt) => cur + (target - cur) * (1 - Math.exp(-dt / tau));
  const clamp01 = (t) => Math.min(1, Math.max(0, t));
  const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16) / 255);

  function makeGL(canvas, texUrl) {
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, antialias: false, alpha: true });
    if (!gl) return null;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = {}; ["uRes", "uO", "uR", "uSeed", "uDpr", "uHasTex", "uInk", "uTex", "uTexScale"].forEach((k) => (u[k] = gl.getUniformLocation(prog, k)));
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    const out = { gl, u, tex: null, texW: 1, texH: 1 };
    gl.uniform1f(u.uHasTex, 0);
    if (texUrl) {
      const img = new Image(); img.crossOrigin = "anonymous";
      img.onload = () => {
        const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
        out.tex = t; out.texW = img.naturalWidth; out.texH = img.naturalHeight; out.dirty = true;
        gl.uniform1i(u.uTex, 0); gl.uniform1f(u.uHasTex, 1);
      };
      img.src = texUrl;
    }
    return out;
  }

  addEventListener("site:ready", () => {
    const { $, $$, reduced } = window.Site;
    const INK = getComputedStyle(document.documentElement).getPropertyValue("--inkc").trim() || "#16244A";
    const sections = $$(".spill");
    if (reduced) { // the chapters simply stack; the page got shorter, so every reveal trigger is re-measured
      sections.forEach((s) => s.classList.add("static")); ScrollTrigger.refresh(); dispatchEvent(new Event("spill:static")); return;
    }

    const stages = sections.map((sec, i) => {
      const stage = $(".stage", sec), canvas = $("canvas.stain", stage), over = $(".over", stage), drop = $(".drop", stage);
      const mode = sec.dataset.mode || "spill";
      const end = +(sec.dataset.spillEnd || 1); // fraction of the section the spill itself takes (the rest belongs to the chapter)
      const g = makeGL(canvas, sec.dataset.tex ? U(sec.dataset.tex, 2000) : null);
      if (!g) sec.classList.add("no-gl");
      const s = { sec, stage, canvas, over, drop, mode, end, g, seed: 3.7 + i * 11.3, p: 0, shown: -1, R: 0,
        st: ScrollTrigger.create({ trigger: sec, start: "top top", end: "bottom bottom" }) };
      return s;
    });

    const size = (s) => {
      const dpr = Math.min(devicePixelRatio || 1, 1.5), w = s.stage.clientWidth, h = s.stage.clientHeight;
      s.w = w; s.h = h; s.dpr = dpr;
      if (s.canvas.width !== Math.round(w * dpr) || s.canvas.height !== Math.round(h * dpr)) {
        s.canvas.width = Math.round(w * dpr); s.canvas.height = Math.round(h * dpr); s.shown = -1;
      }
    };
    const origin = (s) => {
      if (s.sec.dataset.origin === "pen") { const t = window.HeroPen?.tip(); if (t) return { x: t.x, y: t.y + 34, nib: t }; }
      if (s.mode === "drain") return { x: s.w * .5, y: s.h * .9 };
      return { x: s.w * (s.w < 760 ? .5 : .62), y: s.h * .46 };
    };

    const draw = (s, o, R) => {
      const g = s.g;
      if (!g) { // no WebGL: a soft round stain in CSS
        s.canvas.style.background = `radial-gradient(circle at ${o.x}px ${o.y}px, var(--inkc) ${R * .9}px, transparent ${R * .9 + 2}px)`;
        return;
      }
      const { gl, u } = g, d = s.dpr;
      gl.viewport(0, 0, s.canvas.width, s.canvas.height);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      if (R <= .5) return;
      gl.uniform2f(u.uRes, s.canvas.width, s.canvas.height);
      gl.uniform2f(u.uO, o.x * d, o.y * d);
      gl.uniform1f(u.uR, R * d); gl.uniform1f(u.uSeed, s.seed); gl.uniform1f(u.uDpr, d);
      gl.uniform3fv(u.uInk, hex(INK));
      if (g.tex) { // cover-fit the photo
        const ca = s.w / s.h, ia = g.texW / g.texH;
        gl.uniform2f(u.uTexScale, ca > ia ? 1 : ia / ca, ca > ia ? ca / ia : 1);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, g.tex);
      }
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const render = (s) => {
      const o = origin(s), far = Math.max(...[[0, 0], [s.w, 0], [0, s.h], [s.w, s.h]].map(([x, y]) => Math.hypot(x - o.x, y - o.y)));
      const Rmax = far / .66 + 40;
      const q = clamp01(s.p / s.end); // progress of the spill itself
      let R, dropOn = false, dx = o.x, dy = o.y, dScale = 1, dShadow = 0;
      if (s.mode === "spill") {
        // .00–.14 the drop forms and falls · .14 impact · .14–1 the stain spreads (fast, then slower)
        const fall = clamp01(q / .14), grow = clamp01((q - .14) / .86);
        R = Rmax * (1 - Math.pow(1 - grow, 2.4)) * (grow > 0 ? 1 : 0);
        if (q < .16) {
          dropOn = true;
          const from = o.nib || { x: o.x, y: o.y - s.h * .32 };
          const form = clamp01(fall / .35), drop = clamp01((fall - .35) / .65);
          dx = from.x + (o.x - from.x) * drop; dy = from.y + (o.y - from.y) * drop * drop;
          dScale = (o.nib ? .35 + .65 * form : 1) * (1 + .5 * (1 - drop)) * (q > .14 ? 1.25 : 1);
          dShadow = 1 - drop;
        }
        // the next chapter shows only inside the ink: a mask well within the stain's smallest lobe
        const m = R * .58;
        s.over.style.setProperty("--m", `radial-gradient(circle at ${o.x}px ${o.y}px, #000 ${Math.max(0, m - 140)}px, transparent ${m}px)`);
        s.over.style.opacity = gsap.utils.clamp(0, 1, (grow - .4) / .25);
        const pen = s.sec.dataset.origin === "pen" && window.HeroPen?.el;
        if (pen) { const k = clamp01((grow - .12) / .3); pen.style.opacity = 1 - k; pen.style.translate = `${k * 60}px ${-k * 90}px`; } // the pen lifts away as the ink spreads
      } else {
        // drain: full ink → the ink recedes into a drop at the bottom edge → the drop slides away
        const shrink = clamp01((q - .06) / .74), slide = clamp01((q - .8) / .14);
        R = Rmax * Math.pow(1 - shrink, 1.7);
        const m = R * 1.42 + 30;
        s.over.style.setProperty("--m", `radial-gradient(circle at ${o.x}px ${o.y}px, transparent ${m}px, #000 ${m + 160}px)`);
        s.over.style.opacity = gsap.utils.clamp(0, 1, (shrink - .2) / .3);
        if (shrink > .97 && slide < 1) { dropOn = true; dy = o.y + slide * s.h * .25; dScale = 1 - slide * .4; }
      }
      s.R = R;
      s.drop.style.opacity = dropOn ? 1 : 0;
      s.drop.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${dScale})`;
      s.drop.style.setProperty("--sh", dShadow);
      draw(s, o, R);
      s.sec.style.setProperty("--chapter", clamp01((s.p - s.end) / (1 - s.end || 1)));
      s.sec.dispatchEvent(new CustomEvent("spill:progress", { detail: { p: s.p, q, chapter: clamp01((s.p - s.end) / (1 - s.end || 1)) } }));
    };

    stages.forEach(size);
    addEventListener("resize", () => stages.forEach((s) => { size(s); s.shown = -1; }));
    let heroReady = !!window.HeroPen?.signed;
    addEventListener("hero:signed", () => (heroReady = true));

    gsap.ticker.add((time, deltaMs) => {
      const dt = Math.min(deltaMs || 16.7, 64);
      for (const s of stages) {
        const r = s.sec.getBoundingClientRect();
        if (r.bottom < -50 || r.top > innerHeight + 50) continue; // off screen
        // the first spill waits for the pen to finish signing
        const target = s.sec.dataset.origin === "pen" && !heroReady ? 0 : s.st.progress;
        s.p = ease(s.p, target, 120, dt);
        if (Math.abs(s.p - target) < .0004) s.p = target;
        if (Math.abs(s.p - s.shown) > .0003 || s.g?.dirty) { if (s.g) s.g.dirty = false; render(s); s.shown = s.p; }
      }
    });
  });
})();
