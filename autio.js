/* Read Post — អានអត្ថបទជាភាសាខ្មែរ
   ចំណាំ៖ គ្មានសញ្ញា < > && ក្នុងកូដនេះ ដើម្បីកុំឱ្យ Blogger បំប្លែងធ្វើឱ្យខូច */
(function () {
  var AMP = '\u0026';
  var HOSTS = [
    'https://translate.google.com/translate_tts',
    'https://translate.googleapis.com/translate_tts'
  ];
  var synth = window.speechSynthesis || null;
  var reading = false;
  var sid = 0;
  var audioEl = null;

  function $(id) { return document.getElementById(id); }

  function say(t) {
    var s = $('read-audio-status');
    if (s) { s.textContent = t || ''; }
  }

  function setBtn(on) {
    var b = $('read-audio-btn');
    if (!b) { return; }
    b.textContent = on ? '⏹ បញ្ឈប់ការអាន' : '🔊 ស្តាប់អត្ថបទនេះ';
    b.style.background = on ? '#e53935' : '#4CAF50';
  }

  function stopRead(message) {
    sid++;
    reading = false;
    if (synth) { synth.cancel(); }
    if (audioEl) { audioEl.pause(); audioEl = null; }
    setBtn(false);
    say(message || '');
  }

  // រកសំឡេងខ្មែរក្នុងឧបករណ៍
  function findVoice() {
    if (!synth) { return null; }
    var list = synth.getVoices() || [];
    var found = null;
    list.forEach(function (v) {
      if (found) { return; }
      var l = String(v.lang || '').toLowerCase().replace('_', '-');
      var n = String(v.name || '').toLowerCase();
      if (l.indexOf('km') === 0 || n.indexOf('khmer') !== -1) { found = v; }
    });
    return found;
  }

  // ចំណាំ៖ ប្រើ Math.floor(x / 170) !== 0 ជំនួស "x ធំជាង 170"
  function splitLong(s, out) {
    s = s.trim();
    while (Math.floor(s.length / 170) !== 0) {
      var cut = s.lastIndexOf(' ', 170);
      if (cut === -1 || Math.floor(cut / 60) === 0) { cut = 170; }
      out.push(s.slice(0, cut));
      s = s.slice(cut).trim();
    }
    if (s) { out.push(s); }
  }

  function getChunks() {
    var post = document.querySelector('.post-body') || document.querySelector('article');
    if (!post) { return []; }
    var c = post.cloneNode(true);
    var junk = c.querySelectorAll('script,style,pre,iframe,#read-audio-box,#custom-popup-overlay,#reading-popup');
    Array.prototype.forEach.call(junk, function (n) { n.parentNode.removeChild(n); });

    var text = c.textContent.replace(/\s+/g, ' ').trim();
    var parts = text.match(/[^។៕?!.]+[។៕?!.]?/g) || [text];

    var sentences = [];
    parts.forEach(function (p) { splitLong(p, sentences); });

    var out = [];
    var cur = '';
    sentences.forEach(function (p) {
      if (cur !== '') {
        if (Math.floor((cur + ' ' + p).length / 170) !== 0) { out.push(cur); cur = p; }
        else { cur = cur + ' ' + p; }
      } else {
        cur = p;
      }
    });
    if (cur !== '') { out.push(cur); }
    return out;
  }

  function cloudUrl(host, text) {
    return host + '?ie=UTF-8' + AMP + 'client=tw-ob' + AMP + 'tl=km' + AMP + 'q=' + encodeURIComponent(text);
  }

  // សំឡេងអនឡាញ៖ សាកល្បង host ទី១ បើខុសប្តូរទៅ host ទី២
  function playCloud(text, hostIdx, mySid, done, fail) {
    if (hostIdx === HOSTS.length) { fail('cloud'); return; }
    var a = new Audio(cloudUrl(HOSTS[hostIdx], text));
    audioEl = a;
    a.onended = function () { if (mySid === sid) { done(); } };
    a.onerror = function () {
      if (mySid === sid) { playCloud(text, hostIdx + 1, mySid, done, fail); }
    };
    var p = a.play();
    if (p) {
      if (p.catch) {
        p.catch(function (err) {
          if (mySid !== sid) { return; }
          if (err) {
            if (err.name === 'NotAllowedError') { fail('blocked'); }
          }
        });
      }
    }
  }

  function playLocal(text, voice, mySid, done, fail) {
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'km-KH';
    u.rate = 1.0;
    u.pitch = 1.0;
    if (voice) { u.voice = voice; }
    u.onend = function () { if (mySid === sid) { done(); } };
    u.onerror = function (e) {
      if (mySid !== sid) { return; }
      if (e.error === 'canceled' || e.error === 'interrupted') { return; }
      fail(e.error || 'local');
    };
    synth.speak(u);
  }

  function runChunks(chunks, mode, voice, mySid) {
    var i = 0;
    function step() {
      if (mySid !== sid) { return; }
      if (i === chunks.length) { stopRead('✅ អានចប់ហើយ'); return; }
      var label = (mode === 'local' ? 'កំពុងអាន (សំឡេងក្នុងឧបករណ៍)' : 'កំពុងអាន (សំឡេងអនឡាញ)');
      say(label + ' ' + Math.round(i * 100 / chunks.length) + '%');

      function done() { i++; step(); }
      function fail(reason) {
        if (mySid !== sid) { return; }
        if (mode === 'local') {
          // សំឡេងក្នុងឧបករណ៍មិនដើរ → ប្តូរទៅអនឡាញ
          mode = 'cloud';
          step();
          return;
        }
        if (reason === 'blocked') {
          stopRead('⚠️ Browser រារាំងការចាក់សំឡេង — សូមចុចប៊ូតុងម្តងទៀត');
        } else {
          stopRead('⚠️ ឧបករណ៍គ្មានសំឡេងខ្មែរ ហើយសំឡេងអនឡាញមិនអាចប្រើបាន (ប្រហែល Google រារាំង)');
        }
      }

      if (mode === 'local') { playLocal(chunks[i], voice, mySid, done, fail); }
      else { playCloud(chunks[i], 0, mySid, done, fail); }
    }
    return step;
  }

  function toggleReadPost() {
    if (reading) { stopRead('ផ្អាកការអាន'); return; }

    var chunks = getChunks();
    if (chunks.length === 0) { say('រកមិនឃើញអត្ថបទសម្រាប់អាន'); return; }

    var voice = findVoice();
    var mode = voice ? 'local' : 'cloud';

    sid++;
    reading = true;
    setBtn(true);
    var step = runChunks(chunks, mode, voice, sid);

    if (mode === 'local') {
      synth.cancel();
      setTimeout(step, 150); // Chrome បាត់ការអាន បើហៅ speak ភ្លាមក្រោយ cancel
    } else {
      step(); // ហៅភ្លាមក្នុងការចុច ដើម្បីឱ្យ Browser អនុញ្ញាតចាក់សំឡេង
    }
  }

  window.toggleReadPost = toggleReadPost;

  function init() {
    if (synth) {
      synth.getVoices();
      synth.onvoiceschanged = function () { synth.getVoices(); };
    }
    var b = $('read-audio-btn');
    if (b) { b.addEventListener('click', toggleReadPost); }
    window.addEventListener('pagehide', function () { stopRead(''); });
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
  else { init(); }
})();
