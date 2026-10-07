/ === Reading Popup (scroll 20%) ===
(function() {
  var popup = document.getElementById('reading-popup');
  if (!popup) return;
  var rpShown = false;

  function showReadingPopup() {
  if (rpShown) return;
  rpShown = true;
  popup.style.display   = 'flex';
  popup.style.background = 'transparent'; // ✅ លុប dim
  popup.style.pointerEvents = 'none';     // ✅ click through
  var box = document.getElementById('reading-popup-box');
  if (box) box.style.pointerEvents = 'auto'; // ✅ box click OK
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

  document.addEventListener('click', function(e) {
    if (e.target === popup) closeReadingPopup();
  });
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

// === Custom Popup (scroll 30%) — គ្មាន overlay ===
(function() {
  var overlay = document.getElementById('custom-popup-overlay');
  var box     = document.getElementById('custom-popup-box');
  if (!box) return;

  var shown = false, closed = false;

  // ✅ Override overlay — fixed corner transparent
  if (overlay) {
    overlay.style.cssText =
      'position:fixed!important;bottom:20px!important;right:20px!important;'
      + 'z-index:99999!important;background:transparent!important;'
      + 'display:none;pointer-events:none;width:auto;height:auto;'
      + 'align-items:unset;justify-content:unset;';
  }

  box.style.pointerEvents = 'auto';
  box.style.opacity       = '0';

  function showCustomPopup() {
    if (shown || closed) return;
    shown = true;
    window.removeEventListener('scroll', checkCustomScroll);

    if (overlay) overlay.style.display = 'block';
    box.style.transform = 'scale(0.9) translateY(20px)';
    void box.offsetWidth;
    box.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    box.style.opacity    = '1';
    box.style.transform  = 'scale(1) translateY(0)';
  }

  function closeCustomPopup() {
    closed = true;
    box.style.opacity   = '0';
    box.style.transform = 'scale(0.9) translateY(20px)';
    setTimeout(function() {
      if (overlay) overlay.style.display = 'none';
    }, 300);
    window.removeEventListener('scroll', checkCustomScroll);
  }

  function checkCustomScroll() {
    if (shown || closed) return;
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight
                  - document.documentElement.clientHeight;
    if (docHeight <= 0) return;
    if ((scrollTop / docHeight) * 100 >= 30) showCustomPopup();
  }

  window.addEventListener('scroll', checkCustomScroll, { passive: true });

  var closeBtn = document.getElementById('popup-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeCustomPopup);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeCustomPopup();
  });
})();
