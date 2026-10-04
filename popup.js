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








/* Audio Reader — អានអត្ថបទជាភាសាខ្មែរ (Web Speech API) */
(function () {
  var src = document.querySelector('.post-body') || document.querySelector('article');
  if (!src) { return; }

  var css = '' +
    '#tts-bar{position:fixed;left:0;right:0;bottom:0;z-index:9000;background:#fff;' +
    'box-shadow:0 -3px 14px rgba(0,0,0,.12);text-align:center;box-sizing:border-box;' +
    'padding:14px 84px 14px 14px;padding-bottom:calc(14px + env(safe-area-inset-bottom,0px));' +
    'font-family:"Kantumruy Pro",sans-serif}' +
    '#tts-btn{position:absolute;right:16px;top:-74px;width:58px;height:58px;' +
    'border-radius:50%;border:none;background:#0a0a0a;cursor:pointer;display:flex;align-items:center;' +
    'justify-content:center;padding:0;box-shadow:0 0 0 6px #e2e8f0,0 6px 16px rgba(0,0,0,.25);' +
    'transition:transform .2s}' +
    '#tts-btn:active{transform:scale(.92)}' +
    '#tts-btn svg{width:24px;height:24px;fill:#fff}' +
    '#tts-btn.playing{box-shadow:0 0 0 6px #ffd2b8,0 6px 16px rgba(0,0,0,.25)}' +
    '#tts-msg{font-size:13px;color:#444;display:block;line-height:1.4;text-align:left}' +
    '#tts-prog{position:absolute;left:0;right:0;bottom:0;height:3px;background:#eee}' +
    '#tts-prog i{display:block;height:100%;width:0;background:#f60;transition:width .3s}' +
    'body{padding-bottom:70px!important}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  var PLAY = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
  var PAUSE = '<svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';

  var bar = document.createElement('div');
  bar.id = 'tts-bar';
  bar.innerHTML = '<button id="tts-btn" aria-label="Play">' + PLAY + '</button>' +
    '<span id="tts-msg">ចុច ▶ ដើម្បីស្តាប់អត្ថបទ</span><div id="tts-prog"><i></i></div>';
  document.body.appendChild(bar);

  var btn = document.getElementById('tts-btn');
  var msg = document.getElementById('tts-msg');
  var fill = bar.querySelector('#tts-prog i');
  var synth = ('speechSynthesis' in window) ? window.speechSynthesis : null;
  var chunks = [], idx = 0, playing = false, sid = 0;

  function buildChunks() {
    var c = src.cloneNode(true);
    c.querySelectorAll('script,style,pre,iframe,#custom-popup-overlay,#reading-popup,#tts-bar').forEach(function (n) { n.remove(); });
    var text = c.textContent.replace(/\s+/g, ' ').trim();
    var parts = text.match(/[^។៕?!.]+[។៕?!.]?/g) || [text];
    var out = [], cur = '';
    parts.forEach(function (p) {
      if ((cur + p).length > 170 && cur) { out.push(cur); cur = p; } else { cur += p; }
    });
    if (cur) { out.push(cur); }
    return out;
  }

  function getKhmerVoice() {
    if (!synth) { return null; }
    var v = synth.getVoices();
    for (var i = 0; i < v.length; i++) { if (/^km/i.test(v[i].lang)) { return v[i]; } }
    return v.length ? null : undefined; // null = មានសំឡេងផ្សេង តែគ្មានខ្មែរ, undefined = មិនទាន់ផ្ទុក
  }

  function setUI(on) {
    playing = on;
    btn.innerHTML = on ? PAUSE : PLAY;
    btn.classList.toggle('playing', on);
  }

  function speak(mySid) {
    if (mySid !== sid || !playing) { return; }
    if (idx >= chunks.length) { idx = 0; setUI(false); msg.textContent = 'អានចប់ហើយ'; fill.style.width = '100%'; return; }
    var u = new SpeechSynthesisUtterance(chunks[idx]);
    u.lang = 'km-KH';
    u.rate = 0.95;
    var kv = getKhmerVoice();
    if (kv) { u.voice = kv; }
    u.onend = function () {
      if (mySid !== sid) { return; }
      idx++;
      fill.style.width = Math.round(idx / chunks.length * 100) + '%';
      speak(mySid);
    };
    u.onerror = function (e) {
      if (mySid !== sid || e.error === 'canceled' || e.error === 'interrupted') { return; }
      setUI(false);
      msg.textContent = 'មិនអាចអានបាន (' + e.error + ')';
    };
    synth.speak(u);
  }

  function start() {
    if (!synth) {
      msg.textContent = 'កម្មវិធីបើកនេះមិនគាំទ្រការអាន — សូមបើកក្នុង Chrome';
      return;
    }
    if (!chunks.length) { chunks = buildChunks(); }
    if (getKhmerVoice() === null) {
      msg.textContent = 'ឧបករណ៍នេះមិនមានសំឡេងខ្មែរ — សូមសាកល្បងលើ Chrome ទូរសព្ទ Android';
      return;
    }
    sid++;
    setUI(true);
    msg.textContent = 'កំពុងអាន… ចុចម្តងទៀតដើម្បីផ្អាក';
    synth.cancel();
    speak(sid);
  }

  function pause() {
    sid++;
    if (synth) { synth.cancel(); }
    setUI(false);
    msg.textContent = 'ផ្អាក — ចុច ▶ ដើម្បីបន្ត';
  }

  btn.addEventListener('click', function () { playing ? pause() : start(); });
  window.addEventListener('pagehide', function () { if (synth) { synth.cancel(); } });
  if (synth && synth.onvoiceschanged !== undefined) { synth.onvoiceschanged = function () {}; }
})();
