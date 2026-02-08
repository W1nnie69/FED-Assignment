const form = document.getElementById("feedbackForm");
const toast = document.getElementById("toast");
const submitBtn = document.getElementById("submitBtn");

const stars = Array.from(document.querySelectorAll(".star"));
const ratingValue = document.getElementById("ratingValue");
const ratingText = document.getElementById("ratingText");

const requiredFields = [
  document.getElementById("estName"),
  document.getElementById("category"),
  document.getElementById("comments"),
];

/* =========================
   Stars
========================= */
function paintStars(value) {
  stars.forEach((btn) => {
    const v = Number(btn.dataset.value);
    btn.classList.toggle("filled", v <= value);
    btn.textContent = v <= value ? "★" : "☆";
  });

  ratingText.textContent =
    value === 0 ? "Select a rating" : `${value} / 5`;
}

stars.forEach((btn) => {
  btn.addEventListener("click", () => {
    const value = Number(btn.dataset.value);
    ratingValue.value = String(value);
    paintStars(value);
    updateSubmitState();
  });

  // Hover preview
  btn.addEventListener("mouseenter", () => {
    paintStars(Number(btn.dataset.value));
  });

  btn.addEventListener("mouseleave", () => {
    paintStars(Number(ratingValue.value || "0"));
  });
});

/* =========================
   Enable submit only when valid
========================= */
function updateSubmitState() {
  const basicFilled = requiredFields.every(
    (el) => el.value.trim() !== ""
  );
  const ratingPicked = Number(ratingValue.value) > 0;

  if (basicFilled && ratingPicked) {
    submitBtn.classList.remove("btn-disabled");
    submitBtn.classList.add("btn-enabled");
    submitBtn.disabled = false;
  } else {
    submitBtn.classList.add("btn-disabled");
    submitBtn.classList.remove("btn-enabled");
    submitBtn.disabled = true;
  }
}

requiredFields.forEach((el) =>
  el.addEventListener("input", updateSubmitState)
);
requiredFields.forEach((el) =>
  el.addEventListener("change", updateSubmitState)
);

// Init
updateSubmitState();
paintStars(0);

/* =========================
   Submit feedback
========================= */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Show success toast
  toast.style.display = "block";

  // After delay: reset + redirect
  setTimeout(() => {
    toast.style.display = "none";
    form.reset();

    ratingValue.value = "0";
    paintStars(0);
    updateSubmitState();

    // 🚀 Redirect to order end page
    window.location.href = "order-endpage.html";
  }, 2200);
});

