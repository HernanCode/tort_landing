/* ============================================================
   TORT — Landing
   1. Moviment del hero lligat al scroll
   2. Carrusel de 3 imatges
   3. Navegació
   4. Formulari i avís de cookies (a totes les pàgines)
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  var hero = document.getElementById('hero');

  var nav = document.getElementById('nav');
  var navLogo = document.getElementById('navLogo');
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');

  /* Rutes relatives: cada pàgina declara el logo blanc; el fosc és la variant sense -white */
  var LOGO_LIGHT = navLogo ? navLogo.getAttribute('src') : '';
  var LOGO_DARK = LOGO_LIGHT ? LOGO_LIGHT.replace('-white.svg', '.svg') : '';

  /* ============================================================
     Navegació i menú (a qualsevol pàgina que els inclogui)
     ============================================================ */
  if (nav && navLogo && burger && menu) {
    /* ---------- Menú ---------- */
    var lastFocus = null;
    menu.inert = true;

    function setMenu(open) {
      root.classList.toggle('menu-open', open);
      document.dispatchEvent(new CustomEvent('tort:menu', { detail: { open: open } }));
      burger.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-hidden', String(!open));
      menu.inert = !open;
      burger.querySelector('.sr-only').textContent = open ? 'Tanca el menú' : 'Obre el menú';
      var bar = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = open ? 'hidden' : '';
      document.body.style.paddingRight = (open && bar > 0) ? bar + 'px' : '';
      nav.style.paddingRight = (open && bar > 0)
        ? (parseFloat(window.getComputedStyle(nav).paddingRight) + bar) + 'px'
        : '';
      navLogo.src = (open || !nav.classList.contains('is-solid')) ? LOGO_LIGHT : LOGO_DARK;

      if (open) {
        lastFocus = document.activeElement;
        var target = menu.querySelector('.menu__list a');
        if (target) {
          window.setTimeout(function () { target.focus({ preventScroll: true }); }, reduce ? 0 : 160);
        }
      } else {
        var back = (lastFocus && lastFocus !== document.body && document.contains(lastFocus)) ? lastFocus : burger;
        back.focus({ preventScroll: true });
        lastFocus = null;
      }
    }

    burger.addEventListener('click', function () { setMenu(!root.classList.contains('menu-open')); });
    document.addEventListener('click', function (e) {
      if (!root.classList.contains('menu-open')) return;
      if (e.target.closest('[data-close]')) setMenu(false);
    });

    /* Foco atrapat dins del panell; el botó de tancar també hi compta */
    document.addEventListener('keydown', function (e) {
      if (!root.classList.contains('menu-open')) return;
      if (e.key === 'Escape') { setMenu(false); return; }
      if (e.key !== 'Tab') return;

      /* Comprovem visibilitat real: el CTA de la barra s'amaga (visibility:hidden)
         quan el menú és obert i no ha d'entrar al cicle de tabulació */
      var mobileBar = document.querySelector('.mobile-bar');
      var focusables = Array.prototype.slice.call(nav.querySelectorAll('a[href], button')).concat(
        Array.prototype.slice.call(menu.querySelectorAll('a[href], button')),
        mobileBar ? Array.prototype.slice.call(mobileBar.querySelectorAll('a[href], button')) : []
      ).filter(function (el) {
        if (el === burger) return true;
        var cs = window.getComputedStyle(el);
        return cs.visibility !== 'hidden' && cs.display !== 'none' && el.getClientRects().length > 0;
      });

      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      var current = document.activeElement;

      if (!e.shiftKey && current === last) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && current === first) { e.preventDefault(); last.focus(); }
      else if (!menu.contains(current) && current !== burger) { e.preventDefault(); first.focus(); }
    });

  }

  /* ============================================================
     Portada: progrés del hero i barra sòlida
     ============================================================ */
  if (hero && nav && navLogo) {
    /* ---------- Progrés del hero + barra sòlida ---------- */
    function heroDistance() {
      return Math.max(1, hero.offsetHeight - window.innerHeight);
    }

    function paint() {
      var y = window.scrollY || window.pageYOffset;

      if (!reduce) {
        var p = Math.min(1, Math.max(0, y / heroDistance()));
        hero.style.setProperty('--p', p.toFixed(4));
      }

      var solid = y > heroDistance() - 80;
      if (solid !== nav.classList.contains('is-solid')) {
        nav.classList.toggle('is-solid', solid);
        navLogo.src = solid ? LOGO_DARK : LOGO_LIGHT;
      }
    }

    var ticking = false;
    function request() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { paint(); ticking = false; });
    }

    if (!reduce) {
      hero.style.setProperty('--p', '0');
      window.addEventListener('scroll', request, { passive: true });
      window.addEventListener('resize', request, { passive: true });
      paint();
    } else {
      nav.classList.add('is-solid');
      navLogo.src = LOGO_DARK;
    }

    /* ---------- Carrusel de vídeos del hero ---------- */
    var slides = [].slice.call(document.querySelectorAll('.hero__slide'));
    var dots = [].slice.call(document.querySelectorAll('.hero__dot'));
    var controls = document.querySelector('.hero__controls');
    var toggle = document.getElementById('heroToggle');
    var DELAY = 5200;
    var index = 0;
    var timer = null;
    var preloadTimer = null;
    var paused = false;
    var inView = true;

    var stack = document.querySelector('.hero__stack');
    var titleEl = stack ? stack.querySelector('.hero__title') : null;
    var subEl = stack ? stack.querySelector('.hero__sub') : null;
    var swapTimer = null;

    slides.forEach(function (slide) {
      var video = slide.querySelector('video');
      if (!video) return;
      video.addEventListener('playing', function () { slide.classList.add('is-playing'); });
      video.addEventListener('waiting', function () { slide.classList.remove('is-playing'); });
      video.addEventListener('stalled', function () { slide.classList.remove('is-playing'); });
    });

    var videoSize = window.matchMedia('(max-width: 900px)').matches ? '960' : '1280';
    var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    var slowConnection = connection && (connection.saveData || /(^|-)2g$/.test(connection.effectiveType || ''));
    var skipVideo = reduce || slowConnection;
    var booted = false;

    function swapText(i, animate) {
      var slide = slides[i];
      if (!slide || !titleEl || !subEl) return;

      var t = slide.getAttribute('data-title') || '';
      var s = slide.getAttribute('data-sub') || '';

      if (!animate || reduce) {
        titleEl.textContent = t;
        subEl.textContent = s;
        return;
      }

      stack.classList.add('is-changing');
      if (swapTimer) clearTimeout(swapTimer);
      swapTimer = setTimeout(function () {
        titleEl.textContent = t;
        subEl.textContent = s;
        stack.classList.remove('is-changing');
      }, 340);
    }

    function pauseAll() {
      slides.forEach(function (s) {
        var v = s.querySelector('video');
        if (v) v.pause();
      });
    }

    function playActive(reset) {
      slides.forEach(function (s, n) {
        var v = s.querySelector('video');
        if (!v) return;
        if (n === index && !reduce && !skipVideo && booted && !root.classList.contains('menu-open') && inView && !document.hidden && !paused) {
          if (reset) { try { v.currentTime = 0; } catch (err) {} }
          var playing = v.play();
          if (playing && playing.catch) playing.catch(function () {
            if (n !== index || paused) return;
            paused = true;
            if (controls) controls.classList.add('is-paused');
            if (toggle) {
              toggle.setAttribute('aria-pressed', 'true');
              toggle.setAttribute('aria-label', 'Reprèn la rotació de vídeos');
            }
            stop();
          });
        } else {
          v.pause();
        }
      });
    }

    function show(i, animate) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) {
        /* el slide que entra torna a ensenyar el poster fins que el vídeo arrenca;
           el que surt conserva l'últim frame durant el fundit */
        if (n === index) s.classList.remove('is-playing');
        s.classList.toggle('is-active', n === index);
      });
      dots.forEach(function (d, n) {
        d.classList.toggle('is-active', n === index);
        if (n === index) d.setAttribute('aria-current', 'true');
        else d.removeAttribute('aria-current');
      });
      swapText(index, animate);
      playActive(true);
      schedulePreload();
    }

    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    function start() {
      stop();
      if (!booted || skipVideo || reduce || paused || !inView || document.hidden || root.classList.contains('menu-open') || slides.length < 2) return;
      timer = setInterval(function () { show(index + 1, true); }, DELAY);
    }

    function preloadNext() {
      if (skipVideo || !booted || !inView || document.hidden || root.classList.contains('menu-open')) return;
      var next = (index + 1) % slides.length;
      var video = slides[next] ? slides[next].querySelector('video') : null;
      if (!video || video.readyState >= 3) return;
      try { video.preload = 'auto'; video.load(); } catch (err) {}
    }

    function schedulePreload() {
      if (preloadTimer) clearTimeout(preloadTimer);
      preloadTimer = window.setTimeout(preloadNext, 2500);
    }

    function addSources(video, n) {
      if (!video || video.querySelector('source')) return;
      var base = 'assets/videos/hero-' + n + '-' + videoSize;
      var mp4 = document.createElement('source');
      mp4.src = base + '.mp4';
      mp4.type = 'video/mp4';
      var webm = document.createElement('source');
      webm.src = base + '.webm';
      webm.type = 'video/webm';
      video.appendChild(mp4);
      video.appendChild(webm);
    }

    function bootVideos() {
      if (booted) return;
      booted = true;
      if (skipVideo) { pauseAll(); return; }
      slides.forEach(function (s, i) { addSources(s.querySelector('video'), i + 1); });
      playActive(false);
      start();
      schedulePreload();
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bootVideos);
    } else {
      bootVideos();
    }

    if (toggle && skipVideo) toggle.style.display = 'none';

    /* Passa al següent slide 0,3 s abans que acabi el vídeo, per no repetir l'últim frame */
    slides.forEach(function (slide) {
      var video = slide.querySelector('video');
      if (!video) return;
      video.addEventListener('timeupdate', function () {
        if (slide !== slides[index]) return;
        if (reduce || paused || !inView || document.hidden) return;
        if (!video.duration) return;
        if (video.duration - video.currentTime <= 0.3) {
          show(index + 1, true);
          start();
        }
      });
    });

    dots.forEach(function (d) {
      d.addEventListener('click', function () {
        show(parseInt(d.getAttribute('data-slide'), 10), true);
        start();
      });
    });

    if (controls && toggle) {
      toggle.addEventListener('click', function () {
        paused = !paused;
        controls.classList.toggle('is-paused', paused);
        toggle.setAttribute('aria-pressed', String(paused));
        toggle.setAttribute('aria-label', paused ? "Reprèn la rotació de vídeos" : "Atura la rotació de vídeos");
        if (paused) { stop(); pauseAll(); }
        else { playActive(false); start(); }
      });
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { stop(); pauseAll(); }
      else { playActive(false); start(); }
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (inView) { playActive(false); start(); }
        else { stop(); pauseAll(); }
      }, { threshold: 0 }).observe(hero);
    }

    document.addEventListener('tort:menu', function (e) {
      if (e.detail && e.detail.open) { stop(); pauseAll(); }
      else if (!paused) { playActive(false); start(); schedulePreload(); }
    });
  }

  /* ============================================================
     Pàgines interiors: la barra es torna sòlida en passar la capçalera
     ============================================================ */
  if (!hero && nav && navLogo) {
    var pageHero = document.querySelector('[data-page-hero]');

    if (!pageHero) {
      nav.classList.add('is-solid');
      navLogo.src = LOGO_DARK;
    } else {
      var paintPageNav = function () {
        var y = window.scrollY || window.pageYOffset;
        var limit = Math.max(40, pageHero.offsetHeight - 90);
        var solid = y > limit;
        if (solid !== nav.classList.contains('is-solid')) {
          nav.classList.toggle('is-solid', solid);
          navLogo.src = solid ? LOGO_DARK : LOGO_LIGHT;
        }
      };
      window.addEventListener('scroll', paintPageNav, { passive: true });
      window.addEventListener('resize', paintPageNav, { passive: true });
      paintPageNav();
    }
  }

  /* ============================================================
     Aparició en fer scroll — tot el que ve després del hero
     ============================================================ */
  if (!reduce && 'IntersectionObserver' in window) {
    /* Cada grup: selector, retard base (ms) i/o escalonat per element (ms) */
    var GROUPS = [
      { sel:'.section .kicker' },
      { sel:'.section .h-section', delay:80 },
      { sel:'.services-title, .services-lead', stagger:80 },
      { sel:'.featured-service', stagger:100 },
      { sel:'.compact-item', stagger:25 },
      { sel:'.feature__logos .logo-card', stagger:90 },
      { sel:'.creds-strip__list .cred', stagger:130 },
      { sel:'#residus .body, #residus .action', stagger:80 },
      { sel:'.materials li', stagger:34 },
      { sel:'#galeria .gallery figure', stagger:80 },
      { sel:'#ubicacio .map', delay:60 },
      { sel:'#ubicacio .grid-2 > div:last-child', delay:120 },
      { sel:'#contacte .cta__text' },
      { sel:'#contacte .form', delay:140 },
      /* Pàgines de servei */
      { sel:'.service-intro__text .lead, .service-intro__text .body', stagger:80 },
      { sel:'.service-intro__aside', delay:100 },
      { sel:'.steps .step', stagger:90 },
      { sel:'.faq details', stagger:60 },
      { sel:'.related li', stagger:60 },
      { sel:'.sectors li', stagger:60 },
      { sel:'.split__media', delay:70 },
      { sel:'.split__text .lead, .split__text .body', stagger:80 },
      { sel:'.cta--page', delay:60 },
      { sel:'.footer__grid > div', stagger:110 },
      { sel:'.footer__meta', delay:120 }
    ];

    var pending = [];

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin:'0px 0px -10% 0px', threshold:0 });

    /* Prepara els elements: els amaga i els posa a l'observador */
    GROUPS.forEach(function (g) {
      Array.prototype.slice.call(document.querySelectorAll(g.sel)).forEach(function (el, i) {
        if (el.classList.contains('reveal')) return;
        el.classList.add('reveal');
        if (g.stagger) el.style.setProperty('--reveal-delay', (i * g.stagger / 1000) + 's');
        else if (g.delay) el.style.setProperty('--reveal-delay', (g.delay / 1000) + 's');
        pending.push(el);
        observer.observe(el);
      });
    });

    root.classList.add('reveal-on');

    /* Xarxa de seguretat: en arribar al final de la pàgina, mostra el que quedi
       (si no, un element que descansa dins de la franja inferior no es revelaria mai) */
    var atBottom = false;
    function flushBottom() {
      if (atBottom || !pending.length) return;
      if (window.innerHeight + window.scrollY < document.documentElement.scrollHeight - 4) return;
      atBottom = true;
      pending.forEach(function (el) {
        el.style.setProperty('--reveal-delay', '0s');
        el.classList.add('is-in');
      });
      pending = [];
    }
    window.addEventListener('scroll', flushBottom, { passive:true });
  }

  /* ---------- Any del peu ---------- */
  var any = document.getElementById('any');
  if (any) any.textContent = new Date().getFullYear();

  /* ---------- Formulari de contacte ---------- */
  var lead = document.getElementById('lead');
  if (lead) {
    lead.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!lead.checkValidity()) { lead.reportValidity(); return; }
      var ok = document.getElementById('ok');
      if (ok) ok.classList.add('show');
      var btn = lead.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
    });
  }

  /* ---------- Avís de cookies ---------- */
  var cookieBox = document.getElementById('cookies');
  if (cookieBox) {
    var KEY = 'tort-cookies';
    var stored = null;
    try { stored = localStorage.getItem(KEY); } catch (err) { stored = null; }
    if (!stored) cookieBox.hidden = false;

    cookieBox.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-cookies]');
      if (!btn) return;
      try { localStorage.setItem(KEY, btn.getAttribute('data-cookies')); } catch (err) {}
      cookieBox.hidden = true;
    });
  }
})();
