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

// --- Stars ---
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

  // hover preview
  btn.addEventListener("mouseenter", () => {
    paintStars(Number(btn.dataset.value));
  });

  btn.addEventListener("mouseleave", () => {
    paintStars(Number(ratingValue.value || "0"));
  });
});

// --- Enable button only when required inputs are filled + rating selected ---
function updateSubmitState() {
  const basicFilled = requiredFields.every((el) => el.value.trim() !== "");
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

requiredFields.forEach((el) => el.addEventListener("input", updateSubmitState));
requiredFields.forEach((el) => el.addEventListener("change", updateSubmitState));

updateSubmitState();
paintStars(0);

// --- Submit ---
form.addEventListener("submit", (e) => {
  e.preventDefault();

  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
    form.reset();

    ratingValue.value = "0";
    paintStars(0);
    updateSubmitState();
  }, 2200);
});
