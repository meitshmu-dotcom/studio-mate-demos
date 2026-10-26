// Ashby Lane Estate Law — shared chrome and motion system.
// Concept site by Studio Mate: the firm, attorney, clients and prices are fictional.
gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
CustomEase.create("out", "M0,0 C0.22,1 0.36,1 1,1");
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const U = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`;
window.U = U;
window.money = (n) => "$" + Math.round(n).toLocaleString("en-US");

/* ───── chrome ───── */
const LOGO = `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M8 33h24M11 33V16M20 33V16M29 33V16M6 16h28L20 7Z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><circle cx="20" cy="12.5" r="1.6" fill="#B08D57"/></svg>`;
const PAGES = [["index.html", "Home"], ["services.html", "Services"], ["plans.html", "Plans & fees"], ["about.html", "About"], ["contact.html", "Contact"]];
function chrome() {
  const here = location.pathname.split("/").pop() || "index.html";
  const dark = document.body.dataset.hdr === "dark";
  document.body.insertAdjacentHTML("afterbegin", `
  <div class="loader" aria-hidden="true"><svg viewBox="0 0 220 120"><path d="M14 92 C30 60 44 40 52 56 C58 70 40 96 34 80 C28 64 70 30 86 50 C96 64 92 84 104 74 C116 64 120 44 132 58 C140 68 136 82 150 76 C162 70 170 56 182 64 C190 70 196 74 206 70"/><path d="M14 104H206"/></svg><span class="spec">Ashby Lane Estate Law · Charlotte, NC</span><span class="count">0</span></div>
  <div class="wipe" aria-hidden="true"></div>
  <header class="hdr${dark ? " on-dark" : ""}"><div class="wrap">
    <a class="brand" href="index.html">${LOGO}<span>Ashby Lane<small>ESTATE LAW · CHARLOTTE</small></span></a>
    <nav class="nav" aria-label="Main">${PAGES.slice(1).map(([h, t]) => `<a href="${h}"${h === here ? ' aria-current="page"' : ""}>${t}</a>`).join("")}</nav>
    <a class="btn sm" href="contact.html">Book a consultation <span class="arr">→</span></a>
    <button class="menu-btn" aria-label="Menu" aria-expanded="false"><i></i><i></i></button>
  </div></header>
  <nav class="mobile-menu" aria-label="Mobile">${PAGES.map(([h, t]) => `<a href="${h}"><span>${t}</span></a>`).join("")}<p class="spec">Claire Ashby · (704) 000-0000</p></nav>`);
  document.body.insertAdjacentHTML("beforeend", `
  <footer class="ftr"><div class="wrap">
    <p class="big" data-reveal="lines">Put your family's future <em>in order.</em></p>
    <div class="cols">
      <div><p class="spec" style="opacity:.6">Ashby Lane Estate Law, PLLC</p><p style="margin-top:.6rem;max-width:24rem;opacity:.8">Claire Ashby, Attorney at Law. Wills, trusts and probate for Charlotte families.</p><p style="margin-top:1rem;opacity:.8">[Office address] · Charlotte, NC</p><p style="margin-top:.6rem"><a href="mailto:hello@example.com">hello@example.com</a><a href="tel:+17040000000">(704) 000-0000</a></p></div>
      <div>${PAGES.map(([h, t]) => `<a href="${h}">${t}</a>`).join("")}</div>
      <div><a href="#">LinkedIn</a><a href="#">Google reviews</a><a href="#">Privacy</a></div>
    </div>
    <div class="legal"><span>Attorney advertising.</span><span>The information on this site is general and is not legal advice. Contacting the firm does not create an attorney-client relationship.</span><span>[NC State Bar #000000]</span><span>Firm, attorney, clients and fees on this site are fictional, for demonstration only.</span></div>
  </div></footer>
  <div class="concept"><b>CONCEPT</b><span>Demo site by <a href="https://studiomeit.lovable.app/en" target="_blank" rel="noopener">Studio Mate</a><span class="long"> · fictional firm</span></span></div>`);
}

/* ───── smooth scroll ───── */
let lenis = null;
function smooth() {
  if (reduced) return;
  lenis = new Lenis({ lerp: .1, wheelMultiplier: .9 });
  window.lenis = lenis;
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ───── reveals ───── */
function reveals(root = document) {
  if (reduced) { // reduced motion: everything is simply there, numbers at their final value
    $$("[data-count]", root).forEach((el) => (el.textContent = (el.dataset.pre || "") + (+el.dataset.count).toLocaleString("en-US") + (el.dataset.suf || "")));
    document.documentElement.classList.add("motion-ready");
    return gsap.timeline({ paused: true });
  }
  const make = (el, scroll) => {
    const kind = el.dataset.reveal || el.dataset.load;
    const st = scroll ? { trigger: el, start: "top 86%", once: true } : undefined;
    const d = +el.dataset.delay || 0;
    if (kind === "lines") {
      const s = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "m-line" });
      return gsap.from(s.lines, { yPercent: 115, duration: 1.15, stagger: .09, ease: "out", delay: d, scrollTrigger: st });
    }
    if (kind === "up") return gsap.from(el, { autoAlpha: 0, y: 36, duration: 1, ease: "out", delay: d, scrollTrigger: st });
    if (kind === "stagger") return gsap.from(el.children, { autoAlpha: 0, y: 44, duration: .95, stagger: .09, ease: "out", delay: d, scrollTrigger: st });
    if (kind === "img") {
      const img = el.querySelector("img");
      gsap.fromTo(img, { scale: 1.3 }, { scale: 1.12, duration: 1.8, ease: "out", delay: d, scrollTrigger: st });
      return gsap.fromTo(el, { clipPath: "inset(18% 12% 18% 12% round 2rem)" }, { clipPath: "inset(0% 0% 0% 0% round 0rem)", duration: 1.5, ease: "out", delay: d, scrollTrigger: st });
    }
    return gsap.from(el, { autoAlpha: 0, duration: 1, delay: d, scrollTrigger: st });
  };
  const load = gsap.timeline({ paused: true });
  $$("[data-load]", root).forEach((el, i) => load.add(make(el, false), i * .08));
  $$("[data-reveal]", root).forEach((el) => make(el, true));
  $$("[data-parallax]", root).forEach((el) => {
    const a = +el.dataset.parallax || 10;
    gsap.fromTo(el, { yPercent: -a }, { yPercent: a, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
  });
  $$("[data-count]", root).forEach((el) => {
    const end = +el.dataset.count, pre = el.dataset.pre || "", suf = el.dataset.suf || "";
    const o = { v: 0 };
    gsap.to(o, { v: end, duration: 2, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 90%", once: true }, onUpdate: () => (el.textContent = pre + Math.round(o.v).toLocaleString("en-US") + suf) });
  });
  $$(".marquee .track", root).forEach((t) => {
    t.innerHTML += t.innerHTML;
    const tw = gsap.to(t, { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
    ScrollTrigger.create({ trigger: t, start: "top bottom", end: "bottom top", onUpdate: (s) => gsap.to(tw, { timeScale: 1 + Math.min(Math.abs(s.getVelocity()) / 400, 4) * (s.direction), duration: .3, overwrite: true }) });
  });
  document.documentElement.classList.add("motion-ready");
  return load;
}

/* ───── header + menu ───── */
function header() {
  const h = $(".hdr");
  ScrollTrigger.create({ start: 40, end: "max", onToggle: (s) => h.classList.toggle("scrolled", s.isActive) });
  const btn = $(".menu-btn"), menu = $(".mobile-menu");
  const tl = gsap.timeline({ paused: true, onReverseComplete: () => gsap.set(menu, { display: "none" }) })
    .set(menu, { display: "flex" })
    .fromTo(menu, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: .7, ease: "out" })
    .from($$("a span", menu), { yPercent: 110, duration: .7, stagger: .06, ease: "out" }, .2);
  btn.addEventListener("click", () => {
    const open = !document.documentElement.classList.contains("menu-open");
    document.documentElement.classList.toggle("menu-open", open);
    btn.setAttribute("aria-expanded", open);
    open ? (lenis?.stop(), tl.timeScale(1).play()) : (lenis?.start(), tl.timeScale(1.5).reverse());
  });
}

/* ───── preloader + page transitions (one wipe language) ───── */
function entrance(load) {
  const html = document.documentElement, loader = $(".loader"), wipe = $(".wipe");
  const came = sessionStorage.getItem("al-wipe") === "1";
  sessionStorage.removeItem("al-wipe");
  const done = () => { html.classList.add("loaded"); load.play(); window.dispatchEvent(new Event("site:ready")); };
  if (reduced) { loader.remove(); return done(); }
  if (came) {
    loader.remove();
    gsap.set(wipe, { yPercent: 0 });
    html.classList.remove("is-leaving");
    gsap.to(wipe, { yPercent: -100, duration: .9, ease: "out", delay: .05, onStart: done, onComplete: () => gsap.set(wipe, { yPercent: 100 }) });
  } else if (!sessionStorage.getItem("al-seen")) {
    const count = $(".count", loader), o = { v: 0 };
    const paths = $$("path", loader);
    paths.forEach((p) => { const l = p.getTotalLength(); gsap.set(p, { strokeDasharray: l, strokeDashoffset: l }); });
    gsap.timeline()
      .to(paths, { strokeDashoffset: 0, duration: 1.3, stagger: .18, ease: "power2.inOut" }, 0)
      .to(o, { v: 100, duration: 1.6, ease: "power2.inOut", onUpdate: () => (count.textContent = Math.round(o.v)) }, 0)
      .to(loader, { clipPath: "inset(0 0 100% 0)", duration: .9, ease: "out" }, "+=.15")
      .add(done, "-=.5");
  } else { loader.remove(); done(); }
  sessionStorage.setItem("al-seen", "1");

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.href.split("#")[0] === location.href.split("#")[0]) return;
    e.preventDefault();
    sessionStorage.setItem("al-wipe", "1");
    lenis?.stop();
    gsap.fromTo(wipe, { yPercent: 100 }, { yPercent: 0, duration: .7, ease: "power3.inOut", onComplete: () => (location.href = url.href) });
  });
  addEventListener("pageshow", (e) => { if (e.persisted) { gsap.set(wipe, { yPercent: 100 }); lenis?.start(); } });
}

/* ───── boot ───── */
window.Site = { $, $$, reduced, reveals, get lenis() { return lenis; } };
document.addEventListener("DOMContentLoaded", async () => {
  chrome();
  window.dispatchEvent(new Event("site:build")); // pages render their dynamic markup here
  smooth(); header();
  await document.fonts.ready;
  const load = reveals();
  ScrollTrigger.refresh();
  entrance(load);
});
