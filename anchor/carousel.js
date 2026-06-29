/* Anchor — "See it" carousel.
   Operates on static markup: every slide is in the DOM already (first one
   visible without JS); this just toggles the active slide, the caption strip,
   the counter and the dots, and autoplays unless the visitor prefers reduced motion. */
(function () {
  var root = document.querySelector('[data-carousel]');
  if (!root) return;

  var slides = Array.prototype.slice.call(root.querySelectorAll('.carousel__slide'));
  var dots = Array.prototype.slice.call(root.querySelectorAll('.carousel__dot'));
  var kindEl = root.querySelector('[data-carousel-kind]');
  var capEl = root.querySelector('[data-carousel-cap]');
  var counterEl = root.querySelector('[data-carousel-counter]');
  var prevBtn = root.querySelector('[data-carousel-prev]');
  var nextBtn = root.querySelector('[data-carousel-next]');
  if (slides.length === 0) return;

  var i = 0;
  var total = slides.length;
  var pad = function (n) { return String(n).padStart(2, '0'); };

  function render() {
    slides.forEach(function (s, idx) { s.classList.toggle('is-active', idx === i); });
    dots.forEach(function (d, idx) {
      var on = idx === i;
      d.classList.toggle('is-active', on);
      d.setAttribute('aria-current', on ? 'true' : 'false');
    });
    var active = slides[i];
    if (kindEl) kindEl.textContent = active.getAttribute('data-kind') || '';
    if (capEl) capEl.textContent = active.getAttribute('data-cap') || '';
    if (counterEl) counterEl.textContent = pad(i + 1) + ' / ' + pad(total);
  }

  function go(n) { i = ((n % total) + total) % total; render(); }

  if (prevBtn) prevBtn.addEventListener('click', function () { go(i - 1); stop(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { go(i + 1); stop(); });
  dots.forEach(function (d, idx) {
    d.addEventListener('click', function () { go(idx); stop(); });
  });

  var timer = null;
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function start() {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    timer = setInterval(function () { go(i + 1); }, 5000);
  }

  render();
  start();
})();
