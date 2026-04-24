/* Midtown Marketplace — interactions
   Today's-hours highlight + GSAP scroll reveals + sticky header */

(function () {
  'use strict';

  const HOURS = [
    { open: '12:00', close: '17:00', label: '12:00 PM – 5:00 PM', closed: false }, // Sun
    { open: null,    close: null,    label: 'Closed',              closed: true  }, // Mon
    { open: '10:00', close: '17:00', label: '10:00 AM – 5:00 PM', closed: false }, // Tue
    { open: '10:00', close: '17:00', label: '10:00 AM – 5:00 PM', closed: false }, // Wed
    { open: '10:00', close: '17:00', label: '10:00 AM – 5:00 PM', closed: false }, // Thu
    { open: '10:00', close: '17:00', label: '10:00 AM – 5:00 PM', closed: false }, // Fri
    { open: '11:30', close: '18:00', label: '11:30 AM – 6:00 PM', closed: false }  // Sat
  ];

  function minutesFromHHMM(hhmm) {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  }

  function updateTodayHighlight() {
    const now = new Date();
    const day = now.getDay();
    const today = HOURS[day];

    // Highlight today's row in the hours table
    const row = document.querySelector(`#hoursTable tr[data-day="${day}"]`);
    if (row) row.classList.add('is-today');

    // Hero "Today" badge
    const badge = document.getElementById('todayHours');
    if (!badge) return;

    if (today.closed) {
      badge.textContent = 'Closed';
      badge.dataset.state = 'closed';
      return;
    }

    const minsNow = now.getHours() * 60 + now.getMinutes();
    const opens = minutesFromHHMM(today.open);
    const closes = minutesFromHHMM(today.close);

    if (minsNow >= opens && minsNow < closes) {
      badge.textContent = `Open · until ${formatLabel(today.close)}`;
      badge.dataset.state = 'open';
    } else if (minsNow < opens) {
      badge.textContent = `Opens at ${formatLabel(today.open)}`;
      badge.dataset.state = 'closed';
    } else {
      badge.textContent = 'Closed for today';
      badge.dataset.state = 'closed';
    }
  }

  function formatLabel(hhmm) {
    const [h, m] = hhmm.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    const mm = String(m).padStart(2, '0');
    return mm === '00' ? `${h12} ${period}` : `${h12}:${mm} ${period}`;
  }

  function setupHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;
    let ticking = false;
    function check() {
      header.classList.toggle('is-scrolled', window.scrollY > 60);
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(check);
        ticking = true;
      }
    }, { passive: true });
    check();
  }

  function setupYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  function setupGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      document.querySelectorAll('[data-reveal]').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Hero parallax
    const heroImg = document.querySelector('.hero__img');
    if (heroImg) {
      gsap.to(heroImg, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // Hero text — staggered in immediately
    gsap.to('.hero [data-reveal]', {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.12,
      delay: 0.2
    });

    // All other reveals
    document.querySelectorAll('section:not(.hero) [data-reveal]').forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });
    });
  }

  // Boot
  document.addEventListener('DOMContentLoaded', () => {
    updateTodayHighlight();
    setupHeaderScroll();
    setupYear();
  });

  window.addEventListener('load', setupGSAP);
})();
