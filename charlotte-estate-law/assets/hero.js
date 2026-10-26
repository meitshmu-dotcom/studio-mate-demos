// Hero: a big fountain pen comes down onto the paper, signs "Claire Ashby" and lifts to rest.
// Exposes window.HeroPen.tip() (the resting nib, in stage coordinates) for the first ink spill.
(() => {
  const PEN = `<svg viewBox="0 0 300 40" aria-hidden="true">
    <defs>
      <linearGradient id="pn-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6E3A8"/><stop offset=".45" stop-color="#C9A04E"/><stop offset="1" stop-color="#7A5A22"/></linearGradient>
      <linearGradient id="pn-black" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A4A4E"/><stop offset=".3" stop-color="#121214"/><stop offset=".75" stop-color="#050506"/><stop offset="1" stop-color="#26262A"/></linearGradient>
    </defs>
    <path d="M0 20 L34 11.5 Q41 20 34 28.5 Z" fill="url(#pn-gold)"/>
    <path d="M3 20 H29" stroke="#3B2A10" stroke-width=".9"/><circle cx="29.5" cy="20" r="1.5" fill="#3B2A10"/>
    <rect x="38" y="12" width="48" height="16" rx="4" fill="url(#pn-black)"/>
    <rect x="86" y="10.5" width="9" height="19" rx="1.5" fill="url(#pn-gold)"/>
    <rect x="95" y="10" width="172" height="20" rx="9" fill="url(#pn-black)"/>
    <rect x="104" y="13" width="150" height="2.6" rx="1.3" fill="#fff" opacity=".28"/>
    <rect x="258" y="10.5" width="6" height="19" fill="url(#pn-gold)"/>
    <path d="M264 10 H284 Q296 10 296 20 Q296 30 284 30 H264 Z" fill="url(#pn-black)"/>
    <path d="M150 7 H262 Q266 7 266 10.5 H150 Z" fill="url(#pn-gold)"/>
    <rect x="146" y="5.5" width="10" height="6" rx="2" fill="url(#pn-gold)"/>
  </svg>`;
  const f = (n) => n.toFixed(1);
  const REST = { dx: 22, dy: -30, angle: -44 }; // where the pen rests after signing, relative to the end of the signature

  window.HeroPen = { tip: () => null, el: null, signed: false };

  addEventListener("site:ready", () => {
    const { $, reduced } = window.Site;
    const stage = $(".spill-1 .stage"), svg = $(".hero-sig"); if (!stage || !svg) return;
    const path = $("path", svg);
    path.setAttribute("pathLength", "1");
    const pen = document.createElement("div");
    pen.className = "big-pen"; pen.innerHTML = PEN; stage.appendChild(pen);
    window.HeroPen.el = pen;

    const width = () => (innerWidth < 760 ? 200 : 380);
    const sigPt = (t) => { // a point on the signature, in stage coordinates
      const p = path.getPointAtLength(path.getTotalLength() * t), k = svg.clientWidth / 230;
      const sr = svg.getBoundingClientRect(), st = stage.getBoundingClientRect();
      return { x: sr.left - st.left + p.x * k, y: sr.top - st.top + p.y * k };
    };
    let last = { x: 0, y: 0, lift: 1, angle: REST.angle };
    const place = (x, y, lift, angle) => {
      last = { x, y, lift, angle };
      const w = width(), tipY = w * 20 / 300;
      pen.style.width = w + "px"; pen.style.transformOrigin = `0px ${tipY}px`;
      pen.style.transform = `translate3d(${f(x)}px, ${f(y - tipY - lift * 16)}px, 0) rotate(${f(angle)}deg)`;
      pen.style.filter = `drop-shadow(${f(4 + 24 * lift)}px ${f(8 + 34 * lift)}px ${f(4 + 14 * lift)}px rgba(0,0,0,${(.3 - .1 * lift).toFixed(3)}))`;
    };
    // the resting nib, where the first drop of ink forms
    window.HeroPen.tip = () => ({ x: last.x, y: last.y - last.lift * 16 });
    const rest = (k) => { const e = sigPt(1); place(e.x + REST.dx * k, e.y + REST.dy * k, k, -38 + (REST.angle + 38) * k); };

    if (reduced) { path.style.strokeDashoffset = 0; rest(1); pen.style.opacity = 1; window.HeroPen.signed = true; return; }

    gsap.set(path, { strokeDasharray: 1, strokeDashoffset: 1 });
    const s0 = sigPt(0), sign = { t: 0 }, come = { k: 1 }, go = { k: 0 };
    gsap.timeline({ delay: .45 })
      .fromTo(pen, { autoAlpha: 0 }, { autoAlpha: 1, duration: .6 }, 0)
      .to(come, { k: 0, duration: .95, ease: "power3.out", onUpdate: () => place(s0.x + 90 * come.k, s0.y - 130 * come.k, .3 + .7 * come.k, -38 + 10 * come.k) }, 0)
      .to(sign, { t: 1, duration: 2.9, ease: "sine.inOut", onUpdate: () => {
        path.style.strokeDashoffset = 1 - sign.t;
        const p = sigPt(sign.t); place(p.x, p.y, 0, -38 + Math.sin(sign.t * 18) * 1.4);
      } }, .95)
      .to(go, { k: 1, duration: 1.1, ease: "power2.inOut", onUpdate: () => rest(go.k) }, 3.85)
      .add(() => { window.HeroPen.signed = true; dispatchEvent(new Event("hero:signed")); }, 4.9);
    addEventListener("resize", () => { if (window.HeroPen.signed) rest(1); });
  });
})();
