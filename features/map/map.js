// ==============================
// SIMPLE EMBED MAP VERSION
// ==============================

// Wait for page to load
document.addEventListener("DOMContentLoaded", () => {

  // Get place from URL
  // const params = new URLSearchParams(window.location.search);
  // const place = params.get("place") || "Singapore";
  const place = localStorage.getItem("location");

  // Set title text
  const titleEl = document.getElementById("placeTitle");
  if (titleEl) titleEl.textContent = place;

  // Set iframe source (Google Maps embed)
  const mapFrame = document.getElementById("mapFrame");
  if (mapFrame) {
    mapFrame.src =
      "https://www.google.com/maps?q=" +
      encodeURIComponent(place) +
      "&output=embed";
  }

  // Set "Open in Google Maps" button link
  const openBtn = document.getElementById("openMaps");
  if (openBtn) {
    openBtn.href =
      "https://www.google.com/maps/dir/?api=1&destination=" +
      encodeURIComponent(place);
  }

});
