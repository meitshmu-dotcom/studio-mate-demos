// Ashby Lane Estate Law — shared chrome and motion system.
// Concept site by Studio Mate: the firm, attorney, clients and prices are fictional.
gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
CustomEase.create("out", "M0,0 C0.22,1 0.36,1 1,1");
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
window.money = (n) => "$" + Math.round(n).toLocaleString("en-US");

/* ───── chrome ───── */
const LOGO = `<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false"><path d="M8 33h24M11 33V16M20 33V16M29 33V16M6 16h28L20 7Z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><circle cx="20" cy="12.5" r="1.6" fill="#B08D57"/></svg>`;
const PAGES = [["index.html", "Home"], ["services.html", "Services"], ["plans.html", "Plans & fees"], ["about.html", "About"], ["contact.html", "Contact"]];
const here = location.pathname.split("/").pop() || "index.html";
function chrome() {
  const dark = document.body.dataset.hdr === "dark";
  const cur = (h) => (h === here ? ' aria-current="page"' : "");
  const book = here === "contact.html" ? "#request" : "contact.html";
  document.body.insertAdjacentHTML("afterbegin", `
  <a class="skip" href="#main">Skip to content</a>
  <div class="loader" aria-hidden="true"><svg viewBox="0 0 220 120"><path d="M14 92 C30 60 44 40 52 56 C58 70 40 96 34 80 C28 64 70 30 86 50 C96 64 92 84 104 74 C116 64 120 44 132 58 C140 68 136 82 150 76 C162 70 170 56 182 64 C190 70 196 74 206 70"/><path d="M14 104H206"/></svg><span class="spec">Ashby Lane Estate Law · Charlotte, NC</span><span class="count">0</span></div>
  <div class="wipe" aria-hidden="true"></div>
  <header class="hdr${dark ? " on-dark" : ""}"><div class="wrap">
    <a class="brand" href="index.html">${LOGO}<span>Ashby Lane<small>ESTATE LAW · CHARLOTTE</small></span></a>
    <nav class="nav" aria-label="Main">${PAGES.slice(1).map(([h, t]) => `<a href="${h}"${cur(h)}>${t}</a>`).join("")}</nav>
    <a class="btn sm" href="${book}">Book a consultation <span class="arr" aria-hidden="true">→</span></a>
    <button class="menu-btn" type="button" aria-label="Menu" aria-expanded="false" aria-controls="mobile-menu"><i></i><i></i></button>
  </div></header>
  <nav class="mobile-menu" id="mobile-menu" aria-label="Mobile">${PAGES.map(([h, t]) => `<a href="${h}"${cur(h)}><span>${t}</span></a>`).join("")}<p class="spec">Claire Ashby · (704) 000-0000</p></nav>`);
  document.body.insertAdjacentHTML("beforeend", `
  <footer class="ftr"><div class="wrap">
    <p class="big" data-reveal="lines">Put your family's future <em>in order.</em></p>
    <div class="cols">
      <div><p class="spec" style="opacity:.75">Ashby Lane Estate Law, PLLC</p><p style="margin-top:.6rem;max-width:24rem;opacity:.85">Claire Ashby, Attorney at Law. Wills, trusts and probate for Charlotte families.</p><p style="margin-top:1rem;opacity:.85">[Office address] · Charlotte, NC</p><p style="margin-top:.6rem"><a href="mailto:hello@example.com">hello@example.com</a><a href="tel:+17040000000">(704) 000-0000</a></p></div>
      <nav aria-label="Footer">${PAGES.map(([h, t]) => `<a href="${h}"${cur(h)}>${t}</a>`).join("")}</nav>
      <div><p class="ph">[LinkedIn]</p><p class="ph">[Google Business Profile]</p><p class="ph">[Privacy policy]</p><p class="ph-why">Placeholders: the real site links the firm's own profiles and policy.</p></div>
    </div>
    <div class="legal"><span>Attorney advertising.</span><span>The information on this site is general and is not legal advice. Contacting the firm does not create an attorney-client relationship. Past results do not guarantee a similar outcome.</span><span>[NC State Bar #000000]</span><span>Firm, attorney, clients and fees on this site are fictional, for demonstration only.</span><span>Photos: Unsplash (Unsplash License).</span></div>
  </div></footer>
  <a class="btn mcta" href="${book}">Book a free consultation <span class="arr" aria-hidden="true">→</span></a>
  <div class="concept"><b>CONCEPT</b><span>Demo site by <a href="https://studiomeit.lovable.app/en" target="_blank" rel="noopener">Studio Mate<span class="sr-only"> (opens in a new tab)</span></a><span class="long"> · fictional firm</span></span></div>`);
  const main = $("main");
  if (main) { main.id = "main"; main.tabIndex = -1; }
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
    if (kind === "lines") { // headings keep an aria-label with the whole line; paragraphs are read as they are
      const s = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "m-line", aria: /^H[1-6]$/.test(el.tagName) ? "auto" : "none" });
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
  const outside = () => $$("main, .ftr, .concept, .mcta, .skip");
  const set = (open, refocus = true) => {
    document.documentElement.classList.toggle("menu-open", open);
    btn.setAttribute("aria-expanded", open);
    outside().forEach((el) => (el.inert = open)); // while the menu covers the page, focus stays in the menu
    if (open) { lenis?.stop(); tl.timeScale(1).play(); requestAnimationFrame(() => $("a", menu)?.focus({ preventScroll: true })); }
    else { lenis?.start(); tl.timeScale(1.5).reverse(); if (refocus) btn.focus({ preventScroll: true }); }
  };
  btn.addEventListener("click", () => set(!document.documentElement.classList.contains("menu-open")));
  addEventListener("keydown", (e) => { if (e.key === "Escape" && document.documentElement.classList.contains("menu-open")) set(false); });
  matchMedia("(min-width: 861px)").addEventListener("change", (e) => { if (e.matches && document.documentElement.classList.contains("menu-open")) set(false, false); });
}

/* ───── phones: a "Book" button in thumb reach ─────
   Shown only between scenes: hidden while an ink stage covers the bottom of the screen (so it never sits on the
   stage's key text), while the consultation form or another booking button is on screen, over the footer, and
   while the menu is open. Desktop keeps the header button instead. */
function stickyCta() {
  const cta = $(".mcta"); if (!cta) return;
  const phone = matchMedia("(max-width: 860px)");
  const H = () => innerHeight;
  const onScreen = (el, band = 0) => { const r = el.getBoundingClientRect(); return r.top < H() && r.bottom > band && r.height > 0; };
  let queued = false;
  const check = () => {
    queued = false;
    let show = phone.matches && !document.documentElement.classList.contains("menu-open") && document.documentElement.classList.contains("loaded");
    if (show && scrollY < H() * .5) show = false; // the first screen has its own buttons
    if (show && $$(".spill:not(.static)").some((s) => onScreen(s, H() - 150))) show = false; // an ink stage reaches the bottom band
    if (show && $$("#request, .ftr, main a.btn[href^='contact.html'], main a.btn[href^='#request']").some((el) => onScreen(el))) show = false;
    cta.classList.toggle("show", show);
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(check); } };
  addEventListener("scroll", queue, { passive: true });
  addEventListener("resize", queue);
  phone.addEventListener("change", queue);
  new MutationObserver(queue).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  queue();
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
  smooth(); header(); stickyCta();
  await document.fonts.ready;
  const load = reveals();
  ScrollTrigger.refresh();
  entrance(load);
});
