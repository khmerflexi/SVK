// === ផ្នែកទី១៖ Dgsar Popup (scroll 20%) ===
(function() {
  var popup = document.getElementById('dgsar-popup');
  if (!popup) return;
  var rpShown = false;

  function showDgsarPopup() {
    if (rpShown) return;
    rpShown = true;
    popup.style.display = 'flex';
    popup.style.opacity = '0';
    setTimeout(function() {
      popup.style.transition = 'opacity 0.4s ease';
      popup.style.opacity = '1';
    }, 10);
    window.removeEventListener('scroll', checkDgsarScroll);
  }

  function checkDgsarScroll() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    if ((scrollTop / docHeight) * 100 >= 20) showDgsarPopup();
  }

  window.addEventListener('scroll', checkDgsarScroll, { passive: true });

  document.addEventListener('click', function(e) {
    if (e.target === popup) closeDgsarPopup();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeDgsarPopup();
  });
})();

function closeDgsarPopup() {
  var popup = document.getElementById('dgsar-popup');
  if (!popup) return;
  popup.style.opacity = '0';
  setTimeout(function() { popup.style.display = 'none'; }, 400);
}

// === ផ្នែកទី២៖ Custom Popup (scroll 30%) — គ្មាន overlay ===
(function() {
  // ✅ លាក់ overlay ទាំងស្រុង
  var overlay = document.getElementById('custom-popup-overlay');
  if (overlay) overlay.style.display = 'none';

  var box = document.getElementById('custom-popup-box');
  if (!box) return;

  var shown  = false;
  var closed = false;

  // ✅ Box style — fixed corner
  box.style.cssText += ';position:fixed!important;bottom:20px;right:20px;'
    + 'z-index:99999;opacity:0;pointer-events:auto;'
    + 'box-shadow:0 8px 30px rgba(0,0,0,0.2);border-radius:12px;'
    + 'animation:none;display:none;';

  function showCustomPopup() {
    if (shown || closed) return;
    shown = true;
    window.removeEventListener('scroll', checkCustomScroll);

    box.style.display   = 'block';
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
    setTimeout(function() { box.style.display = 'none'; }, 300);
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

  // ✅ ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeCustomPopup();
  });

})();
