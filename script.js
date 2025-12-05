/* =========================
   Interactivity & UX scripts
   - Smooth scrolling for anchor links
   - Reveal on scroll (simple animation)
   - CTA wiring
   ========================= */

document.addEventListener('DOMContentLoaded', () => {
  enableSmoothScroll();
  setupCTAs();
  revealOnScroll();
});

/* Smooth scroll for in-page anchors */
function enableSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // update URL without jumping
        history.pushState(null, '', href);
      }
    });
  });
}

/* Wire hero CTA buttons to scroll to sections */
function setupCTAs() {
  const btnQuote = document.querySelector('.btn-primary');
  const btnServices = document.querySelector('.btn-secondary');

  if (btnQuote) {
    btnQuote.addEventListener('click', (e) => {
      e.preventDefault();
      const el = document.getElementById('contact') || document.querySelector('#contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (btnServices) {
    btnServices.addEventListener('click', (e) => {
      e.preventDefault();
      const el = document.getElementById('services');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

/* Simple reveal-on-scroll using IntersectionObserver */
function revealOnScroll() {
  const items = document.querySelectorAll('.section, .service-card, .exp-card, .skill-card, .column, .hero');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.08
  });

  items.forEach(item => {
    item.style.opacity = 0;
    item.style.transform = 'translateY(14px)';
    item.style.transition = 'opacity 700ms ease, transform 700ms ease';
    observer.observe(item);
  });
}
