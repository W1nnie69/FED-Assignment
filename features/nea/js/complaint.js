const form = document.getElementById("complaintForm");
const toast = document.getElementById("toast");

form.addEventListener("submit", (e) => {
  e.preventDefault(); // prevent page reload

  // Show success toast
  toast.style.display = "block";

  // After delay: hide toast, reset form, redirect
  setTimeout(() => {
    toast.style.display = "none";
    form.reset();

    // 🚀 Redirect to order end page
    window.location.href = "../../order-endpage/order-endpage.html";
  }, 2200);
});


