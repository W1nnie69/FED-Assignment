const form = document.getElementById("complaintForm");
const toast = document.getElementById("toast");

form.addEventListener("submit", (e) => {
  e.preventDefault(); // remove this if you want to send to backend

  // Show success message
  toast.style.display = "block";

  // Hide after a bit + reset form
  setTimeout(() => {
    toast.style.display = "none";
    form.reset();
  }, 2200);
});
