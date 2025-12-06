// ...existing code...
/* Improved Interactivity & Accessibility
   - Delegated smooth scrolling that respects reduced-motion
   - Reveal-on-scroll using CSS classes (no inline styles)
   - CTA wiring scoped to hero buttons
   - Keyboard accessibility for interactive cards
   - Lightweight analytics hook + error handling
*/

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', () => {
    try {
      enableSmoothScroll();
      setupCTAs();
      revealOnScroll();
      setupKeyboardAccessibility();
    } catch (err) {
      console.error('Initialization error:', err);
    }
  });

  /* Delegated smooth scroll for in-page anchors (respects reduced motion) */
  function enableSmoothScroll() {
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const behavior = prefersReducedMotion ? 'auto' : 'smooth';
      target.scrollIntoView({ behavior, block: 'start' });

      // Update URL without jumping
      try { history.pushState(null, '', href); } catch (err) { /* ignore */ }

      // Move focus for accessibility
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      trackEvent('navigate', { to: href });
    });
  }

  /* Wire hero CTA buttons only (prevents intercepting form submit buttons) */
  function setupCTAs() {
    const heroPrimary = document.querySelector('.hero-buttons .btn-primary');
    const heroSecondary = document.querySelector('.hero-buttons .btn-secondary');

    if (heroPrimary) {
      heroPrimary.addEventListener('click', (e) => {
        // If the primary is an anchor handled by enableSmoothScroll, do nothing extra.
        if (heroPrimary.tagName.toLowerCase() === 'a') return;
        e.preventDefault();
        scrollToId('#contact');
        trackEvent('CTA_Click', { label: 'Get a Quote' });
      });
    }

    if (heroSecondary) {
      heroSecondary.addEventListener('click', (e) => {
        if (heroSecondary.tagName.toLowerCase() === 'a') return;
        e.preventDefault();
        scrollToId('#services');
        trackEvent('CTA_Click', { label: 'View Services' });
      });
    }
  }

  function scrollToId(selector) {
    const el = document.querySelector(selector);
    if (!el) return;
    const behavior = prefersReducedMotion ? 'auto' : 'smooth';
    el.scrollIntoView({ behavior, block: 'start' });
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }

  /* Reveal-on-scroll using IntersectionObserver — toggles .revealed (CSS handles transitions) */
  function revealOnScroll() {
    const items = Array.from(document.querySelectorAll('.section, .service-card, .exp-card, .skill-card, .column, .hero'));

    if (items.length === 0) return;

    if (prefersReducedMotion) {
      // Immediately reveal all for reduced-motion preference
      items.forEach(i => i.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver(handleIntersections, {
      root: null,
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.08
    });

    items.forEach(item => {
      observer.observe(item);
    });

    function handleIntersections(entries, obs) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }
  }

  /* Keyboard accessibility: allow Enter/Space to activate card links */
  function setupKeyboardAccessibility() {
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const card = e.target.closest('.service-card, .exp-card, .skill-card');
      if (!card) return;

      // If there's a link inside the card, trigger it
      const link = card.querySelector('a');
      if (link) {
        e.preventDefault();
        link.click();
        trackEvent('card_activate', { text: link.textContent?.trim?.() || 'card' });
      }
    });
  }

  /* Lightweight analytics event hook */
  function trackEvent(name, data = {}) {
    try {
      if (window.gtag) {
        window.gtag('event', name, data);
      }
    } catch (err) {
      // fail silently
    }
    // For local debugging
    if (window.location.hostname === 'localhost' || window.location.hostname === '') {
      // eslint-disable-next-line no-console
      console.debug('trackEvent', name, data);
    }
  }

  // Expose small helper for console-driven dev/testing
  window.NDAISI = window.NDAISI || {};
  window.NDAISI.scrollToId = scrollToId;
  window.NDAISI.trackEvent = trackEvent;

})();
// ...existing code...