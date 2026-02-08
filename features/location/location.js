document.addEventListener("DOMContentLoaded", () => {

  // Make location cards clickable
  document.querySelectorAll(".loc-card").forEach(card => {
    card.style.cursor = "pointer";

    card.addEventListener("click", () => {
      const name = card.dataset.name;
      window.location.href = `../map/map.html?place=${encodeURIComponent(name)}`;
    });
  });

  // Notification icon click
  document.querySelectorAll(".icon").forEach(icon => {
    if (!icon.closest("a")) {
      icon.addEventListener("click", () => {
        alert("Notifications clicked");
      });
    }
  });

  // Logout
  const logoutBtn = document.querySelector(".logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      alert("Logged out");
      window.location.href = "../login-page/login.html";
    });
  }

  // Profile click
  const profile = document.querySelector(".profile");
  if (profile) {
    profile.addEventListener("click", () => {
      alert("Profile page coming soon");
    });
  }

});


function goToMap(place) {
    window.location.href =
      "../map/map.html?place=" + encodeURIComponent(place);
  }

  // make other buttons interactive
  document.getElementById("notifIcon").onclick = () =>
    alert("Notifications clicked");

  document.getElementById("profileIcon").onclick = () =>
    alert("Profile clicked");

  document.getElementById("logoutBtn").onclick = () =>
    alert("Logged out");
