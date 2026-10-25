// Marlow Home Co. — shared chrome, data and motion system.
// Concept site by Studio Mate: the agent, brokerage and listings are fictional.
gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
CustomEase.create("out", "M0,0 C0.22,1 0.36,1 1,1");
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const U = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`;

/* ───── demo data (fictional) ───── */
window.LISTINGS = [
  { id: "juniper", addr: "2814 Juniper Bend", hood: "Travis Heights", price: 1385000, beds: 4, baths: 3, sqft: 2640, tag: "New", img: "1600596542815-ffad4c1539a9", more: ["1600210491892-03d54c0aaf87", "1616486338812-3dadae4b4ace"], note: "Limestone and glass on a quiet, tree-lined street, ten minutes from South Congress." },
  { id: "pecan", addr: "611 Pecan Hollow Ln", hood: "Mueller", price: 749000, beds: 3, baths: 2.5, sqft: 1980, tag: "Open Sat", img: "1580587771525-78b9dba3b914", more: ["1586023492125-27b2c045efd7", "1618220179428-22790b461013"], note: "Walk to the park and the farmers market. Solar, EV charger and a screened porch." },
  { id: "bluebonnet", addr: "4407 Bluebonnet Rise", hood: "Barton Hills", price: 1150000, beds: 4, baths: 3.5, sqft: 2910, tag: "", img: "1613977257363-707ba9348227", more: ["1598928506311-c55ded91a20c", "1616047006789-b7af5afb8c20"], note: "A pool deck under the live oaks, and the greenbelt trailhead at the end of the block." },
  { id: "ridgeview", addr: "1902 Ridgeview Cove", hood: "Tarrytown", price: 2240000, beds: 5, baths: 4.5, sqft: 3870, tag: "Price drop", img: "1757524492552-d47a66a2b63e", more: ["1772567732985-6fefa2dff56d", "1633505899118-4ca6bd143043"], note: "Floor-to-ceiling glass, a chef's kitchen and sunset views toward Lake Austin." },
  { id: "cedar", addr: "905 Cedar Elm St", hood: "East Austin", price: 685000, beds: 3, baths: 2, sqft: 1620, tag: "", img: "1627141234469-24711efb373c", more: ["1664711942326-2c3351e215e6", "1631679706909-1844bbd07221"], note: "Modern infill with a detached studio, close to coffee, tacos and the trail." },
  { id: "sotol", addr: "3120 Sotol Ridge Dr", hood: "Zilker", price: 1640000, beds: 4, baths: 3, sqft: 2780, tag: "New", img: "1513584684374-8bab748fbf90", more: ["1774199496664-a9690967be5a", "1618221195710-dd6b41faaea6"], note: "Bike to Barton Springs. A courtyard pool and a guest suite over the garage." },
];
window.HOODS = {
  "Travis Heights": { ppsf: 560, img: "1557335200-a65f7f032602" },
  "Mueller": { ppsf: 395, img: "1591204954412-a30e9ae525ee" },
  "Barton Hills": { ppsf: 430, img: "1520950237264-dfe336995c34" },
  "Tarrytown": { ppsf: 610, img: "1530089711124-9ca31fb9e863" },
  "East Austin": { ppsf: 440, img: "1588993608283-7f0eda4438be" },
  "Zilker": { ppsf: 600, img: "1666969565832-b55bf42a900d" },
};
window.money = (n) => "$" + Math.round(n).toLocaleString("en-US");
window.U = U;

/* ───── chrome ───── */
const LOGO = `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M5 34V17L20 6l15 11v17" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/><path d="M13 34V22h14v12" fill="none" stroke="#D9692F" stroke-width="2.4" stroke-linejoin="round"/></svg>`;
const PAGES = [["index.html", "Home"], ["listings.html", "Listings"], ["sell.html", "Sell"], ["about.html", "About"], ["contact.html", "Contact"]];
function chrome() {
  const here = location.pathname.split("/").pop() || "index.html";
  const dark = document.body.dataset.hdr === "dark";
  document.body.insertAdjacentHTML("afterbegin", `
  <div class="loader" aria-hidden="true"><svg viewBox="0 0 200 160"><path d="M20 150V70L100 14l80 56v80"/><path d="M62 150V98h76v52"/><path d="M8 150h184"/></svg><span class="spec">Marlow Home Co. · Austin, TX</span><span class="count">0</span></div>
  <div class="wipe" aria-hidden="true"></div>
  <header class="hdr${dark ? " on-dark" : ""}"><div class="wrap">
    <a class="brand" href="index.html">${LOGO}<span>Marlow<small>HOME CO. · AUSTIN</small></span></a>
    <nav class="nav" aria-label="Main">${PAGES.slice(1).map(([h, t]) => `<a href="${h}"${h === here ? ' aria-current="page"' : ""}>${t}</a>`).join("")}</nav>
    <a class="btn sm" href="sell.html">What's my home worth? <span class="arr">→</span></a>
    <button class="menu-btn" aria-label="Menu" aria-expanded="false"><i></i><i></i></button>
  </div></header>
  <nav class="mobile-menu" aria-label="Mobile">${PAGES.map(([h, t]) => `<a href="${h}"><span>${t}</span></a>`).join("")}<p class="spec">June Marlow · (512) 000-0000</p></nav>`);
  document.body.insertAdjacentHTML("beforeend", `
  <footer class="ftr"><div class="wrap">
    <p class="big" data-reveal="lines">Let's find your <em>place</em> in Austin.</p>
    <div class="cols">
      <div><p class="spec" style="opacity:.6">Marlow Home Co.</p><p style="margin-top:.6rem;max-width:22rem;opacity:.8">June Marlow, REALTOR®. Buying and selling homes across Central Austin.</p><p style="margin-top:1rem"><a href="mailto:hello@example.com">hello@example.com</a><a href="tel:+15120000000">(512) 000-0000</a></p></div>
      <div>${PAGES.map(([h, t]) => `<a href="${h}">${t}</a>`).join("")}</div>
      <div><a href="#">Instagram</a><a href="#">Facebook</a><a href="#">Zillow reviews</a></div>
    </div>
    <div class="legal"><span class="eho">⌂ Equal Housing Opportunity</span><span>Brokerage: [Brokerage name] · TREC #000000</span><a href="#">TREC Information About Brokerage Services</a><a href="#">TREC Consumer Protection Notice</a><span>Listings, prices and figures on this site are for demonstration only.</span></div>
  </div></footer>
  <div class="concept"><b>CONCEPT</b><span>Demo site by <a href="https://studiomeit.lovable.app/en" target="_blank" rel="noopener">Studio Mate</a><span class="long"> · fictional agent and listings</span></span></div>`);
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
  const came = sessionStorage.getItem("mh-wipe") === "1";
  sessionStorage.removeItem("mh-wipe");
  const done = () => { html.classList.add("loaded"); load.play(); window.dispatchEvent(new Event("site:ready")); };
  if (reduced) { loader.remove(); return done(); }
  if (came) {
    loader.remove();
    gsap.set(wipe, { yPercent: 0 });
    html.classList.remove("is-leaving");
    gsap.to(wipe, { yPercent: -100, duration: .9, ease: "out", delay: .05, onStart: done, onComplete: () => gsap.set(wipe, { yPercent: 100 }) });
  } else if (!sessionStorage.getItem("mh-seen")) {
    const count = $(".count", loader), o = { v: 0 };
    const paths = $$("path", loader);
    paths.forEach((p) => { const l = p.getTotalLength(); gsap.set(p, { strokeDasharray: l, strokeDashoffset: l }); });
    gsap.timeline()
      .to(paths, { strokeDashoffset: 0, duration: 1.3, stagger: .18, ease: "power2.inOut" }, 0)
      .to(o, { v: 100, duration: 1.6, ease: "power2.inOut", onUpdate: () => (count.textContent = Math.round(o.v)) }, 0)
      .to(loader, { clipPath: "inset(0 0 100% 0)", duration: .9, ease: "out" }, "+=.15")
      .add(done, "-=.5");
  } else { loader.remove(); done(); }
  sessionStorage.setItem("mh-seen", "1");

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.href.split("#")[0] === location.href.split("#")[0]) return;
    e.preventDefault();
    sessionStorage.setItem("mh-wipe", "1");
    lenis?.stop();
    gsap.fromTo(wipe, { yPercent: 100 }, { yPercent: 0, duration: .7, ease: "power3.inOut", onComplete: () => (location.href = url.href) });
  });
  addEventListener("pageshow", (e) => { if (e.persisted) { gsap.set(wipe, { yPercent: 100 }); lenis?.start(); } });
}

/* ───── listing card + sheet ───── */
window.cardHTML = (l) => `<article class="card" data-id="${l.id}" data-hood="${l.hood}" data-beds="${l.beds}" tabindex="0" role="button" aria-label="${l.addr}, ${money(l.price)}">
  <div class="ph"><img src="${U(l.img, 900)}" alt="${l.addr}" loading="lazy">${l.tag ? `<span class="tag${l.tag === "New" ? " hot" : ""}">${l.tag}</span>` : ""}</div>
  <div class="bd"><span class="price">${money(l.price)}</span><span class="addr">${l.addr}</span><span class="hood spec">${l.hood}</span><span class="facts"><span>${l.beds} bd</span><span>${l.baths} ba</span><span>${l.sqft.toLocaleString("en-US")} sq ft</span></span></div>
</article>`;
function sheet() {
  document.body.insertAdjacentHTML("beforeend", `<div class="sheet" role="dialog" aria-modal="true" aria-label="Listing details"><div class="bg"></div><div class="in" data-lenis-prevent><button class="x" aria-label="Close">×</button><div class="content"></div></div></div>`);
  const sh = $(".sheet"), inner = $(".in", sh), content = $(".content", sh);
  const open = (l) => {
    content.innerHTML = `<div class="gal"><img src="${U(l.img, 1200)}" alt="${l.addr}"><img src="${U(l.more[0], 700)}" alt=""><img src="${U(l.more[1], 700)}" alt=""></div>
      <div class="body"><span class="spec" style="color:var(--oak)">${l.hood} · Demo listing</span><h2 class="h-md">${l.addr}</h2><p class="price" style="font-family:var(--display);font-size:2.2rem">${money(l.price)}</p>
      <div class="kv"><div><b>${l.beds}</b><span class="spec">Beds</span></div><div><b>${l.baths}</b><span class="spec">Baths</span></div><div><b>${l.sqft.toLocaleString("en-US")}</b><span class="spec">Sq ft</span></div><div><b>${money(l.price / l.sqft)}</b><span class="spec">Per sq ft</span></div></div>
      <p class="lead" style="font-size:1.05rem">${l.note}</p>
      <form class="form" onsubmit="event.preventDefault();this.querySelector('.ok').hidden=false;this.querySelector('button').disabled=true">
        <h3 class="h-md" style="font-size:1.5rem">Schedule a showing</h3>
        <div class="row"><label>Name<input required autocomplete="name"></label><label>Phone<input type="tel" required autocomplete="tel"></label></div>
        <label>Preferred day<select><option>This weekend</option><option>Weekday evening</option><option>Video tour</option></select></label>
        <button class="btn" type="submit">Request a showing <span class="arr">→</span></button>
        <p class="ok" hidden>Thanks! In the real site this goes straight to June's phone. (Demo: nothing is sent.)</p>
      </form></div>`;
    gsap.set(sh, { display: "block" }); lenis?.stop();
    gsap.fromTo($(".bg", sh), { autoAlpha: 0 }, { autoAlpha: 1, duration: .4 });
    gsap.fromTo(inner, { xPercent: 100 }, { xPercent: 0, duration: .8, ease: "out" });
    gsap.from($$(".gal img, .body > *", content), { autoAlpha: 0, y: 30, duration: .7, stagger: .05, ease: "out", delay: .25 });
    inner.scrollTop = 0; $(".x", sh).focus();
  };
  const close = () => gsap.to(inner, { xPercent: 100, duration: .55, ease: "power3.in", onComplete: () => { gsap.set(sh, { display: "none" }); lenis?.start(); } });
  $(".bg", sh).addEventListener("click", close); $(".x", sh).addEventListener("click", close);
  addEventListener("keydown", (e) => e.key === "Escape" && sh.style.display === "block" && close());
  document.addEventListener("click", (e) => { const c = e.target.closest(".card[data-id]"); if (c) open(LISTINGS.find((l) => l.id === c.dataset.id)); });
  document.addEventListener("keydown", (e) => { const c = e.target.closest?.(".card[data-id]"); if (c && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); open(LISTINGS.find((l) => l.id === c.dataset.id)); } });
}

/* ───── boot ───── */
window.Site = { $, $$, reduced, reveals, get lenis() { return lenis; } };
document.addEventListener("DOMContentLoaded", async () => {
  chrome();
  window.dispatchEvent(new Event("site:build")); // pages render their dynamic markup here
  smooth(); header(); sheet();
  await document.fonts.ready;
  const load = reveals();
  ScrollTrigger.refresh();
  entrance(load);
});
