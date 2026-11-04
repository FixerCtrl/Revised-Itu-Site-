// Responsive site navigation
const menuButton = document.querySelector('.menu-btn');
const mainNavigation = document.querySelector('#main-navigation');
if (menuButton && mainNavigation) {
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    menuButton.setAttribute('aria-label', expanded ? 'Open menu' : 'Close menu');
    menuButton.textContent = expanded ? 'Menu' : 'Close';
    mainNavigation.classList.toggle('open', !expanded);
  });

  mainNavigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
    menuButton.textContent = 'Menu';
    mainNavigation.classList.remove('open');
  }));

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mainNavigation.classList.contains('open')) {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open menu');
      menuButton.textContent = 'Menu';
      mainNavigation.classList.remove('open');
      menuButton.focus();
    }
  });
}

// Career timeline filter
const filterButtons = [...document.querySelectorAll('.filters [data-filter]')];
const careerItems = [...document.querySelectorAll('.tl[data-track]')];
filterButtons.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filterButtons.forEach(option => {
    const selected = option === button;
    option.classList.toggle('on', selected);
    option.setAttribute('aria-pressed', String(selected));
  });
  careerItems.forEach(item => {
    item.hidden = filter !== 'all' && item.dataset.track !== filter;
  });
}));

// Prepare a consultation email without storing form data on this static site.
const consultationForm = document.querySelector('#book-form');
if (consultationForm) {
  consultationForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(consultationForm).entries());
    const subject = `Consultation request: ${data.topic || 'Advisory'}`;
    const body = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Organisation: ${data.company || '-'}`,
      `Topic: ${data.topic}`,
      `Preferred date: ${data.date || '-'}`,
      `Preferred time (SAST): ${data.time || '-'}`,
      '',
      'Project brief:',
      data.brief || ''
    ].join('\n');
    window.location.href = `mailto:kgongwane@icloud.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

// Featured homepage carousel
const featuredCarousel = document.querySelector('.featured-carousel');
if (featuredCarousel) {
  const slides = [...featuredCarousel.querySelectorAll('.carousel-slide')];
  const dots = [...featuredCarousel.querySelectorAll('[data-carousel-dot]')];
  const toggleButton = featuredCarousel.querySelector('[data-carousel-toggle]');
  const status = featuredCarousel.querySelector('[data-carousel-status]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeIndex = slides.findIndex(slide => !slide.hidden);
  let pointerStartX = null;
  let userPaused = reducedMotion.matches;
  let pointerInside = false;
  let focusInside = false;
  let rotationTimer;

  const stopRotation = () => {
    window.clearTimeout(rotationTimer);
  };
  const startRotation = () => {
    stopRotation();
    if (userPaused || pointerInside || focusInside || document.hidden || reducedMotion.matches) return;
    rotationTimer = window.setTimeout(() => {
      showSlide(activeIndex + 1, false);
      startRotation();
    }, 6500);
  };

  const showSlide = (index, announce = true) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === activeIndex;
      slide.hidden = !active;
      slide.setAttribute('aria-label', `${slideIndex + 1} of ${slides.length}`);
      dots[slideIndex].setAttribute('aria-current', String(active));
    });
    if (status && announce) status.textContent = `Slide ${activeIndex + 1} of ${slides.length}`;
    startRotation();
  };

  const syncToggle = () => {
    if (!toggleButton) return;
    toggleButton.setAttribute('aria-pressed', String(userPaused));
    toggleButton.setAttribute('aria-label', userPaused ? 'Play slideshow' : 'Pause slideshow');
    toggleButton.textContent = userPaused ? '▶' : 'Ⅱ';
  };

  syncToggle();
  featuredCarousel.querySelector('[data-carousel-prev]')?.addEventListener('click', () => showSlide(activeIndex - 1));
  featuredCarousel.querySelector('[data-carousel-next]')?.addEventListener('click', () => showSlide(activeIndex + 1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => showSlide(index)));
  toggleButton?.addEventListener('click', () => {
    userPaused = !userPaused;
    syncToggle();
    startRotation();
  });

  featuredCarousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showSlide(activeIndex - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      showSlide(activeIndex + 1);
    }
  });

  featuredCarousel.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch') pointerStartX = event.clientX;
  });
  featuredCarousel.addEventListener('pointerenter', () => {
    pointerInside = true;
    stopRotation();
  });
  featuredCarousel.addEventListener('pointerleave', () => {
    pointerInside = false;
    startRotation();
  });
  featuredCarousel.addEventListener('focusin', () => {
    focusInside = true;
    stopRotation();
  });
  featuredCarousel.addEventListener('focusout', event => {
    if (!featuredCarousel.contains(event.relatedTarget)) {
      focusInside = false;
      startRotation();
    }
  });
  featuredCarousel.addEventListener('pointerup', event => {
    if (pointerStartX === null) return;
    const distance = event.clientX - pointerStartX;
    pointerStartX = null;
    if (Math.abs(distance) >= 50) showSlide(activeIndex + (distance < 0 ? 1 : -1));
  });
  featuredCarousel.addEventListener('pointercancel', () => {
    pointerStartX = null;
  });
  document.addEventListener('visibilitychange', startRotation);
  reducedMotion.addEventListener('change', event => {
    if (event.matches) {
      userPaused = true;
      syncToggle();
    }
    startRotation();
  });
  startRotation();
}
