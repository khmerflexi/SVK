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
  var box = document.getElementById('custom-popup-box');
  if (!overlay || !box) { return; }

  var SHOW_AT = 30; // % scroll
  var shown = false;
  var closed = false;

  box.style.opacity = '0';
  box.style.animation = 'none';

  function showCustomPopup() {
    shown = true;
    window.removeEventListener('scroll', checkCustomScroll);

    overlay.style.display = 'flex';
    box.style.transform = 'scale(0.9)';
    void box.offsetWidth; // បង្ខំ browser គណនា style មុន

    box.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    box.style.opacity = '1';
    box.style.transform = 'scale(1)';
  }

  function checkCustomScroll() {
    if (shown || closed) { return; }
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (docHeight <= 0) { return; }

    if ((scrollTop / docHeight) * 100 >= SHOW_AT) {
      showCustomPopup();
    }
  }

  function closePopup() {
    closed = true;
    overlay.style.display = 'none';
    window.removeEventListener('scroll', checkCustomScroll);
  }

  window.addEventListener('scroll', checkCustomScroll, { passive: true });

  var closeBtn = document.getElementById('popup-close-btn');
  if (closeBtn) { closeBtn.addEventListener('click', closePopup); }
})();









