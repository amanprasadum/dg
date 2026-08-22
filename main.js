/* ═══════════════════════════════════════════════════════════════
   DgLiance — main.js
   GSAP Hero  ·  SaaS Search  ·  Floating Cards  ·  Magnetic Btns
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Guard: wait for GSAP ─────────────────────────────────── */
  if (typeof gsap === 'undefined') {
    console.warn('DgLiance: GSAP not loaded.');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  /* ══════════════════════════════════════════════════════════
     1.  HERO ANIMATIONS
     ══════════════════════════════════════════════════════════ */
  (function heroAnim() {

    /* Remove .rv from hero — we handle visibility via gsap.set below */
    document.querySelectorAll('.hero .rv').forEach(function (el) {
      el.classList.remove('rv');
    });

    /* Set initial hidden states BEFORE timeline runs — elements are
       visible in CSS by default so we must explicitly set start states */
    gsap.set('.hero-eyebrow', { scale: 0.7, opacity: 0 });
    gsap.set('.hero h1',      { y: 28, opacity: 0 });
    gsap.set('.hero-sub',     { y: 24, opacity: 0 });
    gsap.set('.hero .d-flex.flex-wrap.gap-3 a', { y: 18, opacity: 0 });
    gsap.set('.trust-pill',   { y: 14, opacity: 0 });
    gsap.set('.hero-img',     { clipPath: 'inset(100% 0 0 0)' });
    gsap.set('.hf1',          { scale: 0.55, opacity: 0, x: -28 });
    gsap.set('.hf2',          { scale: 0.55, opacity: 0, x: 28 });

    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    /* ── Eyebrow badge: elastic scale-in ── */
    tl.to('.hero-eyebrow', {
      scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(2.2)'
    });

    /* ── H1: cinematic clip-path reveal from bottom ── */
    tl.to('.hero h1', {
      clipPath: 'inset(0% 0 0 0)',
      y: 0, opacity: 1,
      duration: 1.0, ease: 'power4.out'
    }, '-=0.25');

    /* ── Sub text ── */
    tl.to('.hero-sub', {
      y: 0, opacity: 1, duration: 0.72
    }, '-=0.45');

    /* ── CTA buttons ── */
    tl.to('.hero .d-flex.flex-wrap.gap-3 a', {
      y: 0, opacity: 1, duration: 0.6,
      stagger: 0.12, ease: 'power2.out'
    }, '-=0.38');

    /* ── Trust pills ── */
    tl.to('.trust-pill', {
      y: 0, opacity: 1, duration: 0.5,
      stagger: 0.09, ease: 'power2.out'
    }, '-=0.3');

    /* ── Hero image: cinematic clip-path reveal upward ── */
    tl.to('.hero-img', {
      clipPath: 'inset(0% 0 0 0)',
      duration: 1.15, ease: 'power4.out'
    }, 0.22);

    /* ── Float card 1: spring in from left ── */
    tl.to('.hf1', {
      scale: 1, opacity: 1, x: 0,
      duration: 0.72, ease: 'back.out(2)'
    }, '-=0.35');

    /* ── Float card 2: spring in from right ── */
    tl.to('.hf2', {
      scale: 1, opacity: 1, x: 0,
      duration: 0.72, ease: 'back.out(2)'
    }, '-=0.52');

    /* ── Continuous floating (after entrance) ── */
    gsap.to('.hf1', {
      y: -15, duration: 2.8,
      ease: 'sine.inOut', yoyo: true,
      repeat: -1, delay: 1.2
    });
    gsap.to('.hf2', {
      y: 15, duration: 3.3,
      ease: 'sine.inOut', yoyo: true,
      repeat: -1, delay: 0.6
    });

    /* ── Subtle parallax on hero image on scroll ── */
    gsap.to('.hero-img', {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

  }());

  /* ══════════════════════════════════════════════════════════
     2.  FLOAT CARD COUNTERS — animate number on load
     ══════════════════════════════════════════════════════════ */
  (function counterAnim() {

    document.querySelectorAll('.hero-float strong').forEach(function (el) {
      var raw    = el.textContent.trim();          /* e.g. "300%" or "500+" */
      var num    = parseFloat(raw.replace(/[^0-9.]/g, ''));
      var suffix = raw.replace(/[0-9.]/g, '');     /* %, + etc. */
      if (isNaN(num)) return;

      var obj = { val: 0 };
      gsap.to(obj, {
        val: num,
        duration: 2,
        delay: 1.3,
        ease: 'power2.out',
        onUpdate: function () {
          el.textContent = Math.round(obj.val) + suffix;
        }
      });
    });

  }());

  /* ══════════════════════════════════════════════════════════
     3.  PROCESS STEPS V2 — ScrollTrigger entrance
     ══════════════════════════════════════════════════════════ */
  (function processAnim() {

    gsap.utils.toArray('.step-card-v2').forEach(function (card, i) {
      gsap.from(card, {
        y: 40, opacity: 0,
        duration: 0.65, delay: i * 0.09,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 86%',
          once: true
        }
      });
    });

    /* Ghost number count-up when process section enters view */
    gsap.utils.toArray('.scv2-ghost-num').forEach(function (el, i) {
      gsap.from(el, {
        opacity: 0, scale: 0.6,
        duration: 0.5, delay: i * 0.1,
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true
        }
      });
    });

  }());

  /* ══════════════════════════════════════════════════════════
     4.  SAAS SEARCH — Region filter + Live search
     ══════════════════════════════════════════════════════════ */
  (function saasSearch() {

    var input      = document.getElementById('distSearch');
    var hint       = document.getElementById('distHint');
    var filterBtns = document.querySelectorAll('.sft-btn');
    var columns    = document.querySelectorAll('.dist-region-col');
    var allLinks   = document.querySelectorAll('.dist-region-col .dist-link');

    if (!input) return;

    var activeRegion = 'all';

    /* ⌘K / Ctrl+K shortcut — focus search */
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        input.focus();
        input.select();
        /* Smooth scroll to search */
        var distSec = document.querySelector('.dist-sec');
        if (distSec) distSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    /* Region tab clicks */
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        activeRegion = this.dataset.region;
        applyFilters();

        /* Animate active tab */
        gsap.fromTo(this, { scale: 0.9 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
      });
    });

    /* Live text search */
    input.addEventListener('input', applyFilters);

    function applyFilters() {
      var q = input.value.toLowerCase().trim();
      var totalVisible = 0;

      columns.forEach(function (col) {
        var region      = col.dataset.region;
        var regionMatch = activeRegion === 'all' || region === activeRegion;

        if (!regionMatch) {
          col.style.display = 'none';
          return;
        }
        col.style.display = '';

        var colLinks = col.querySelectorAll('.dist-link');
        var colVisible = 0;

        colLinks.forEach(function (link) {
          var text = link.textContent.toLowerCase();
          var show = !q || text.includes(q);
          link.style.display = show ? '' : 'none';
          if (show) { colVisible++; totalVisible++; }
        });

        /* Hide col entirely if search returns no results in it */
        if (q && colVisible === 0) { col.style.display = 'none'; }
      });

      /* Highlight matching links */
      document.querySelectorAll('.dist-link').forEach(function(l){l.classList.remove('state-highlight')});
      document.querySelectorAll('.dist-col-box').forEach(function(b){b.classList.remove('col-highlight')});
      if (q && totalVisible > 0) {
        document.querySelectorAll('.dist-link:not([style*="display: none"])').forEach(function(l){
          var text = l.textContent.toLowerCase();
          if (text.includes(q)) {
            l.classList.add('state-highlight');
            var box = l.closest('.dist-col-box');
            if (box) { box.classList.remove('col-highlight'); void box.offsetWidth; box.classList.add('col-highlight'); }
          }
        });
      }

      /* Update hint text */
      if (q) {
        if (totalVisible > 0) {
          hint.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i> Found ' +
            totalVisible + ' result' + (totalVisible !== 1 ? 's' : '') +
            ' for &ldquo;' + escHtml(q) + '&rdquo;';
          hint.className = 'saas-search-hint found';
        } else {
          hint.innerHTML = '<i class="bi bi-x-circle me-1"></i> No results for &ldquo;' +
            escHtml(q) + '&rdquo; — try a different keyword';
          hint.className = 'saas-search-hint';
        }
      } else {
        var regionLabel = activeRegion === 'all'
          ? '28+ states &amp; territories'
          : (activeRegion.charAt(0).toUpperCase() + activeRegion.slice(1)) + ' India';
        hint.innerHTML = '<i class="bi bi-info-circle me-1"></i> Showing ' + regionLabel;
        hint.className = 'saas-search-hint';
        /* Restore all links when search cleared */
        columns.forEach(function (col) {
          if (activeRegion === 'all' || col.dataset.region === activeRegion) {
            col.style.display = '';
            col.querySelectorAll('.dist-link').forEach(function (l) {
              l.style.display = '';
            });
          }
        });
      }
    }

    function escHtml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

  }());

  /* ══════════════════════════════════════════════════════════
     5.  MAGNETIC BUTTONS — subtle pull-towards-cursor effect
     ══════════════════════════════════════════════════════════ */
  (function magneticBtns() {

    var btns = document.querySelectorAll('.btn-hero-primary, .btn-enroll');

    btns.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = this.getBoundingClientRect();
        var x    = (e.clientX - rect.left - rect.width  / 2) * 0.22;
        var y    = (e.clientY - rect.top  - rect.height / 2) * 0.22;
        gsap.to(this, { x: x, y: y, duration: 0.35, ease: 'power2.out' });
      });

      btn.addEventListener('mouseleave', function () {
        gsap.to(this, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.4)' });
      });
    });

  }());

  /* ══════════════════════════════════════════════════════════
     6.  STATS BAR — count-up on scroll entry
     ══════════════════════════════════════════════════════════ */
  (function statsAnim() {

    document.querySelectorAll('.stat-block strong').forEach(function (el) {
      var raw    = el.textContent.trim();
      var num    = parseFloat(raw.replace(/[^0-9.]/g, ''));
      var suffix = raw.replace(/[0-9.]/g, '');
      if (isNaN(num)) return;

      var obj = { val: 0 };
      gsap.to(obj, {
        val: num,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: function () {
          el.textContent = Math.round(obj.val) + suffix;
        },
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true
        }
      });
    });

  }());

}());