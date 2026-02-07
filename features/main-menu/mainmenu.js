function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    {
      pageLanguage: "en",
      includedLanguages: "zh-CN,ms,ta",
      autoDisplay: false
    },
    "google_translate_element"
  );
}

function applyLang(langCode) {
  document.cookie = "googtrans=/en/" + langCode + ";path=/;";
  localStorage.setItem("lang", langCode);
  location.reload();
}

function updateLabel(langCode) {
  const btn = document.getElementById("langBtn");
  if (!btn) return;

  if (langCode === "zh-CN") btn.textContent = "中文";
  else if (langCode === "ms") btn.textContent = "BM";
  else if (langCode === "ta") btn.textContent = "தமிழ்";
  else btn.textContent = "EN";
}

// expose for other scripts if needed
window.setLanguage = function (langCode) {
  if (!langCode || langCode === "en") applyLang("en");
  else applyLang(langCode);
};

document.addEventListener("DOMContentLoaded", () => {
  const wrap = document.querySelector(".lang-wrap");
  const btn = document.getElementById("langBtn");
  const menu = document.getElementById("langMenu");

  // if any of these missing, nothing will work
  if (!wrap || !btn || !menu) {
    console.log("Language dropdown not found. Check .lang-wrap, #langBtn, #langMenu");
    return;
  }

  // set initial button label
  const current = localStorage.getItem("lang") || "en";
  updateLabel(current);

  // OPEN/CLOSE dropdown when clicking button
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    wrap.classList.toggle("open");
  });

  // click outside closes menu
  document.addEventListener("click", () => {
    wrap.classList.remove("open");
  });

  // prevent clicks inside menu from closing immediately
  menu.addEventListener("click", (e) => e.stopPropagation());

  // ESC closes
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") wrap.classList.remove("open");
  });

  // selecting language
  menu.querySelectorAll("button[data-lang]").forEach((b) => {
    b.addEventListener("click", () => {
      const lang = b.dataset.lang;
      updateLabel(lang);
      wrap.classList.remove("open");
      window.setLanguage(lang);
    });
  });
});
