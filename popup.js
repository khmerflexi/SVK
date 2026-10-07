// === ផ្នែកទី១៖ Reading Popup (scroll 20%) ===
(function() {
  var popup = document.getElementById('reading-popup');
  if (!popup) return;

  var rpShown = false;

  function showReadingPopup() {
    if (rpShown) return;
    rpShown = true;
    popup.style.display = 'flex';
    popup.style.opacity = '0';
    setTimeout(function() {
      popup.style.transition = 'opacity 0.4s ease';
      popup.style.opacity = '1';
    }, 10);
    window.removeEventListener('scroll', checkReadingScroll);
  }

  function checkReadingScroll() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    if ((scrollTop / docHeight) * 100 >= 20) showReadingPopup();
  }

  window.addEventListener('scroll', checkReadingScroll, { passive: true });

  // ✅ Click overlay to close
  document.addEventListener('click', function(e) {
    if (e.target === popup) closeReadingPopup();
  });

  // ✅ ESC to close
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeReadingPopup();
  });
})();

function closeReadingPopup() {
  var popup = document.getElementById('reading-popup');
  if (!popup) return;
  popup.style.opacity = '0';
  setTimeout(function() { popup.style.display = 'none'; }, 400);
}

// === ផ្នែកទី២៖ Custom Popup (scroll 30%) — គ្មាន overlay ===
(function() {
  var box = document.getElementById('custom-popup-box');
  if (!box) return;

  var shown  = false;
  var closed = false;

  // ✅ លាក់ overlay ពេញ — show box តែមួយ
  var overlay = document.getElementById('custom-popup-overlay');
  if (overlay) {
    overlay.style.background    = 'transparent'; // ✅ គ្មាន dim
    overlay.style.pointerEvents = 'none';        // ✅ click through
  }

  box.style.opacity  = '0';
  box.style.animation = 'none';
  // ✅ box ស្ថិតនៅ fixed corner — pointerEvents auto
  box.style.pointerEvents = 'auto';
  box.style.position = 'fixed';
  box.style.bottom   = '20px';
  box.style.right    = '20px';
  box.style.zIndex   = '99999';

  function showCustomPopup() {
    if (shown || closed) return;
    shown = true;
    window.removeEventListener('scroll', checkCustomScroll);

    // ✅ show overlay (transparent) + animate box
    if (overlay) overlay.style.display = 'flex';

    box.style.transform = 'scale(0.9) translateY(20px)';
    void box.offsetWidth;
    box.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    box.style.opacity    = '1';
    box.style.transform  = 'scale(1) translateY(0)';
  }

  function checkCustomScroll() {
    if (shown || closed) return;
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight
                  - document.documentElement.clientHeight;
    if (docHeight <= 0) return;
    if ((scrollTop / docHeight) * 100 >= 30) showCustomPopup();
  }

  function closePopup() {
    closed = true;
    box.style.opacity   = '0';
    box.style.transform = 'scale(0.9) translateY(20px)';
    setTimeout(function() {
      if (overlay) overlay.style.display = 'none';
    }, 300);
    window.removeEventListener('scroll', checkCustomScroll);
  }

  window.addEventListener('scroll', checkCustomScroll, { passive: true });

  var closeBtn = document.getElementById('popup-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closePopup);

})();
