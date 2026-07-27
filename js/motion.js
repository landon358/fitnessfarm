/* Fitness Farm Charlevoix — motion layer (GSAP + ScrollTrigger)
   Declarative: add data-anim="..." to any element.
   words | fade | stagger | img | count | marquee | parallax
   Modifiers: data-delay="0.2"  data-now (play on load, no scroll trigger) */
(function () {
  var W = window;
  var FF = (W.FFMotion = W.FFMotion || {});
  var registered = false;

  function reduced() {
    return W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function splitWords(el) {
    if (el.getAttribute('data-ff-split') === '1') {
      return Array.prototype.slice.call(el.querySelectorAll('.ff-w'));
    }
    var text = el.textContent;
    el.textContent = '';
    var out = [];
    text.split(/(\s+)/).forEach(function (tok) {
      if (tok === '') return;
      if (/^\s+$/.test(tok)) {
        el.appendChild(document.createTextNode(' '));
        return;
      }
      var mask = document.createElement('span');
      mask.style.display = 'inline-block';
      mask.style.overflow = 'hidden';
      mask.style.verticalAlign = 'bottom';
      mask.style.paddingBottom = '0.14em';
      mask.style.marginBottom = '-0.14em';
      var inner = document.createElement('span');
      inner.className = 'ff-w';
      inner.style.display = 'inline-block';
      inner.style.willChange = 'transform';
      inner.textContent = tok;
      mask.appendChild(inner);
      el.appendChild(mask);
      out.push(inner);
    });
    el.setAttribute('data-ff-split', '1');
    return out;
  }

  function trig(el, now, start) {
    if (now) return null;
    return { trigger: el, start: start || 'top 88%', once: true };
  }

  function fmt(v, d) {
    return d > 0 ? v.toFixed(d) : String(Math.round(v));
  }

  FF.init = function (root) {
    var gsap = W.gsap;
    if (!gsap) return;
    if (!registered && W.ScrollTrigger) {
      gsap.registerPlugin(W.ScrollTrigger);
      registered = true;
    }
    var scope = root || document;
    var nodes = scope.querySelectorAll('[data-anim]:not([data-ff-done])');
    if (!nodes.length) return;

    Array.prototype.forEach.call(nodes, function (el) {
      el.setAttribute('data-ff-done', '1');
      var kind = el.getAttribute('data-anim');
      var delay = parseFloat(el.getAttribute('data-delay') || '0') || 0;
      var now = el.hasAttribute('data-now');
      var st = trig(el, now, el.getAttribute('data-start'));

      if (reduced()) {
        el.style.opacity = '1';
        if (kind === 'stagger') {
          Array.prototype.forEach.call(el.children, function (c) { c.style.opacity = '1'; });
        }
        return;
      }

      if (kind === 'words') {
        var words = splitWords(el);
        el.style.opacity = '1';
        gsap.from(words, {
          yPercent: 118, duration: 1.0, ease: 'expo.out',
          stagger: 0.05, delay: delay, scrollTrigger: st
        });
      } else if (kind === 'fade') {
        gsap.fromTo(el, { opacity: 0, y: 24 }, {
          opacity: 1, y: 0, duration: 0.95, ease: 'power3.out',
          delay: delay, scrollTrigger: st
        });
      } else if (kind === 'stagger') {
        var kids = Array.prototype.slice.call(el.children);
        el.style.opacity = '1';
        gsap.fromTo(kids, { opacity: 0, y: 28 }, {
          opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
          stagger: 0.085, delay: delay, scrollTrigger: st
        });
      } else if (kind === 'img') {
        el.style.opacity = '1';
        gsap.fromTo(el,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.out', delay: delay, scrollTrigger: st });
        var inner = el.querySelector('img, [data-anim-inner]');
        if (inner) {
          gsap.fromTo(inner, { scale: 1.14 }, { scale: 1, duration: 1.6, ease: 'expo.out', delay: delay, scrollTrigger: st });
        }
      } else if (kind === 'count') {
        var to = parseFloat(el.getAttribute('data-to') || '0') || 0;
        var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var obj = { v: 0 };
        el.style.opacity = '1';
        gsap.to(obj, {
          v: to, duration: 1.4, ease: 'power2.out', delay: delay,
          scrollTrigger: trig(el, now, 'top 92%'),
          onUpdate: function () { el.textContent = fmt(obj.v, dec) + suffix; }
        });
      } else if (kind === 'marquee') {
        var track = el.firstElementChild;
        if (!track) return;
        el.style.opacity = '1';
        var speed = parseFloat(el.getAttribute('data-speed') || '38') || 38;
        gsap.to(track, { xPercent: -50, duration: speed, ease: 'none', repeat: -1 });
      } else if (kind === 'parallax') {
        el.style.opacity = '1';
        var amt = parseFloat(el.getAttribute('data-amount') || '14') || 14;
        if (!W.ScrollTrigger) return;
        gsap.to(el, {
          yPercent: amt, ease: 'none',
          scrollTrigger: { trigger: el.parentElement || el, start: 'top top', end: 'bottom top', scrub: true }
        });
      }
    });

    if (W.ScrollTrigger) W.ScrollTrigger.refresh();
  };

  FF.safety = function () {
    Array.prototype.forEach.call(document.querySelectorAll('[data-anim]'), function (el) {
      if (!el.hasAttribute('data-ff-done')) {
        el.style.opacity = '1';
        Array.prototype.forEach.call(el.children, function (c) { c.style.opacity = '1'; });
      }
    });
  };

  function boot() {
    FF.init();
    [150, 500, 1200, 2200].forEach(function (t) { setTimeout(function () { FF.init(); }, t); });
    setTimeout(FF.safety, 3200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  W.addEventListener('load', function () { FF.init(); if (W.ScrollTrigger) W.ScrollTrigger.refresh(); });
})();
