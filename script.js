// Mobile menu
const btn = document.querySelector('.menu-btn');
const links = document.querySelector('nav.links');
if (btn && links) {
  btn.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
}

// Timeline filter (home page)
const chips = document.querySelectorAll('.filters .chip[data-filter]');
const items = document.querySelectorAll('.tl[data-track]');
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('on'));
    chip.classList.add('on');
    const f = chip.dataset.filter;
    items.forEach(it => it.classList.toggle('hide', f !== 'all' && it.dataset.track !== f));
  });
});

// Market analysis category filter (ready for posts)
const cats = document.querySelectorAll('.filters .chip[data-cat]');
const posts = document.querySelectorAll('.post[data-cat]');
cats.forEach(chip => {
  chip.addEventListener('click', () => {
    cats.forEach(c => c.classList.remove('on'));
    chip.classList.add('on');
    const f = chip.dataset.cat;
    posts.forEach(p => { p.style.display = (f === 'all' || p.dataset.cat === f) ? '' : 'none'; });
  });
});

// Consultation form: opens the visitor's email app with the details filled in
const form = document.getElementById('book-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form).entries());
    const subject = `Consultation request: ${d.topic || 'Advisory'}`;
    const body = [
      `Name: ${d.name}`,
      `Email: ${d.email}`,
      `Company: ${d.company || '-'}`,
      `Topic: ${d.topic}`,
      `Preferred date: ${d.date || '-'}`,
      `Preferred time (SAST): ${d.time || '-'}`,
      '',
      'Project brief:',
      d.brief || ''
    ].join('\n');
    window.location.href = `mailto:kgongwane@icloud.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

// Highlight the menu item for the section currently in view
const spyLinks = [...document.querySelectorAll('nav.links a[href^="#"]')];
const spyTargets = spyLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
function spy() {
  const y = window.scrollY + 160;
  let cur = spyTargets[0];
  spyTargets.forEach(t => { if (t.offsetTop <= y) cur = t; });
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) cur = spyTargets[spyTargets.length - 1];
  spyLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur.id));
}
window.addEventListener('scroll', spy, { passive: true });
spy();
