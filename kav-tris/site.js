'use strict';
const menu = document.querySelector('.menu');
const nav = document.querySelector('#mainnav');
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    closeMenu();
    menu.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('header')) closeMenu();
});

const dialog = document.querySelector('#channel-dialog');
document.querySelectorAll('[data-channel]').forEach(button => {
  button.addEventListener('click', () => {
    const whatsApp = button.dataset.channel === 'wa';
    document.querySelector('#dialog-title').textContent = whatsApp ? 'פנייה בוואטסאפ' : 'שיחת טלפון למשרד';
    document.querySelector('#dialog-text').textContent = whatsApp
      ? 'באתר של משרד פעיל הכפתור יפתח שיחת וואטסאפ עם המשרד. כאן אפשר להתנסות בפנייה באמצעות הטופס.'
      : 'באתר של משרד פעיל הכפתור יפתח את החייגן. כאן אפשר להתנסות בבקשה לשיחה באמצעות הטופס.';
    const visit = document.querySelector('#visit');
    const localForm = visit || document.querySelector('#valuation') || document.querySelector('#contact-form');
    const target = document.querySelector('#dialog-link');
    target.href = localForm ? '#' + localForm.id : (document.body.dataset.offlineContact || '/contact/#contact-form');
    target.textContent = visit ? 'לטופס תיאום ביקור' : 'לטופס הדגמה';
    dialog.showModal();
  });
});
dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.querySelector('#dialog-link').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});

const filterForm = document.querySelector('#filters');
if (filterForm) {
  const controls = [...filterForm.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.pcard')];
  function filter() {
    let total = 0;
    cards.forEach(card => {
      const match = controls.every(control => {
        const key = control.dataset.filter;
        const value = control.value.trim();
        if (!value) return true;
        return key === 'price' ? Number(card.dataset.price) <= Number(value) : card.dataset[key] === value;
      });
      card.hidden = !match;
      if (match) total++;
    });
    document.querySelector('#count').textContent = total === 1 ? 'מוצג נכס אחד לדוגמה' : 'מוצגים ' + total + ' נכסים לדוגמה';
    document.querySelector('#empty').hidden = total > 0;
  }
  filterForm.addEventListener('input', filter);
  filterForm.addEventListener('submit', event => { event.preventDefault(); filter(); });
  filterForm.addEventListener('reset', () => requestAnimationFrame(filter));
  filter();
}

const photos = [...document.querySelectorAll('[data-photo]')];
photos.forEach(button => button.addEventListener('click', () => {
  const photo = document.querySelector('.gallery-main img');
  photo.src = button.dataset.photo;
  photo.alt = button.dataset.alt;
  photos.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
}));

const confirmations = {
  owner: 'הבקשה לפגישת הערכת שווי הושלמה בדמו.',
  visit: 'הבקשה לתיאום ביקור בדירה הושלמה בדמו.',
  search: 'בקשת החיפוש הושלמה בדמו.',
  contact: 'הפנייה הושלמה בדמו.'
};
document.querySelectorAll('form[data-demo]').forEach(form => {
  const tel = form.querySelector('[type=tel]');
  const date = form.querySelector('[type=date]');
  if (date) {
    const now = new Date();
    date.min = [now.getFullYear(), String(now.getMonth()+1).padStart(2,'0'), String(now.getDate()).padStart(2,'0')].join('-');
  }
  function validatePhone() {
    const digits = tel.value.replace(/[^0-9]/g, '');
    tel.setCustomValidity(tel.value && (digits.length < 8 || digits.length > 15 || /[^0-9() +\-]/.test(tel.value)) ? 'יש להזין מספר טלפון תקין כולל קידומת.' : '');
  }
  tel.addEventListener('input', validatePhone);
  form.addEventListener('input', () => { form.querySelector('.result').textContent = ''; });
  form.addEventListener('submit', event => {
    event.preventDefault();
    validatePhone();
    if (!form.reportValidity()) return;
    const status = form.querySelector('.result');
    const when = date && date.value ? ' המועד שנבחר להמחשה הוא ' + new Intl.DateTimeFormat('he-IL').format(new Date(date.value + 'T12:00:00')) + '.' : '';
    form.reset();
    status.textContent = confirmations[form.dataset.demo] + when + ' הפרטים נמחקו מהטופס. זו הדגמה מקומית בלבד.';
    status.focus();
  });
});

// Live valuation estimator: example price per m² by neighbourhood, adjusted for floor, lift, parking, safe room and balcony.
const est = document.querySelector('.est-form');
if (est) {
  const model = JSON.parse(est.dataset.model);
  const num = document.querySelector('.est-num');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const m = n => (n / 1e6).toFixed(2).replace(/0$/, '').replace(/\.0$/, '');
  const read = () => ({
    hood: est.querySelector('[name=hood]:checked').value,
    size: Number(est.size.value),
    floor: Number(est.floor.value),
    elevator: est.elevator.checked, parking: est.parking.checked, mamad: est.mamad.checked, balcony: est.balcony.checked
  });
  const calc = () => {
    const d = read();
    let price = model[d.hood] * 1000 * d.size, f = 1;
    if (d.elevator) { f += 0.04; if (d.floor === 0) f -= 0.04; else if (d.floor >= 5) f += 0.04; else if (d.floor >= 3) f += 0.02; }
    else { if (d.floor === 0) f -= 0.06; else if (d.floor === 3) f -= 0.04; else if (d.floor === 4) f -= 0.08; else if (d.floor >= 5) f -= 0.12; }
    if (d.mamad) f += 0.03;
    if (d.balcony) f += 0.03;
    price *= f;
    if (d.parking) price += (d.hood === 'old-north' || d.hood === 'city-heart') ? 350000 : 200000;
    const text = m(Math.round(price * 0.95 / 50000) * 50000) + '–' + m(Math.round(price * 1.05 / 50000) * 50000);
    est.sizeOut.value = d.size;
    if (num.textContent !== text) {
      if (reduceMotion) num.textContent = text;
      else { num.classList.add('bump'); setTimeout(() => { num.textContent = text; num.classList.remove('bump'); }, 120); }
    }
    try { sessionStorage.setItem('kt-est', JSON.stringify(d)); } catch (e) {}
  };
  est.addEventListener('input', calc);
  est.addEventListener('submit', event => event.preventDefault());
  calc();
  const cta = document.querySelector('[data-est-cta]');
  if (cta) cta.addEventListener('click', () => {
    try { sessionStorage.setItem('kt-prefill', '1'); } catch (e) {}
    if (cta.getAttribute('href').startsWith('#')) prefillOwner();
  });
}
function prefillOwner() {
  const form = document.querySelector('form[data-demo="owner"]');
  if (!form) return;
  let d = null;
  try { d = JSON.parse(sessionStorage.getItem('kt-est') || 'null'); } catch (e) {}
  if (!d) return;
  form.size.value = d.size;
  form.floor.value = d.floor;
  ['elevator', 'parking', 'mamad', 'balcony'].forEach(k => { form[k].checked = !!d[k]; });
}
try { if (sessionStorage.getItem('kt-prefill') === '1') prefillOwner(); } catch (e) {}
