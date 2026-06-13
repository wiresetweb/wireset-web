/* Wireset Web — interactive layer.
   Vanilla, dependency-free (the site's CSP blocks external scripts on purpose).
   Everything here is progressive enhancement: with JS off, or with
   prefers-reduced-motion, the site is fully usable and all values are visible. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  /* ---------- Footer year ---------- */
  var y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Live "loaded in X ms" badge ----------
     Honest number: time from navigation start to this script running
     (the page is interactive by now). We sell fast sites — so prove it. */
  (function () {
    var el = document.querySelector('[data-ms]');
    if (!el) return;
    var ms;
    try {
      var nav = performance.getEntriesByType('navigation')[0];
      ms = nav && nav.domContentLoadedEventEnd ? nav.domContentLoadedEventEnd : performance.now();
    } catch (e) {
      ms = performance.now();
    }
    ms = Math.max(1, Math.round(ms));
    el.setAttribute('data-count-to', ms);
    el.setAttribute('data-suffix', 'ms');
    var badge = el.closest('.speed-badge');
    if (badge) badge.classList.add('show');
  })();

  /* ---------- Count-up numbers ---------- */
  function animateCount(el) {
    var to = parseFloat(el.getAttribute('data-count-to')) || 0;
    var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var pre = el.getAttribute('data-prefix') || '';
    var suf = el.getAttribute('data-suffix') || '';
    function fmt(v) { return pre + v.toFixed(dec) + suf; }
    if (reduce) { el.textContent = fmt(to); return; }
    var dur = 1100, startT = null;
    function step(t) {
      if (startT === null) startT = t;
      var p = Math.min(1, (t - startT) / dur);
      var e = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = fmt(to * e);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = fmt(to);
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('[data-count-to]');
  if (counters.length) {
    if ('IntersectionObserver' in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (c) { cio.observe(c); });
    } else {
      counters.forEach(animateCount);
    }
  }

  /* ---------- Scroll reveal (with per-row stagger) ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    var revealSel = '.section-head, .card, .tier, .step, .stat, .uh-item, .faq-item,' +
      '.own-grid > div, .position-grid > div, .tools-copy, .tools-tier, .cta-banner-inner,' +
      '.contact-copy, .contact-form, .how-copy, .tool-type, .scope-note';
    var rio = new IntersectionObserver(function (entries) {
      var shown = 0;
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.style.transitionDelay = Math.min(shown * 70, 280) + 'ms';
        e.target.classList.add('in');
        rio.unobserve(e.target);
        shown++;
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    document.querySelectorAll(revealSel).forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) return; // above the fold — no flash
      el.classList.add('reveal');
      rio.observe(el);
    });
  }

  /* ---------- 3D pointer tilt on cards ---------- */
  if (!reduce && finePointer) {
    document.querySelectorAll('.card, .tool-type').forEach(function (card) {
      var img = card.querySelector('.art-img');
      var lift = card.classList.contains('card') ? -4 : -3;
      card.addEventListener('pointermove', function (ev) {
        var r = card.getBoundingClientRect();
        var px = (ev.clientX - r.left) / r.width - 0.5;
        var py = (ev.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'translateY(' + lift + 'px) rotateX(' + (-py * 5).toFixed(2) +
          'deg) rotateY(' + (px * 5).toFixed(2) + 'deg)';
        if (img) img.style.transform = 'scale(1.06) translate(' + (px * -8).toFixed(1) + 'px,' + (py * -8).toFixed(1) + 'px)';
      });
      card.addEventListener('pointerleave', function () {
        card.style.transform = '';
        if (img) img.style.transform = '';
      });
    });
  }

  /* ---------- Self-drawing logo (CSS handles the animation) ----------
     We just normalize the stroke length so the keyframe is resolution-independent. */
  document.querySelectorAll('.site-header .brand-mark path').forEach(function (p) {
    p.setAttribute('pathLength', '100');
  });

  /* ---------- Hero "signal network" ----------
     Drifting node/wire constellation that themes the Wireset name. Amber links
     trace toward the cursor. Pauses when the hero scrolls away or the tab is hidden. */
  (function () {
    if (reduce) return;
    var hero = document.querySelector('.hero');
    if (!hero || !window.requestAnimationFrame) return;
    var ctx, canvas;
    try {
      canvas = document.createElement('canvas');
      ctx = canvas.getContext('2d');
      if (!ctx) return;
    } catch (e) { return; }
    canvas.className = 'hero-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    hero.insertBefore(canvas, hero.firstChild);

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, nodes = [], raf = null, running = false;
    var mouse = { x: -9999, y: -9999 };
    var LINK = 130, MLINK = 170;

    function build() {
      w = hero.clientWidth; h = hero.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.max(14, Math.min(64, Math.round(w * h / 16000)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
          amber: Math.random() < 0.08
        });
      }
    }

    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      var i, j, n, a, b, dx, dy, d, o;
      for (i = 0; i < nodes.length; i++) {
        n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      for (i = 0; i < nodes.length; i++) {
        for (j = i + 1; j < nodes.length; j++) {
          a = nodes[i]; b = nodes[j];
          dx = a.x - b.x; dy = a.y - b.y; d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            o = (1 - d / LINK) * 0.16;
            ctx.strokeStyle = 'rgba(201,211,226,' + o + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (i = 0; i < nodes.length; i++) {
        n = nodes[i];
        dx = n.x - mouse.x; dy = n.y - mouse.y; d = Math.sqrt(dx * dx + dy * dy);
        var near = d < MLINK;
        if (near) {
          o = (1 - d / MLINK) * 0.5;
          ctx.strokeStyle = 'rgba(245,165,36,' + o + ')';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = (n.amber || near) ? 'rgba(245,165,36,' + (near ? 0.95 : 0.55) + ')' : 'rgba(201,211,226,0.4)';
        ctx.beginPath(); ctx.arc(n.x, n.y, near ? 2.6 : 1.5, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    function start() { if (running) return; running = true; raf = requestAnimationFrame(frame); }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = null; }

    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    hero.addEventListener('pointerleave', function () { mouse.x = -9999; mouse.y = -9999; });
    window.addEventListener('resize', build);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) start(); else stop(); });
      }, { threshold: 0 }).observe(hero);
    }
    build();
    start();
  })();
})();

/* ============================================================
   First-party attribution (cookieless, first-touch sticky)
   Remembers which campaign/link brought a visitor and stamps
   every contact form, so leads carry their true source —
   ad, cold email, or organic. First-party only; no third
   parties, no advertising trackers. Honors DNT / GPC.
   ============================================================ */
(function () {
  'use strict';
  var KEY = 'ww_attr', TTL = 90 * 864e5;
  var DNT = navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes' ||
            window.doNotTrack === '1' || navigator.globalPrivacyControl === true;

  function now() { return Date.now(); }
  function fmt(o) {
    return o ? [o.source, o.medium, o.campaign, o.content, o.term].filter(Boolean).join(' | ') : '';
  }

  // UTM from the current URL, plus a short outreach tag: ?ref=slug -> email/outreach
  function readUTM() {
    var p = new URLSearchParams(location.search), o = {}, any = false;
    ['source', 'medium', 'campaign', 'content', 'term'].forEach(function (k) {
      var v = p.get('utm_' + k); if (v) { o[k] = v.slice(0, 80); any = true; }
    });
    var ref = p.get('ref');
    if (!any && ref) { o = { source: 'email', medium: 'outreach', content: ref.slice(0, 80) }; any = true; }
    return any ? o : null;
  }

  // Classify document.referrer; null = internal nav, 'direct' = none
  function classifyReferrer() {
    var r = document.referrer; if (!r) return 'direct';
    try {
      var h = new URL(r).hostname.replace(/^www\./, '');
      if (h === location.hostname) return null;
      if (/(^|\.)google\./.test(h)) return 'google';
      if (/(^|\.)bing\.|duckduckgo|yahoo/.test(h)) return 'search';
      if (/facebook|instagram|fb\.|fbcdn|t\.co|twitter|x\.com|linkedin|reddit/.test(h)) return 'social';
      return h;
    } catch (e) { return 'referral'; }
  }

  var utm = readUTM(), ref = classifyReferrer();
  var rec;
  if (DNT) {
    // No persistence under DNT/GPC: attribute only this pageview.
    rec = { lp: location.pathname, ref0: ref || 'direct' };
    if (utm) { rec.first = utm; rec.last = utm; }
    else if (ref && ref !== 'direct') rec.first = { source: ref, medium: 'referral' };
  } else {
    try { rec = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { rec = null; }
    if (!rec || now() - rec.t0 > TTL) rec = { t0: now(), lp: location.pathname, ref0: ref || 'direct' };
    if (!rec.first) {
      if (utm) rec.first = utm;
      else if (ref && ref !== 'direct') rec.first = { source: ref, medium: 'referral' };
    }
    if (utm) rec.last = utm;     // last-touch = most recent campaign click
    rec.t = now();
    try { localStorage.setItem(KEY, JSON.stringify(rec)); } catch (e) {}
  }

  function ensure(form, name, value) {
    var el = form.querySelector('input[name="' + name + '"]');
    if (!el) { el = document.createElement('input'); el.type = 'hidden'; el.name = name; form.appendChild(el); }
    el.value = value || '';
  }
  function stamp() {
    var first = fmt(rec.first), last = fmt(rec.last);
    document.querySelectorAll('form.contact-form').forEach(function (form) {
      ensure(form, 'campaign', first || last);   // headline attribution (first-touch preferred)
      ensure(form, 'first_touch', first);
      ensure(form, 'last_touch', last);
      ensure(form, 'landing_page', rec.lp || location.pathname);
      ensure(form, 'referrer', rec.ref0 || '');
    });
  }
  if (document.readyState !== 'loading') stamp();
  else document.addEventListener('DOMContentLoaded', stamp);
})();

/* Meta pixel — base code is inline in each page's <head>; here we only fire a
   Lead event on contact-form submit (carrying the campaign). If the pixel was
   suppressed by the inline GPC/DNT guard, window.fbq is absent and this no-ops. */
(function () {
  'use strict';
  document.addEventListener('submit', function (e) {
    try {
      var f = e.target;
      if (!f || !f.classList || !f.classList.contains('contact-form')) return;
      var val = function (n) { var el = f.querySelector('[name="' + n + '"]'); return el ? el.value : ''; };
      if (window.fbq) fbq('track', 'Lead', { content_name: val('source') || document.title, content_category: val('campaign') });
    } catch (err) {}
  }, true);
})();
