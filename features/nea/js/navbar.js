// /FED-Assignment/js/nav.js

(function () {
  const current = window.location.pathname.split("/").pop() || "index.html";

  // Clear previous active state
  document
    .querySelectorAll(".nav-links li")
    .forEach((li) => li.classList.remove("active"));
  document
    .querySelectorAll(".nav-links a")
    .forEach((a) => a.classList.remove("active"));

  // Find matching link and set active on LI (so pill highlight works)
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href");

    if (href === current) {
      a.closest("li")?.classList.add("active");
    }
  });

  // show officer ID if available
  const pill = document.getElementById("officerPill");
  if (pill) {
    const officer = localStorage.getItem("currentOfficerId");
    pill.textContent = officer ? `Officer ID: ${officer}` : "Officer ID: -";
  }
})();
function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("show");
}
