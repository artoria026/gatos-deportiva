/* ════════════════════════════════════════════════════
   GATOS DEPORTIVA — script.js
   • Nav: transparente → blanco al hacer scroll
   • Scroll animations con IntersectionObserver
   • Counter animation en stat cards
   • Copy CLABE con feedback visual
   • Float button oculto cerca del footer
   ════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. Nav scroll ─────────────────────────── */
  var nav = document.getElementById('mainNav');
  if (nav) {
    function updateNav() {
      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  /* ── 2. Scroll-triggered fade-in ───────────── */
  var scrollEls = document.querySelectorAll('.anim.scroll');
  if (scrollEls.length && 'IntersectionObserver' in window) {
    var scrollObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          scrollObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

    scrollEls.forEach(function (el) { scrollObs.observe(el); });
  } else {
    // fallback: mostrar todo si no hay soporte
    scrollEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── 3. Stat counter animation ─────────────── */
  var countersDone = false;
  var statsGrid = document.querySelector('.stats-grid');

  function runCounters() {
    if (countersDone) return;
    countersDone = true;

    document.querySelectorAll('.stat-num[data-target]').forEach(function (el) {
      var target   = parseInt(el.dataset.target, 10);
      var suffix   = el.dataset.suffix || '';
      var duration = 1100;
      var start    = null;

      function tick(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased    = 1 - Math.pow(1 - progress, 3); // cubic ease-out
        el.textContent = Math.floor(eased * target) + (progress >= 1 ? suffix : '');
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  if (statsGrid && 'IntersectionObserver' in window) {
    var counterObs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        runCounters();
        counterObs.disconnect();
      }
    }, { threshold: 0.25 });
    counterObs.observe(statsGrid);
  }

  /* ── 4. Copy CLABE ──────────────────────────── */
  var copyBtn = document.getElementById('copyClabe');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var clabe       = '072150013265265827';
      var btn         = this;
      var txtEl       = btn.querySelector('.copy-txt');
      var icoEl       = btn.querySelector('.copy-ico');
      var origTxt     = txtEl ? txtEl.textContent : btn.textContent;
      var origIco     = icoEl ? icoEl.textContent : '';
      var isAnimating = false;

      if (isAnimating) return;

      function onSuccess() {
        isAnimating = true;
        btn.classList.add('copied');
        if (txtEl) txtEl.textContent = '¡CLABE copiada!';
        if (icoEl) icoEl.textContent = '✓';

        // Animar el campo CLABE brevemente
        var clabeEl = document.getElementById('clabeVal');
        if (clabeEl) {
          clabeEl.style.transition = 'background .2s, color .2s';
          clabeEl.style.background = '#d4f0d4';
          clabeEl.style.color      = '#2a6a2a';
          setTimeout(function () {
            clabeEl.style.background = '';
            clabeEl.style.color      = '';
          }, 1800);
        }

        setTimeout(function () {
          btn.classList.remove('copied');
          if (txtEl) txtEl.textContent = origTxt;
          if (icoEl) icoEl.textContent = origIco;
          isAnimating = false;
        }, 2500);
      }

      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = clabe;
        ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try {
          document.execCommand('copy');
          onSuccess();
        } catch (e) {
          alert('Copia manualmente la CLABE: ' + clabe);
        }
        document.body.removeChild(ta);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(clabe).then(onSuccess, fallback);
      } else {
        fallback();
      }
    });
  }

  /* ── 5. Float button oculto cerca del footer ── */
  var floatBtn = document.getElementById('floatBtn');
  var footer   = document.querySelector('.footer');

  if (floatBtn && footer && 'IntersectionObserver' in window) {
    var footerObs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        floatBtn.classList.add('hidden');
      } else {
        floatBtn.classList.remove('hidden');
      }
    }, { threshold: 0.05 });
    footerObs.observe(footer);
  }

  /* ── 6. Cerrar nav links al navegar (mobile) ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function () {
      // el scroll-behavior: smooth del CSS maneja la animación
    });
  });

})();
