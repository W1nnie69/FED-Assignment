// ======================================
// GOOGLE TRANSLATE INITIALIZER
// ======================================

// This function is called automatically by
// Google script:
// translate.google.com/...element.js?cb=googleTranslateElementInit
function googleTranslateElementInit() {

  new google.translate.TranslateElement(
    {
      pageLanguage: "en",               // Original language of  website
      includedLanguages: "zh-CN,ms,ta", // Only allow these languages
      autoDisplay: false                // Don't auto show Google banner
    },
    "google_translate_element"          // ID where Google injects hidden element
  );
}


// ======================================
// APPLY LANGUAGE
// ======================================

function applyLang(langCode) {

  // Set Google translate cookie
  // Format: /originalLang/targetLang
  document.cookie = "googtrans=/en/" + langCode + ";path=/;";

  // Save selected language in localStorage
  localStorage.setItem("lang", langCode);

  // Reload page to apply translation
  location.reload();
}


// ======================================
// UPDATE LANGUAGE BUTTON LABEL
// ======================================

function updateLabel(langCode) {

  const btn = document.getElementById("langBtn");
  if (!btn) return;

  // Change button text based on language
  if (langCode === "zh-CN") btn.textContent = "中文";
  else if (langCode === "ms") btn.textContent = "BM";
  else if (langCode === "ta") btn.textContent = "தமிழ்";
  else btn.textContent = "EN"; // Default English
}


// ======================================
// GLOBAL FUNCTION (can be called anywhere)
// ======================================

window.setLanguage = function (langCode) {
  applyLang(langCode || "en");
};


// ======================================
// DROPDOWN MENU LOGIC
// ======================================

document.addEventListener("DOMContentLoaded", () => {

  const wrap = document.querySelector(".lang-wrap"); // container
  const btn = document.getElementById("langBtn");    // main button
  const menu = document.getElementById("langMenu");  // dropdown menu

  if (!wrap || !btn || !menu) return;

  // Set label based on previously saved language
  updateLabel(localStorage.getItem("lang") || "en");


  // ==============================
  // OPEN / CLOSE DROPDOWN
  // ==============================

  btn.addEventListener("click", (e) => {
    e.stopPropagation();           // Prevent closing immediately
    wrap.classList.toggle("open"); // Toggle dropdown visibility
  });

  // Click anywhere outside → close dropdown
  document.addEventListener("click", () =>
    wrap.classList.remove("open")
  );

  // Prevent clicks inside menu from closing it
  menu.addEventListener("click", (e) =>
    e.stopPropagation()
  );


  // ==============================
  // LANGUAGE BUTTON CLICKS
  // ==============================

  menu.querySelectorAll("button[data-lang]").forEach((b) => {

    b.addEventListener("click", () => {

      const lang = b.dataset.lang;  // Get selected language

      updateLabel(lang);            // Update button text
      wrap.classList.remove("open"); // Close dropdown

      // Apply language (sets cookie + reloads page)
      window.setLanguage(lang);
    });

  });

});
