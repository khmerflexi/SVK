/* =========================================================
   popup.js — គ្រប់គ្រង Popup ពីរ៖
   ១. #reading-popup        (លោតពេល scroll 20%, ផ្ទៃថ្លា, click-through)
   ២. #custom-popup-overlay (លោតពេល scroll 30%, ជ្រុងក្រោមស្តាំ, គ្មាន dim)
   ========================================================= */

/* ---------- ១. READING POPUP (scroll 20%) ---------- */
(function () {
  var popup = document.getElementById('reading-popup');
  if (!popup) { return; }

  var box = document.getElementById('reading-popup-box');
  var shown = false;

  function showReadingPopup() {
    if (shown) { return; }
    shown = true;
    window.removeEventListener('scroll', checkReadingScroll);

    popup.style.display = 'flex';
    popup.style.background = 'transparent'; // ✅ គ្មានផ្ទៃងងឹត
    popup.style.pointerEvents = 'none';      // ✅ ចុច/scroll ទំព័រខាងក្រោយបាន
    if (box) { box.style.pointerEvents = 'auto'; } // ✅ ប្រអប់ខាងក្នុងចុចបាន

    popup.style.opacity = '0';
    requestAnimationFrame(function () {
      popup.style.transition = 'opacity 0.4s ease';
      popup.style.opacity = '1';
    });
  }

  function checkReadingScroll() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) { return; }
    if ((scrollTop / docHeight) * 100 >= 20) { showReadingPopup(); }
  }

  window.addEventListener('scroll', checkReadingScroll, { passive: true });

  // ✅ ចុចក្រៅប្រអប់ = បិទ (ដំណើរការបានតែពេល pointer-events: auto លើ overlay)
  popup.addEventListener('click', function (e) {
    if (e.target === popup) { window.closeReadingPopup(); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && popup.style.display === 'flex') {
      window.closeReadingPopup();
    }
  });

  // ✅ Global function — ត្រូវការសម្រាប់ onclick="closeReadingPopup()" ក្នុង HTML
  window.closeReadingPopup = function () {
    popup.style.opacity = '0';
    setTimeout(function () {
      popup.style.display = 'none';
      popup.style.pointerEvents = 'none';
    }, 400);
  };
})();


/* ---------- ២. CUSTOM POPUP (scroll 30%, គ្មាន overlay dim) ---------- */
(function () {
  var overlay = document.getElementById('custom-popup-overlay');
  var box = document.getElementById('custom-popup-box');
  if (!overlay || !box) { return; }

  var shown = false;
  var closed = false;

  // ✅ Override positioning — ជ្រុងក្រោមស្តាំ, ផ្ទៃថ្លា
  overlay.style.cssText =
    'position:fixed!important;bottom:20px!important;right:20px!important;' +
    'left:auto!important;top:auto!important;' +
    'z-index:99999!important;background:transparent!important;' +
    'display:none;pointer-events:none;width:auto;height:auto;' +
    'align-items:unset;justify-content:unset;padding:0;';

  box.style.pointerEvents = 'auto';
  box.style.opacity = '0';

  function showCustomPopup() {
    if (shown || closed) { return; }
    shown = true;
    window.removeEventListener('scroll', checkCustomScroll);

    overlay.style.display = 'block';
    box.style.transform = 'scale(0.9) translateY(20px)';
    void box.offsetWidth; // force reflow មុនចាប់ផ្តើម animation
    box.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    box.style.opacity = '1';
    box.style.transform = 'scale(1) translateY(0)';
  }

  function closeCustomPopup() {
    closed = true;
    box.style.opacity = '0';
    box.style.transform = 'scale(0.9) translateY(20px)';
    setTimeout(function () {
      overlay.style.display = 'none';
    }, 300);
    window.removeEventListener('scroll', checkCustomScroll);
  }

  function checkCustomScroll() {
    if (shown || closed) { return; }
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (docHeight <= 0) { return; }
    if ((scrollTop / docHeight) * 100 >= 30) { showCustomPopup(); }
  }

  window.addEventListener('scroll', checkCustomScroll, { passive: true });

  var closeBtn = document.getElementById('popup-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeCustomPopup);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && shown && !closed) { closeCustomPopup(); }
  });
})();
