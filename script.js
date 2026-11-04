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

// Main-page discovery carousel
const heroTabs = [...document.querySelectorAll('[data-hero-tab]')];
const heroSlides = [...document.querySelectorAll('[data-hero-slide]')];
function showHeroSlide(index, moveFocus = false) {
  heroSlides.forEach((slide, slideIndex) => { slide.hidden = slideIndex !== index; });
  heroTabs.forEach((tab, tabIndex) => {
    const selected = tabIndex === index;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  if (moveFocus) heroTabs[index].focus();
}
heroTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => showHeroSlide(index));
  tab.addEventListener('keydown', event => {
    const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    const target = event.key === 'Home' ? 0 : event.key === 'End' ? heroTabs.length - 1 : (index + direction + heroTabs.length) % heroTabs.length;
    if (direction || event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      showHeroSlide(target, true);
    }
  });
});

// Shared accessible content carousels
document.querySelectorAll('[data-carousel]').forEach(carousel => {
  const slides = [...carousel.querySelectorAll('[data-carousel-slide]')];
  const pagination = carousel.querySelector('[data-carousel-pagination]');
  const status = carousel.querySelector('[data-carousel-status]');
  const previous = carousel.querySelector('[data-carousel-prev]');
  const next = carousel.querySelector('[data-carousel-next]');
  const toggle = carousel.querySelector('[data-carousel-toggle]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!slides.length || !pagination || !status || !previous || !next || !toggle) return;
  carousel.tabIndex = 0;

  let activeIndex = 0;
  let timer;
  let pointerStart;
  let isPlaying = !reducedMotion.matches;
  const dots = slides.map((slide, index) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', `Show slide ${index + 1} of ${slides.length}`);
    dot.addEventListener('click', () => showSlide(index));
    pagination.append(dot);
    return dot;
  });

  function updateCarousel() {
    slides.forEach((slide, index) => {
      slide.hidden = index !== activeIndex;
      slide.setAttribute('aria-label', `Slide ${index + 1} of ${slides.length}`);
    });
    dots.forEach((dot, index) => dot.setAttribute('aria-current', String(index === activeIndex)));
    status.textContent = `Slide ${activeIndex + 1} of ${slides.length}`;
  }

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;
    updateCarousel();
    resetTimer();
  }

  function stopTimer() {
    window.clearInterval(timer);
    timer = undefined;
  }

  function startTimer() {
    stopTimer();
    if (!isPlaying || reducedMotion.matches || slides.length < 2) return;
    timer = window.setInterval(() => {
      activeIndex = (activeIndex + 1) % slides.length;
      updateCarousel();
    }, 6000);
  }

  function resetTimer() {
    startTimer();
  }

  function setPlaying(playing) {
    if (reducedMotion.matches && playing) {
      toggle.disabled = true;
      toggle.textContent = 'Play';
      toggle.setAttribute('aria-label', 'Autoplay unavailable while reduced motion is enabled');
      toggle.setAttribute('aria-pressed', 'false');
      isPlaying = false;
      stopTimer();
      return;
    }
    isPlaying = playing;
    toggle.disabled = reducedMotion.matches;
    toggle.textContent = playing ? 'Pause' : 'Play';
    toggle.setAttribute('aria-label', reducedMotion.matches ? 'Autoplay unavailable while reduced motion is enabled' : `${playing ? 'Pause' : 'Play'} carousel`);
    toggle.setAttribute('aria-pressed', String(playing));
    startTimer();
  }

  previous.addEventListener('click', () => showSlide(activeIndex - 1));
  next.addEventListener('click', () => showSlide(activeIndex + 1));
  toggle.addEventListener('click', () => setPlaying(!isPlaying));
  carousel.addEventListener('mouseenter', () => setPlaying(false));
  carousel.addEventListener('focusin', () => setPlaying(false));
  carousel.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch') {
      setPlaying(false);
      pointerStart = { x: event.clientX, y: event.clientY };
    }
  }, { passive: true });
  carousel.addEventListener('pointerup', event => {
    if (!pointerStart || event.pointerType !== 'touch') return;
    const deltaX = event.clientX - pointerStart.x;
    const deltaY = event.clientY - pointerStart.y;
    pointerStart = undefined;
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      showSlide(activeIndex + (deltaX < 0 ? 1 : -1));
    }
  }, { passive: true });
  carousel.addEventListener('pointercancel', () => { pointerStart = undefined; }, { passive: true });
  carousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      showSlide(activeIndex + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  reducedMotion.addEventListener('change', () => {
    setPlaying(false);
  });

  updateCarousel();
  setPlaying(isPlaying);
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

// Case-study carousel
const caseViewport = document.querySelector('#case-viewport');
if (caseViewport) {
  const caseCards = [...caseViewport.querySelectorAll('.case')];
  const pagination = document.querySelector('.case-pagination');
  const count = document.querySelector('#case-count');
  const previous = document.querySelector('[data-case-prev]');
  const next = document.querySelector('[data-case-next]');
  let activeCase = 0;
  let scrollFrame;

  const dots = caseCards.map((card, index) => {
    const dot = document.createElement('button');
    dot.className = 'case-dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', `Show case study ${index + 1}: ${card.querySelector('h3').textContent}`);
    dot.addEventListener('click', () => showCase(index));
    pagination.append(dot);
    return dot;
  });

  function updateCase(index) {
    activeCase = Math.max(0, Math.min(index, caseCards.length - 1));
    dots.forEach((dot, dotIndex) => dot.setAttribute('aria-current', String(dotIndex === activeCase)));
    count.textContent = `${activeCase + 1} of ${caseCards.length}`;
    previous.disabled = activeCase === 0;
    next.disabled = activeCase === caseCards.length - 1;
  }

  function showCase(index) {
    const card = caseCards[index];
    if (!card) return;
    caseViewport.scrollTo({ left: card.offsetLeft - caseCards[0].offsetLeft, behavior: 'smooth' });
    updateCase(index);
  }

  previous.addEventListener('click', () => showCase(activeCase - 1));
  next.addEventListener('click', () => showCase(activeCase + 1));
  caseViewport.addEventListener('scroll', () => {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(() => {
      const left = caseViewport.getBoundingClientRect().left;
      const closestIndex = caseCards.reduce((closest, card, index) =>
        Math.abs(card.getBoundingClientRect().left - left) < Math.abs(caseCards[closest].getBoundingClientRect().left - left) ? index : closest, 0);
      updateCase(closestIndex);
    });
  }, { passive: true });
  updateCase(0);
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
