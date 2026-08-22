/* ═══════════════════════════════════════════════════════════════
   DgLiance — main.js v2
   Hero GSAP · State Search · Map · Green CTA · Particles
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  if (typeof gsap === 'undefined') { console.warn('GSAP not loaded'); return; }
  gsap.registerPlugin(ScrollTrigger);

  /* ══════════════════════════════════════════════════════════
     1.  FLOATING PARTICLES — hero background
     ══════════════════════════════════════════════════════════ */
  (function spawnParticles() {
    var container = document.getElementById('heroParticles');
    if (!container) return;
    var colors = [
      'rgba(20,100,244,.3)', 'rgba(20,100,244,.2)',
      'rgba(0,200,83,.3)',   'rgba(0,200,83,.2)',
      'rgba(43,123,249,.25)'
    ];
    for (var i = 0; i < 16; i++) {
      var p = document.createElement('div');
      var size = Math.random() * 7 + 3;
      p.className = 'hero-particle';
      p.style.cssText = [
        'left:'             + (Math.random() * 90 + 5) + '%;',
        'width:'            + size + 'px;',
        'height:'           + size + 'px;',
        'background:'       + colors[Math.floor(Math.random() * colors.length)] + ';',
        'animation-delay:'  + (Math.random() * 10) + 's;',
        'animation-duration:'+ (Math.random() * 8 + 10) + 's;'
      ].join('');
      container.appendChild(p);
    }
  }());

  /* ══════════════════════════════════════════════════════════
     2.  HERO ANIMATIONS — reliable gsap.set → gsap.to
     ══════════════════════════════════════════════════════════ */
  (function heroAnim() {
    /* Hero text elements no longer have .rv — GSAP owns them */
    gsap.set('.hero-eyebrow',                  { opacity:0, scale:0.6, y:-8 });
    gsap.set('.hero h1',                       { opacity:0, y:80 });
    gsap.set('.hero-sub',                      { opacity:0, y:44 });
    gsap.set('.hero .d-flex.flex-wrap.gap-3 a',{ opacity:0, y:26, scale:0.88 });
    gsap.set('.trust-pill',                    { opacity:0, y:22, scale:0.82 });
    gsap.set('.hero-img',                      { opacity:0, x:50, scale:0.94 });
    gsap.set('.hf1',                           { opacity:0, scale:0.4, x:-36 });
    gsap.set('.hf2',                           { opacity:0, scale:0.4, x:36 });

    var tl = gsap.timeline({ defaults:{ ease:'power4.out' }, delay:0.1 });

    tl
      /* Eyebrow — elastic pop */
      .to('.hero-eyebrow', { opacity:1, scale:1, y:0, duration:0.85, ease:'back.out(2.8)' })
      /* H1 — dramatic rise */
      .to('.hero h1',      { opacity:1, y:0, duration:1.15 }, '-=0.45')
      /* Subtitle */
      .to('.hero-sub',     { opacity:1, y:0, duration:0.85 }, '-=0.6')
      /* CTA buttons stagger */
      .to('.hero .d-flex.flex-wrap.gap-3 a', {
        opacity:1, y:0, scale:1, duration:0.7,
        stagger:0.14, ease:'back.out(2)'
      }, '-=0.5')
      /* Trust pills fast stagger */
      .to('.trust-pill', {
        opacity:1, y:0, scale:1, duration:0.55,
        stagger:0.1, ease:'back.out(1.8)'
      }, '-=0.4')
      /* Hero image slides in */
      .to('.hero-img', { opacity:1, x:0, scale:1, duration:1.3, ease:'power3.out' }, 0.18)
      /* Float card 1 — big elastic */
      .to('.hf1', { opacity:1, scale:1, x:0, duration:0.9, ease:'back.out(3.5)' }, '-=0.5')
      /* Float card 2 */
      .to('.hf2', { opacity:1, scale:1, x:0, duration:0.9, ease:'back.out(3.5)' }, '-=0.7');

    /* Continuous float */
    gsap.to('.hf1', { y:-17, duration:2.9, ease:'sine.inOut', yoyo:true, repeat:-1, delay:1.6 });
    gsap.to('.hf2', { y:17,  duration:3.4, ease:'sine.inOut', yoyo:true, repeat:-1, delay:0.9 });

    /* Subtle blobDrift on hero bg orbs via GSAP (reinforces CSS anim) */
    gsap.to('.hero-blob-blue',  { x:20, y:-25, duration:9,  ease:'sine.inOut', yoyo:true, repeat:-1 });
    gsap.to('.hero-blob-green', { x:-18, y:20, duration:11, ease:'sine.inOut', yoyo:true, repeat:-1, delay:-4 });

    /* Image parallax on scroll */
    gsap.to('.hero-img', {
      yPercent:16, ease:'none',
      scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:true }
    });
  }());

  /* ══════════════════════════════════════════════════════════
     3.  FLOAT CARD COUNTERS
     ══════════════════════════════════════════════════════════ */
  (function counterAnim() {
    document.querySelectorAll('.hero-float strong').forEach(function(el) {
      var raw    = el.textContent.trim();
      var num    = parseFloat(raw.replace(/[^0-9.]/g, ''));
      var suffix = raw.replace(/[0-9.]/g, '');
      if (isNaN(num)) return;
      var obj = { val: 0 };
      gsap.to(obj, {
        val:num, duration:2.4, delay:1.6, ease:'power2.out',
        onUpdate: function() { el.textContent = Math.round(obj.val) + suffix; }
      });
    });
  }());

  /* ══════════════════════════════════════════════════════════
     4.  STATS BAR COUNT-UP (on scroll)
     ══════════════════════════════════════════════════════════ */
  (function statsAnim() {
    document.querySelectorAll('.stat-block strong').forEach(function(el) {
      var raw    = el.textContent.trim();
      var num    = parseFloat(raw.replace(/[^0-9.]/g, ''));
      var suffix = raw.replace(/[0-9.]/g, '');
      if (isNaN(num)) return;
      var obj = { val: 0 };
      gsap.to(obj, {
        val:num, duration:1.9, ease:'power2.out',
        onUpdate: function() { el.textContent = Math.round(obj.val) + suffix; },
        scrollTrigger:{ trigger:el, start:'top 88%', once:true }
      });
    });
  }());

  /* ══════════════════════════════════════════════════════════
     5.  PROCESS STEPS V2 — staggered scroll entrance
     ══════════════════════════════════════════════════════════ */
  (function processAnim() {
    gsap.utils.toArray('.step-card-v2').forEach(function(card, i) {
      gsap.from(card, {
        y:55, opacity:0, duration:0.75, delay:i*0.1, ease:'power3.out',
        scrollTrigger:{ trigger:card, start:'top 87%', once:true }
      });
    });
  }());

  /* ══════════════════════════════════════════════════════════
     6.  STATE SECTION — live chip search + filter tabs
     ══════════════════════════════════════════════════════════ */
  (function stateSearch() {
    var input      = document.getElementById('distSearch');
    var hint       = document.getElementById('distHint');
    var filterBtns = document.querySelectorAll('.sft-btn');
    var columns    = document.querySelectorAll('.dist-region-col');

    if (!input) return;

    var activeRegion = 'all';

    /* ⌘K / Ctrl+K — scroll + focus */
    document.addEventListener('keydown', function(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        var sec = document.querySelector('.states-sec');
        if (sec) sec.scrollIntoView({ behavior:'smooth', block:'center' });
        setTimeout(function() { input.focus(); input.select(); }, 500);
      }
    });

    /* Region tab click */
    filterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        filterBtns.forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
        activeRegion = this.dataset.region;
        gsap.fromTo(this, { scale:0.86 }, { scale:1, duration:0.4, ease:'back.out(2.8)' });
        applyFilters();
      });
    });

    /* Live search */
    input.addEventListener('input', applyFilters);

    function applyFilters() {
      var q = input.value.toLowerCase().trim();
      var totalMatched = 0;

      columns.forEach(function(col) {
        var region      = col.dataset.region;
        var regionMatch = (activeRegion === 'all') || (region === activeRegion);

        if (!regionMatch) { col.style.display = 'none'; return; }
        col.style.display = '';

        var chips     = col.querySelectorAll('.state-chip');
        var colMatch  = 0;

        chips.forEach(function(chip) {
          var name = (chip.dataset.name || chip.textContent).toLowerCase();
          if (!q) {
            chip.classList.remove('highlighted', 'dimmed');
            colMatch++;
          } else if (name.includes(q)) {
            if (!chip.classList.contains('highlighted')) {
              chip.classList.add('highlighted');
              chip.classList.remove('dimmed');
              /* GSAP pop on newly highlighted */
              gsap.fromTo(chip, { scale:0.88 }, { scale:1.04, duration:0.35, ease:'back.out(2.5)' });
            }
            colMatch++;
            totalMatched++;
          } else {
            chip.classList.remove('highlighted');
            chip.classList.add('dimmed');
          }
        });

        /* Hide region column if no matches */
        if (q && colMatch === 0) { col.style.display = 'none'; }
      });

      /* Update hint */
      if (q) {
        hint.innerHTML = totalMatched > 0
          ? '<i class="bi bi-check-circle-fill me-1"></i> Found <strong>' + totalMatched +
            '</strong> state' + (totalMatched > 1 ? 's' : '') + ' matching &ldquo;' + escHtml(q) + '&rdquo;'
          : '<i class="bi bi-x-circle me-1"></i> No states found for &ldquo;' + escHtml(q) + '&rdquo; — try another keyword';
        hint.className = 'saas-search-hint states-hint' + (totalMatched > 0 ? ' found' : '');
      } else {
        var label = activeRegion === 'all'
          ? '28+ states & territories'
          : activeRegion.charAt(0).toUpperCase() + activeRegion.slice(1) + ' India';
        hint.innerHTML = '<i class="bi bi-info-circle me-1"></i> Showing ' + label;
        hint.className = 'saas-search-hint states-hint';
        /* Restore all visible columns' chips */
        columns.forEach(function(col) {
          if (activeRegion === 'all' || col.dataset.region === activeRegion) {
            col.style.display = '';
            col.querySelectorAll('.state-chip').forEach(function(c) {
              c.classList.remove('highlighted', 'dimmed');
            });
          }
        });
      }
    }

    function escHtml(s) {
      return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }
  }());

  /* ══════════════════════════════════════════════════════════
     7.  STATE REGION CARDS — scroll entrance animation
     ══════════════════════════════════════════════════════════ */
  (function stateCardsAnim() {
    gsap.utils.toArray('.state-region-card').forEach(function(card, i) {
      gsap.from(card, {
        y:50, opacity:0, scale:0.95,
        duration:0.7, delay:i * 0.1, ease:'power3.out',
        scrollTrigger:{ trigger:card, start:'top 88%', once:true }
      });
    });
  }());

  /* ══════════════════════════════════════════════════════════
     8.  MAP SECTION ANIMATION
     ══════════════════════════════════════════════════════════ */
  (function mapAnim() {
    gsap.from('.map-frame-wrap', {
      y:50, opacity:0, scale:0.96, duration:1.1, ease:'power3.out',
      scrollTrigger:{ trigger:'.map-sec', start:'top 78%', once:true }
    });
    gsap.from('.map-info-row', {
      x:-30, opacity:0, duration:0.6, stagger:0.1, ease:'power3.out',
      scrollTrigger:{ trigger:'.map-info-wrap', start:'top 82%', once:true }
    });
  }());

  /* ══════════════════════════════════════════════════════════
     9.  BIG CTA (GREEN) — animated entrance
     ══════════════════════════════════════════════════════════ */
  (function bigCtaAnim() {
    var ctaTrigger = { trigger:'.big-cta', start:'top 75%', once:true };

    gsap.from('.big-cta h2', {
      y:45, opacity:0, duration:0.9, ease:'power3.out',
      scrollTrigger:ctaTrigger
    });
    gsap.from('.big-cta p', {
      y:30, opacity:0, duration:0.8, delay:0.15, ease:'power3.out',
      scrollTrigger:ctaTrigger
    });
    gsap.from('.btn-cta-wh, .btn-cta-ow', {
      y:28, opacity:0, scale:0.88, duration:0.7,
      stagger:0.13, delay:0.3, ease:'back.out(2)',
      scrollTrigger:ctaTrigger
    });
    /* Rotating glow orb */
    gsap.to('.cta-glow-orb', {
      x:60, y:40, duration:12,
      ease:'sine.inOut', yoyo:true, repeat:-1
    });
  }());

  /* ══════════════════════════════════════════════════════════
     10. MAGNETIC BUTTONS
     ══════════════════════════════════════════════════════════ */
  (function magneticBtns() {
    document.querySelectorAll('.btn-hero-primary, .btn-enroll').forEach(function(btn) {
      btn.addEventListener('mousemove', function(e) {
        var r = this.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width  / 2) * 0.24;
        var y = (e.clientY - r.top  - r.height / 2) * 0.24;
        gsap.to(this, { x:x, y:y, duration:0.35, ease:'power2.out' });
      });
      btn.addEventListener('mouseleave', function() {
        gsap.to(this, { x:0, y:0, duration:0.6, ease:'elastic.out(1, 0.4)' });
      });
    });
  }());

}());
