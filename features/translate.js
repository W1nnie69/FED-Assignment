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

window.setLanguage = function (langCode) {
  applyLang(langCode || "en");
};

document.addEventListener("DOMContentLoaded", () => {
  const wrap = document.querySelector(".lang-wrap");
  const btn = document.getElementById("langBtn");
  const menu = document.getElementById("langMenu");

  if (!wrap || !btn || !menu) return;

  updateLabel(localStorage.getItem("lang") || "en");

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    wrap.classList.toggle("open");
  });

  document.addEventListener("click", () => wrap.classList.remove("open"));
  menu.addEventListener("click", (e) => e.stopPropagation());

  menu.querySelectorAll("button[data-lang]").forEach((b) => {
    b.addEventListener("click", () => {
      const lang = b.dataset.lang;
      updateLabel(lang);
      wrap.classList.remove("open");
      window.setLanguage(lang);
    });
  });
});
