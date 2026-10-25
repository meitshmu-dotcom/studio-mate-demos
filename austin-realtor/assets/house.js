// Home page signature: a blueprint traces a real Austin house, the photo paints in through the lines
// in afternoon light, then warms to golden hour with string lights hung from the roof.
// One scrubbed timeline drives the drawing, the photo, the HUD (stage, sq ft, time of day) and the captions.
// Photo: Unsplash (photo-1757524492552). Line coordinates are traced on the same 1200×675 frame.
(() => {
  const PHOTO = "https://images.unsplash.com/photo-1757524492552-d47a66a2b63e?auto=format&fit=crop&w=2400&h=1350&q=80";
  const L = (d, cls = "") => `<path class="ln ${cls}" pathLength="1" d="${d}"/>`;
  const R = (x1, y1, x2, y2) => `M${x1} ${y1}H${x2}V${y2}H${x1}Z`;

  // catenary strands hung from roof edges: [x1, x2, eaveY, sag, loops]
  const strands = [[218, 440, 414, 16, 3], [930, 1088, 390, 13, 2]];
  let wires = "", bulbs = "";
  strands.forEach(([x1, x2, y, sag, n]) => {
    const w = (x2 - x1) / n;
    for (let k = 0; k < n; k++) {
      const a = x1 + k * w, b = a + w;
      wires += `M${a} ${y} Q${a + w / 2} ${y + sag * 2} ${b} ${y} `;
      for (let t = .12; t < .95; t += .19) { // points on the quadratic curve
        const x = (1 - t) ** 2 * a + 2 * (1 - t) * t * (a + w / 2) + t * t * b;
        const yy = (1 - t) ** 2 * y + 2 * (1 - t) * t * (y + sag * 2) + t * t * y;
        bulbs += `<g class="bulb" transform="translate(${x.toFixed(1)} ${(yy + 5).toFixed(1)})"><circle r="9" fill="url(#halo)"/><circle r="2.6" fill="#FFF0C4"/></g>`;
      }
    }
  });

  const SVG = `
<svg class="scene" viewBox="0 0 1200 675" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style="overflow:visible">
  <defs>
    <linearGradient id="feather" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".18" stop-color="#fff"/><stop offset="1" stop-color="#fff"/></linearGradient>
    <mask id="paint" maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="5200" height="5200"><rect class="paint-rect" x="-2000" y="700" width="5200" height="3000" fill="url(#feather)"/></mask>
    <radialGradient id="halo"><stop offset="0" stop-color="#FFD98A" stop-opacity=".95"/><stop offset="1" stop-color="#FFB547" stop-opacity="0"/></radialGradient>
    <radialGradient id="warm"><stop offset="0" stop-color="#FFC56B" stop-opacity=".55"/><stop offset="1" stop-color="#FFC56B" stop-opacity="0"/></radialGradient>
    <linearGradient id="toGround" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E2A18" stop-opacity="0"/><stop offset="1" stop-color="#1E2A18"/></linearGradient>
    <linearGradient id="noon" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8DB7DE"/><stop offset=".55" stop-color="#C9DCEA" stop-opacity=".6"/><stop offset="1" stop-color="#C9DCEA" stop-opacity="0"/></linearGradient>
  </defs>

  <g class="photo" mask="url(#paint)">
    <rect x="-2000" y="660" width="5200" height="3000" fill="#1E2A18"/>
    <rect x="-2000" y="-3000" width="5200" height="3010" fill="#5F7FB7"/>
    <image href="${PHOTO}" x="0" y="0" width="1200" height="675" preserveAspectRatio="xMidYMid slice"/>
    <rect x="-2000" y="560" width="5200" height="116" fill="url(#toGround)"/>
    <rect class="noon" x="-2000" y="-3000" width="5200" height="3675" fill="url(#noon)" style="mix-blend-mode:color"/>
  </g>

  <!-- golden hour: windows breathe, string lights hang from the roof edges -->
  <g class="dusk" opacity="0" style="mix-blend-mode:screen">
    <ellipse cx="655" cy="380" rx="70" ry="110" fill="url(#warm)"/>
    <ellipse cx="480" cy="378" rx="40" ry="50" fill="url(#warm)"/>
    <ellipse cx="295" cy="468" rx="55" ry="55" fill="url(#warm)"/>
    <ellipse cx="562" cy="470" rx="55" ry="50" fill="url(#warm)"/>
  </g>
  <g class="lights" opacity="0">
    <path d="${wires}" fill="none" stroke="#2A2420" stroke-width="1.4" opacity=".85"/>
    ${bulbs}
  </g>

  <!-- the blueprint lines, traced on the photo -->
  <g class="lines">
    <g class="g-lot">
      ${L("M-400 512 H45 V552 H680 V510 M610 510 V497 H995 V506 H1600")}
      ${L("M45 512 H680", "thin")}
      ${L("M20 230 H1180 V640 H20 Z", "thin")}
      ${L("M1120 620 V575 M1120 575 l-9 16 M1120 575 l9 16", "thin")}
      <text class="t-lot" x="760" y="222">LOT 14 · BLOCK C · 0.48 AC</text>
      <text class="t-lot" x="1104" y="636">N</text>
    </g>
    <g class="g-frame">
      ${L(R(587, 265, 728, 278))}
      ${L("M598 278 V512 M716 278 V470")}
      ${L(R(616, 295, 704, 470) + " M640 295 V470 M664 295 V470 M688 295 V470 M616 405 H704")}
      ${L(R(420, 317, 593, 331) + R(708, 318, 882, 331))}
      ${L("M432 331 V400 M432 331 H593")}
      ${L(R(462, 340, 500, 412) + R(530, 356, 605, 406) + " M568 356 V406")}
      ${L(R(740, 343, 866, 381) + " M716 356 H882 M788 343 V381 M826 343 V381")}
      ${L(R(888, 332, 935, 380))}
      ${L(R(213, 398, 443, 421))}
      ${L("M222 421 V512 M420 421 V512")}
      ${L(R(258, 427, 332, 510) + " M283 427 V510 M307 427 V510")}
      ${L(R(428, 432, 500, 492) + " M452 432 V492 M476 432 V492")}
      ${L(R(508, 406, 606, 424) + R(526, 440, 600, 512) + " M563 440 V512")}
      ${L(R(925, 372, 1092, 389))}
      ${L("M716 381 H925 M1086 389 V482 M716 470 V482 H1086")}
      ${L("M213 384 H443 M213 378 V390 M443 378 V390 M1110 372 V482 M1102 372 H1118 M1102 482 H1118", "thin")}
      <text class="t-dim" x="296" y="372">32'-0"</text>
      <text class="t-dim" x="1122" y="432">14'</text>
    </g>
  </g>
</svg>`;

  window.addEventListener("site:build", () => {
    const sky = document.querySelector(".build .sky");
    if (!sky) return;
    sky.insertAdjacentHTML("afterend", SVG); // above the sky layers, below the copy and HUD
  });

  window.addEventListener("site:ready", () => {
    const { $, $$, reduced } = window.Site;
    const build = $(".build"); if (!build) return;
    const svg = $(".scene", build);
    // desktop: the photo fills the screen; portrait: the whole house fits the width near the top
    const fitView = () => {
      const tall = innerWidth / innerHeight < .9;
      svg.setAttribute("viewBox", tall ? "200 -170 900 1500" : "0 0 1200 675");
      svg.setAttribute("preserveAspectRatio", tall ? "xMidYMin meet" : "xMidYMid slice");
    };
    fitView(); addEventListener("resize", fitView);

    const lines = (g) => $$(`.${g} .ln`, svg);
    const caps = $(".caps"), big = $(".hud .big"), stageTxt = $(".hud .stg"), clock = $(".hud .clock");
    const fills = $$(".hud .bar b");
    const sqft = { v: 0 }, time = { m: 6 * 60 };
    const fmtTime = (m) => { const h = Math.floor(m / 60), mm = Math.round(m % 60); return `${((h + 11) % 12) + 1}:${String(mm).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`; };
    const labels = ["The lot", "The frame", "The finish", "Golden hour"];
    let lastStage = -1;
    const setStage = (i) => { if (i === lastStage) return; lastStage = i; stageTxt.textContent = `Stage 0${i + 1} / 04 · ${labels[i]}`; };
    const photo = $(".photo", svg), noon = $(".noon", svg);

    gsap.set($$(".ln", svg), { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set($$("text", svg), { autoAlpha: 0 });
    gsap.set(photo, { filter: "saturate(.55) brightness(1.18) contrast(.9)" });
    const capEls = $$(".cap", caps);
    gsap.set(capEls, { autoAlpha: 0, y: 24 });

    const tl = gsap.timeline({ defaults: { ease: "none" }, onUpdate: () => {
      big.textContent = Math.round(sqft.v).toLocaleString("en-US");
      clock.textContent = fmtTime(time.m);
      const p = tl.time(); setStage(p < 2.5 ? 0 : p < 4.5 ? 1 : p < 6.5 ? 2 : 3);
    } });
    const cap = (i, at, out) => { tl.to(capEls[i], { autoAlpha: 1, y: 0, duration: .4, ease: "power2.out" }, at); if (out) tl.to(capEls[i], { autoAlpha: 0, y: -24, duration: .35, ease: "power2.in" }, out); };

    // intro copy leaves, HUD arrives
    tl.to(".hero-copy", { autoAlpha: 0, y: -60, duration: .8, ease: "power2.in" }, .3)
      .fromTo(".hud .read", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .5, ease: "power2.out" }, .9);
    // 1 · lot
    tl.to(lines("g-lot"), { strokeDashoffset: 0, duration: 1.2, stagger: .15 }, 1)
      .to($$(".t-lot", svg), { autoAlpha: 1, duration: .3 }, 1.6)
      .to(fills[0], { scaleX: 1, duration: 1.5 }, 1);
    cap(0, 1.2, 2.4);
    // 2 · frame
    tl.to(lines("g-frame"), { strokeDashoffset: 0, duration: 1.3, stagger: .06 }, 2.5)
      .to($$(".t-dim", svg), { autoAlpha: 1, duration: .3 }, 3.6)
      .to(sqft, { v: 4180, duration: 1.8 }, 2.6)
      .to(time, { m: 11 * 60 + 30, duration: 2 }, 2.5)
      .to(fills[1], { scaleX: 1, duration: 2 }, 2.5);
    cap(1, 2.7, 4.3);
    // 3 · finish: the real house paints in from the ground up, in cool afternoon light
    tl.to(".sky .grid", { autoAlpha: 0, duration: 1 }, 4.6)
      .to($(".paint-rect", svg), { attr: { y: -900 }, duration: 1.6, ease: "power1.inOut" }, 4.5)
      .to($(".g-lot", svg), { opacity: 0, duration: .6 }, 4.9)
      .to($(".g-frame", svg), { opacity: 0, duration: 1 }, 5.6)
      .to($$("text", svg), { autoAlpha: 0, duration: .4 }, 4.9)
      .to(".build .stage", { "--scrim": .9, duration: .8 }, 4.8)
      .to(time, { m: 15 * 60 + 30, duration: 2 }, 4.5)
      .to(fills[2], { scaleX: 1, duration: 2 }, 4.5);
    cap(2, 5, 6.3);
    // 4 · golden hour: the grade warms to the real dusk photo, windows glow, lights come on
    tl.to(noon, { opacity: 0, duration: 1.4 }, 6.5)
      .to(photo, { filter: "saturate(1) brightness(1) contrast(1)", duration: 1.4 }, 6.5)
      .to($(".dusk", svg), { opacity: 1, duration: 1 }, 7)
      .to($(".lights", svg), { opacity: 1, duration: .3 }, 7.3)
      .from($$(".bulb", svg), { opacity: 0, duration: .2, stagger: .04 }, 7.3)
      .to(time, { m: 19 * 60 + 42, duration: 1.8 }, 6.5)
      .to(fills[3], { scaleX: 1, duration: 1.8 }, 6.5);
    cap(3, 7.2, null);
    tl.to({}, { duration: 1.4 }); // hold on the finished home

    // HUD + captions read light from the photo stage on (a scrim sits behind them)
    const tone = () => caps.classList.toggle("glow", tl.time() >= 4.9);
    tl.eventCallback("onUpdate", ((orig) => function () { orig(); tone(); })(tl.eventCallback("onUpdate")));

    if (reduced) { tl.progress(1); return; }
    if (/[?&]trace\b/.test(location.search)) { // QA: lines over the finished photo, to check the tracing
      tl.progress(1); gsap.set($(".lines", svg), { opacity: 1 }); gsap.set($$(".g-lot, .g-frame", svg), { opacity: 1 });
      gsap.set($$(".ln", svg), { strokeDashoffset: 0, stroke: "#FF2D55" }); gsap.set(capEls, { autoAlpha: 0 }); return;
    }
    const st =ScrollTrigger.create({ trigger: build, start: "top top", end: "bottom bottom", scrub: .8, animation: tl });
    gsap.to($$(".bulb circle:last-child", svg), { opacity: .55, duration: 1.2, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: { each: .17, from: "random" } });
    gsap.to($$(".dusk ellipse", svg), { opacity: .7, duration: 2.6, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: .6 });

    // "Watch it build": scrolls the page with the film; any wheel or touch hands control back
    $(".watch")?.addEventListener("click", () => {
      const lenis = window.Site.lenis, end = st.end - 2;
      if (!lenis) return scrollTo(0, end);
      lenis.scrollTo(Math.max(scrollY, st.start + 1), { immediate: true });
      lenis.scrollTo(end, { duration: 16, easing: (t) => t });
    });
  });
})();
