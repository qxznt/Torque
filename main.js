/* ============================================================
   TORQUE ROBOTICS — main.js  v3
   ============================================================ */

(function () {
  'use strict';

  /* ── Lenis smooth scroll ────────────────────────────────── */
  var lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.15,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      autoResize: true,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  /* ── Sticky navbar ──────────────────────────────────────── */
  var header = document.querySelector('header');
  if (header) {
    var isHome = header.classList.contains('home_header');
    if (!isHome) {
      header.classList.add('scrolled');
    } else {
      function onScroll() {
        if (window.scrollY > 60) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  }

  /* ── Quick Nav Bubble ───────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    var bubble    = document.getElementById('contact-bubble');
    var panel     = document.getElementById('contact-panel');
    var closeBtn  = document.getElementById('contact-close');
    var backdrop  = document.getElementById('contact-modal-backdrop');
    if (!bubble) return;

    function openModal() {
      if (panel) { panel.classList.add('open'); }
      if (backdrop) { backdrop.classList.add('open'); }
      bubble.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    function closeModal() {
      if (panel) { panel.classList.remove('open'); }
      if (backdrop) { backdrop.classList.remove('open'); }
      bubble.classList.remove('active');
      document.body.style.overflow = '';
    }

    bubble.addEventListener('click', function () {
      panel && panel.classList.contains('open') ? closeModal() : openModal();
    });
    bubble.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); bubble.click(); }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel && panel.classList.contains('open')) closeModal();
    });

    /* Animate numbers counter on scroll */
    function animateCounters() {
      document.querySelectorAll('[data-count]').forEach(function(el) {
        var target = parseInt(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1800;
        var start = null;
        var observer = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting && !el.classList.contains('counted')) {
              el.classList.add('counted');
              function step(ts) {
                if (!start) start = ts;
                var progress = Math.min((ts - start) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(eased * target) + suffix;
                if (progress < 1) requestAnimationFrame(step);
              }
              requestAnimationFrame(step);
            }
          });
        }, { threshold: 0.5 });
        observer.observe(el);
      });
    }
    animateCounters();
  });

  /* ── Gallery lightbox with navigation arrows ────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    var overlay    = document.getElementById('gallery-overlay');
    var overlayImg = document.getElementById('gallery-overlay-img');
    if (!overlay || !overlayImg) return;

    var galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    var currentIndex = 0;

    /* Inject nav buttons and close button into overlay */
    if (!document.getElementById('gallery-prev')) {
      overlay.insertAdjacentHTML('afterbegin',
        '<button class="gallery-overlay-close" id="gallery-close" title="Close">&times;</button>' +
        '<button class="gallery-nav-btn" id="gallery-prev" title="Previous">&#8249;</button>' +
        '<button class="gallery-nav-btn" id="gallery-next" title="Next">&#8250;</button>' +
        '<div class="gallery-counter" id="gallery-counter"></div>'
      );
    }

    function showImage(index) {
      var item = galleryItems[index];
      var img = item.querySelector('img');
      overlayImg.src = img.src;
      overlayImg.alt = img.alt || '';
      currentIndex = index;
      var counter = document.getElementById('gallery-counter');
      if (counter) counter.textContent = (index + 1) + ' / ' + galleryItems.length;
    }

    function openOverlay(index) {
      showImage(index);
      overlay.classList.add('visible');
      overlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function closeOverlay() {
      overlay.classList.remove('visible');
      overlay.style.display = 'none';
      overlayImg.src = '';
      document.body.style.overflow = '';
    }

    galleryItems.forEach(function (item, i) {
      item.addEventListener('click', function () { openOverlay(i); });
    });

    document.addEventListener('click', function (e) {
      if (e.target.id === 'gallery-close') { closeOverlay(); return; }
      if (e.target.id === 'gallery-prev' || e.target.closest && e.target.closest('#gallery-prev')) {
        e.stopPropagation();
        showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length);
        return;
      }
      if (e.target.id === 'gallery-next' || e.target.closest && e.target.closest('#gallery-next')) {
        e.stopPropagation();
        showImage((currentIndex + 1) % galleryItems.length);
        return;
      }
      /* Click backdrop to close */
      if (e.target === overlay) { closeOverlay(); }
    });

    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('visible')) return;
      if (e.key === 'Escape') closeOverlay();
      if (e.key === 'ArrowLeft') showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length);
      if (e.key === 'ArrowRight') showImage((currentIndex + 1) % galleryItems.length);
    });
  });

  /* ── Service Tabs (Services page) ──────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    var tabs = document.querySelectorAll('.service-tab');
    var panels = document.querySelectorAll('.service-panel');
    if (!tabs.length) return;
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        tabs.forEach(function(t) { t.classList.remove('active'); });
        panels.forEach(function(p) { p.classList.remove('active'); });
        tab.classList.add('active');
        var target = document.getElementById(tab.getAttribute('data-tab'));
        if (target) target.classList.add('active');
      });
    });
  });

  /* ── Swipers ────────────────────────────────────────────── */
  if (document.querySelector('.mySwiper_1')) {
    new Swiper('.mySwiper_1', {
      slidesPerView: 6,
      spaceBetween: 20,
      freeMode: true,
      loop: true,
      speed: 600,
      autoplay: { delay: 2200, disableOnInteraction: false },
      breakpoints: {
        0:    { slidesPerView: 3, spaceBetween: 10 },
        768:  { slidesPerView: 4, spaceBetween: 14 },
        1024: { slidesPerView: 6, spaceBetween: 20 },
      },
    });
  }

  if (document.querySelector('.mySwiper_2')) {
    new Swiper('.mySwiper_2', {
      slidesPerView: 2,
      spaceBetween: 20,
      loop: true,
      speed: 600,
      autoplay: { delay: 4500, disableOnInteraction: false },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        0:   { slidesPerView: 1, spaceBetween: 0 },
        768: { slidesPerView: 2, spaceBetween: 20 },
      },
    });
  }

  if (document.querySelector('.careerSwiper')) {
    new Swiper('.careerSwiper', {
      slidesPerView: 1,
      loop: true,
      speed: 800,
      autoplay: { delay: 3200, disableOnInteraction: false },
      effect: 'fade',
      fadeEffect: { crossFade: true },
      pagination: { el: '.career-pagination', clickable: true },
    });
  }

  /* ── Job tile click → anchor to apply form ──────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.job-tile').forEach(function (tile) {
      tile.addEventListener('click', function () {
        var applySection = document.querySelector('.tal_sec2') ||
                           document.querySelector('.tal_sec:last-of-type');
        if (applySection) {
          applySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  });

}());
