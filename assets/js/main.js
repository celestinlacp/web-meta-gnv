/* =========================================================
   META GAS NATURAL VEHICULAR — Main JavaScript
   ========================================================= */

/* ---- Navbar Scroll Behavior ---- */
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scroll-top-btn');

window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    navbar.classList.add('scrolled');
    scrollTopBtn.classList.add('visible');
  } else {
    navbar.classList.remove('scrolled');
    scrollTopBtn.classList.remove('visible');
  }
  updateActiveNavLink();
});

/* ---- Mobile Navigation ---- */
const hamburger = document.getElementById('nav-hamburger');
const navMenu = document.getElementById('nav-menu');
const navOverlay = document.getElementById('nav-overlay');

function openMenu() {
  navMenu.classList.add('open');
  navOverlay.classList.add('visible');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  navMenu.classList.remove('open');
  navOverlay.classList.remove('visible');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  if (navMenu.classList.contains('open')) closeMenu();
  else openMenu();
});
navOverlay.addEventListener('click', closeMenu);

// Close menu when a link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

/* ---- Active Nav Link ---- */
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 100;
  sections.forEach(section => {
    const id = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!navLink) return;
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (scrollPos >= top && scrollPos < bottom) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      navLink.classList.add('active');
    }
  });
}

/* ---- Scroll To Top ---- */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---- Intersection Observer: Animate on scroll ---- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Animate stat bars
      if (entry.target.classList.contains('beneficios-grid')) {
        setTimeout(() => {
          entry.target.querySelectorAll('.beneficio-bar-fill').forEach(bar => {
            bar.style.width = bar.style.getPropertyValue('--fill') || getComputedStyle(bar).getPropertyValue('--fill');
          });
        }, 200);
      }
    }
  });
}, { threshold: 0.15 });

// Add animate-in to cards and sections
document.querySelectorAll('.beneficio-card, .pago-card, .est-card, .promo-card, .test-card, .faq-item, .stat-item, .nosotros-big-logo, .contacto-form').forEach(el => {
  el.classList.add('animate-in');
  observer.observe(el);
});

/* ---- Animate stat bars on section view ---- */
const beneficiosSection = document.querySelector('.beneficios');
const barsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.beneficio-bar-fill').forEach(bar => {
        const fill = getComputedStyle(bar).getPropertyValue('--fill').trim() || bar.style.cssText.match(/--fill:\s*([^;]+)/)?.[1]?.trim() || '0%';
        bar.style.width = fill;
      });
      barsObserver.disconnect();
    }
  });
}, { threshold: 0.2 });
if (beneficiosSection) barsObserver.observe(beneficiosSection);

/* ---- Counter Animation ---- */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString('es-MX');
    if (el.closest('#stat-clients') && Math.floor(current) >= target) {
      el.textContent = target.toLocaleString('es-MX') + '+';
    }
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num[data-target]').forEach(animateCounter);
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });
const nosotrosSection = document.querySelector('.nosotros');
if (nosotrosSection) statsObserver.observe(nosotrosSection);

/* ---- Savings Hero Counter Animation ---- */
function animateSavings() {
  const el = document.getElementById('hero-savings-count');
  if (!el) return;
  let start = 0;
  const target = 50;
  const timer = setInterval(() => {
    start += 2;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = start + '%';
  }, 40);
}
window.addEventListener('load', () => setTimeout(animateSavings, 600));

/* ---- Estaciones Slider ---- */
const slider = document.getElementById('estaciones-slider');
const prevBtn = document.getElementById('slider-prev');
const nextBtn = document.getElementById('slider-next');
const dotsContainer = document.getElementById('slider-dots');

let currentSlide = 0;
const cards = slider ? Array.from(slider.children) : [];
const totalSlides = cards.length;
let slidesPerView = getSlidesPerView();

function getSlidesPerView() {
  if (window.innerWidth <= 700) return 1;
  if (window.innerWidth <= 900) return 2;
  return 4;
}

function buildDots() {
  if (!dotsContainer) return;
  dotsContainer.innerHTML = '';
  const totalGroups = Math.ceil(totalSlides / slidesPerView);
  for (let i = 0; i < totalGroups; i++) {
    const dot = document.createElement('div');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
}

function updateDots() {
  document.querySelectorAll('.slider-dot').forEach((d, i) => {
    d.classList.toggle('active', i === Math.floor(currentSlide / slidesPerView));
  });
}

function goToSlide(index) {
  currentSlide = index * slidesPerView;
  if (currentSlide >= totalSlides) currentSlide = 0;
  updateSlider();
}

function updateSlider() {
  if (!slider) return;
  slidesPerView = getSlidesPerView();
  const colWidth = 100 / slidesPerView;
  slider.style.transition = 'none';
  slider.style.display = 'grid';
  slider.style.gridTemplateColumns = `repeat(${totalSlides}, ${colWidth}%)`;
  slider.style.transform = `translateX(-${currentSlide * colWidth}%)`;
  setTimeout(() => slider.style.transition = 'transform 0.4s ease', 10);
  updateDots();
}

if (prevBtn) prevBtn.addEventListener('click', () => {
  currentSlide = Math.max(0, currentSlide - slidesPerView);
  updateSlider();
});
if (nextBtn) nextBtn.addEventListener('click', () => {
  currentSlide += slidesPerView;
  if (currentSlide >= totalSlides) currentSlide = 0;
  updateSlider();
});

window.addEventListener('resize', () => {
  slidesPerView = getSlidesPerView();
  currentSlide = 0;
  buildDots();
  updateSlider();
});

// Initialize slider
if (slider && totalSlides > 0) {
  buildDots();
  // Re-layout for slider mode on desktop
  if (window.innerWidth > 900) {
    slider.style.display = 'flex';
    slider.style.gridTemplateColumns = 'unset';
    cards.forEach(c => { c.style.minWidth = '25%'; c.style.flex = '0 0 25%'; });
  }
}

/* ---- FAQ Toggle ---- */
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const answer = item.querySelector('.faq-answer');
  const isOpen = btn.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-question.open').forEach(q => {
    q.classList.remove('open');
    q.closest('.faq-item').querySelector('.faq-answer').classList.remove('open');
  });

  // Open if was closed
  if (!isOpen) {
    btn.classList.add('open');
    answer.classList.add('open');
  }
}

/* ---- Savings Calculator ---- */
function calcularAhorro() {
  const gasto = parseFloat(document.getElementById('gasto-mensual').value) || 0;
  const precioGasolina = parseFloat(document.getElementById('precio-gasolina').value) || 25;
  const vehiculo = document.querySelector('input[name="vehiculo"]:checked')?.value || 'auto';

  if (gasto <= 0) {
    alert('Por favor ingresa tu gasto mensual en gasolina.');
    return;
  }

  // GNV es aprox 40-55% del precio de gasolina
  let ahorroPct;
  if (vehiculo === 'taxi') ahorroPct = 0.50; // taxis hacen más km
  else if (vehiculo === 'camioneta') ahorroPct = 0.42;
  else ahorroPct = 0.45;

  const ahorro = Math.round(gasto * ahorroPct);
  const resultEl = document.getElementById('result-value');
  if (!resultEl) return;

  // Animate the result
  let count = 0;
  const timer = setInterval(() => {
    count += Math.ceil(ahorro / 30);
    if (count >= ahorro) { count = ahorro; clearInterval(timer); }
    resultEl.textContent = '$' + count.toLocaleString('es-MX');
  }, 30);

  // Scroll to result
  document.getElementById('calc-result-big').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ---- Contact Form ---- */
function submitForm(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-submit');
  btn.textContent = 'Enviando...';
  btn.disabled = true;

  // Simulate submission
  setTimeout(() => {
    document.getElementById('contacto-form').style.display = 'none';
    const success = document.getElementById('form-success');
    success.style.display = 'flex';
    success.style.flexDirection = 'column';
    success.style.alignItems = 'center';
    success.style.gap = '8px';
    // Reset after 5s
    setTimeout(() => {
      document.getElementById('contacto-form').style.display = 'block';
      success.style.display = 'none';
      btn.textContent = 'ENVIAR SOLICITUD';
      btn.disabled = false;
      e.target.reset();
    }, 5000);
  }, 1500);
}

/* ---- Terms Tabs ---- */
function switchTermTab(contentId, btn) {
  document.querySelectorAll('.terminos-body').forEach(b => b.style.display = 'none');
  document.querySelectorAll('.term-tab').forEach(t => t.classList.remove('active'));
  const target = document.getElementById(contentId);
  if (target) target.style.display = 'block';
  if (btn) btn.classList.add('active');
}

/* ---- Smooth scroll for all anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = navbar.offsetHeight + 16;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

/* ---- Stagger animation for grid items ---- */
document.querySelectorAll('.beneficios-grid, .pagos-grid, .promos-grid, .test-grid').forEach(grid => {
  Array.from(grid.children).forEach((child, i) => {
    child.style.transitionDelay = `${i * 80}ms`;
  });
});

/* ---- Initialize on load ---- */
document.addEventListener('DOMContentLoaded', () => {
  updateActiveNavLink();
  // Show first FAQ open by default
  // toggleFaq(document.querySelector('.faq-question'));
});
