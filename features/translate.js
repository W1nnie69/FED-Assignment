function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    {
      pageLanguage: 'en',
      includedLanguages: 'zh-CN,ms,ta',
      autoDisplay: false
    },
    'google_translate_element'
  );
}

// Set Google translate cookie
function setLang(langCode) {
  document.cookie = "googtrans=/en/" + langCode + ";path=/;";
  location.reload();
}

// Reset to English
function resetToEnglish() {
  document.cookie = "googtrans=/en/en;path=/;";
  location.reload();
}

document.addEventListener("DOMContentLoaded", () => {
  const langBtn = document.querySelector(".lang");
  if (!langBtn) return;

  const languages = ["en", "zh-CN", "ms", "ta"];
  let current = localStorage.getItem("lang") || "en";

  updateLabel(current);

  langBtn.addEventListener("click", () => {
    let index = languages.indexOf(current);
    index = (index + 1) % languages.length;
    current = languages[index];

    localStorage.setItem("lang", current);
    updateLabel(current);

    if (current === "en") resetToEnglish();
    else setLang(current);
  });

  function updateLabel(lang) {
    if (lang === "zh-CN") langBtn.textContent = "中文";
    else if (lang === "ms") langBtn.textContent = "BM";
    else if (lang === "ta") langBtn.textContent = "தமிழ்";
    else langBtn.textContent = "EN";
  }
});
