// === ផ្នែកទី១៖ កូដ Reading Popup (លោតពេល Scroll បាន 20% រាល់ពេល Refresh) ===
(function() {
  var popup = document.getElementById('reading-popup');
  if (!popup) { return; }

  var rpShown = false; // ចងចាំតែក្នុងទំព័រនេះ (បាត់ពេល Refresh)

  function showReadingPopup() {
    if (rpShown) { return; }
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
    if (docHeight <= 0) { return; }

    var scrolledPercent = (scrollTop / docHeight) * 100;
    if (scrolledPercent >= 20) {
      showReadingPopup();
    }
  }

  window.addEventListener('scroll', checkReadingScroll, { passive: true });

  document.addEventListener('click', function(e) {
    if (e.target === popup) { closeReadingPopup(); }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { closeReadingPopup(); }
  });
})();

function closeReadingPopup() {
  var popup = document.getElementById('reading-popup');
  if (!popup) { return; }
  popup.style.opacity = '0';
  setTimeout(function() { popup.style.display = 'none'; }, 400);
}


// === ផ្នែកទី២៖ កូដ Custom Popup (លោតពេល Scroll បាន 30%) ===
(function() {
  var overlay = document.getElementById('custom-popup-overlay');
  if (!overlay) { return; }

  var popupShown = false;

  function showCustomPopup() {
    overlay.style.display = 'flex';
    popupShown = true;
    window.removeEventListener('scroll', checkCustomScroll);
  }

  function checkCustomScroll() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (docHeight <= 0) { return; }

    var scrollPercent = (scrollTop / docHeight) * 100;
    if (scrollPercent >= 30 && !popupShown) {
      showCustomPopup();
    }
  }

  window.addEventListener('scroll', checkCustomScroll, { passive: true });

  var closeBtn = document.getElementById('popup-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      overlay.style.display = 'none';
    });
  }

  overlay.addEventListener('click', function(event) {
    if (event.target === this) {
      this.style.display = 'none';
    }
  });
})();
