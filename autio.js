function toggleReadPost() {
  // ពិនិត្យមើលថាតើ Browser គាំទ្រ Web Speech API ដែរឬទេ
  if (!('speechSynthesis' in window)) {
    alert('សូមអភ័យទោស! Browser របស់អ្នកមិនគាំទ្រមុខងារអានអត្ថបទនេះទេ។');
    return;
  }

  // ប្រសិនបើកំពុងអាន ឱ្យវាหยุด (Stop)
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    updateReadButtonState(false);
    return;
  }

  // ດึงយកអត្ថបទពីក្នុង Post (สมมติว่าអត្ថបទស្ថិតក្នុង class ឈ្មោះ .post-body)
  var postBody = document.querySelector('.post-body');
  if (!postBody) {
    alert('រកមិនឃើញអត្ថបទសម្រាប់អានទេ។');
    return;
  }

  var textToRead = postBody.innerText || postBody.textContent;

  // កំណត់ការអាន
  var utterance = new SpeechSynthesisUtterance(textToRead);
  utterance.lang = 'km-KH'; // កំណត់ភាសាខ្មែរ
  utterance.rate = 1.0;     // ល្បឿននៃការអាន (អាចកែសម្រួលបាន 0.8 ដល់ 1.2)
  utterance.pitch = 1.0;    // កម្រិតសម្លេង

  // ពេលចាប់ផ្តើមអាន
  utterance.onstart = function() {
    updateReadButtonState(true);
  };

  // ពេលអានចប់
  utterance.onend = function() {
    updateReadButtonState(false);
  };

  // ចាប់ផ្តើមបញ្ជាឱ្យអាន
  window.speechSynthesis.speak(utterance);
}

// មុខងារប្តូររូបរាង ឬអត្ថន័យប៊ូតុង (អាចមាន ឬអត់ក៏បាន)
fn = updateReadButtonState(isReading);
function updateReadButtonState(isReading) {
  var btn = document.getElementById('read-audio-btn');
  if (btn) {
    btn.innerText = isReading ? '⏹ បញ្ឈប់ការអាន' : '🔊 ស្តាប់អត្ថបទនេះ';
  }
}
