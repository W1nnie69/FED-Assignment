document.addEventListener("DOMContentLoaded", () => {
  // Go to View All
  document.querySelectorAll(".view-all").forEach((el) => {
    el.style.cursor = "pointer";
    el.addEventListener("click", () => {
      window.location.href = "../view-all/view-all.html";
    });
  });

  // Click any card to go to Item page
  document.querySelectorAll(".card").forEach((card, i) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      window.location.href = `../item/item.html?item=${i + 1}`;
    });
  });

  // Simple clicks for header buttons
  document.querySelector(".logout")?.addEventListener("click", () => alert("Logout clicked"));
  document.querySelector(".profile")?.addEventListener("click", () => alert("Profile clicked"));
  document.querySelectorAll(".actions .icon").forEach((icon) => {
    icon.addEventListener("click", () => alert("Icon clicked"));
  });
});
