/* ============================================================
   GirlFestival — Main JavaScript
   Mobile Navigation • Scroll Effects • Counter Animation
   Intersection Observer Reveals • Smooth UX
   ============================================================ */

(function () {
  'use strict';

  // ===== MOBILE NAVIGATION =====
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileOverlay = document.getElementById('mobile-nav-overlay');
  const mobileLinks = mobileOverlay ? mobileOverlay.querySelectorAll('a') : [];

  function openMobileMenu() {
    menuToggle.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuToggle && mobileOverlay) {
    menuToggle.addEventListener('click', function () {
      if (mobileOverlay.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileOverlay.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }

  // ===== HEADER SCROLL EFFECT =====
  const header = document.getElementById('site-header');
  let lastScrollY = 0;
  let ticking = false;

  function updateHeader() {
    var scrollY = window.scrollY;

    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  if (header) {
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  }

  // ===== COUNTER ANIMATION =====
  function animateCounters() {
    var counters = document.querySelectorAll('[data-count]');
    counters.forEach(function (counter) {
      if (counter.dataset.animated) return;
      var target = parseInt(counter.dataset.count, 10);
      var duration = 2000;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        // Ease out cubic
        var eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(eased * target);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          counter.textContent = target;
        }
      }

      counter.dataset.animated = 'true';
      window.requestAnimationFrame(step);
    });
  }

  // ===== INTERSECTION OBSERVER: SCROLL REVEAL =====
  var revealElements = [];

  function initScrollReveal() {
    // Add reveal class to sections
    var sections = document.querySelectorAll(
      '.intro-section, .themes-section, .regions-section, .safety-section, ' +
      '.lifestages-section, .filters-section, .featured-section, .faq-section, ' +
      '.travel-section, .newsletter-section, .submit-section'
    );

    sections.forEach(function (section) {
      var children = section.querySelectorAll(
        '.section-eyebrow, .section-title, .section-title-light, .section-desc, ' +
        '.theme-card, .region-card, .safety-feature, .lifestage-card, ' +
        '.filter-tag, .featured-card, .faq-item, .travel-feature, ' +
        '.intro-text, .intro-image-grid, .safety-image-col, .safety-text-col, ' +
        '.newsletter-content, .newsletter-image, .submit-container, ' +
        '.filters-cta, .featured-cta, .faq-cta, .travel-content > .btn'
      );

      children.forEach(function (child) {
        child.classList.add('reveal');
        revealElements.push(child);
      });
    });

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Stagger animation for grid items
            var parent = entry.target.parentElement;
            if (parent) {
              var siblings = Array.from(parent.children).filter(function (el) {
                return el.classList.contains('reveal');
              });
              var index = siblings.indexOf(entry.target);
              var delay = Math.min(index * 80, 400);
              setTimeout(function () {
                entry.target.classList.add('visible');
              }, delay);
            } else {
              entry.target.classList.add('visible');
            }
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // Fallback: show everything
      revealElements.forEach(function (el) {
        el.classList.add('visible');
      });
    }
  }

  // ===== COUNTER INTERSECTION OBSERVER =====
  function initCounterObserver() {
    var statsSection = document.querySelector('.hero-stats');
    if (!statsSection) return;

    if ('IntersectionObserver' in window) {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounters();
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      counterObserver.observe(statsSection);
    } else {
      animateCounters();
    }
  }

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          var headerOffset = parseInt(getComputedStyle(document.documentElement)
            .getPropertyValue('--header-height'), 10) || 72;
          var elementPosition = target.getBoundingClientRect().top;
          var offsetPosition = elementPosition + window.scrollY - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ===== FAQ ACCESSIBILITY =====
  function initFaqAccessibility() {
    var faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(function (item) {
      var summary = item.querySelector('summary');
      if (summary) {
        summary.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            item.open = !item.open;
          }
        });
      }
    });
  }

  // ===== INITIALIZE =====
  function init() {
    initSmoothScroll();
    initScrollReveal();
    initCounterObserver();
    initFaqAccessibility();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
