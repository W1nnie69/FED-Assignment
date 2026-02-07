const form = document.getElementById("scheduleForm");
const toast = document.getElementById("toast");
const cancelBtn = document.getElementById("cancelBtn");
const closeBtn = document.getElementById("closeBtn");

// Save schedules to localStorage
function saveSchedule(record) {
  const list = JSON.parse(localStorage.getItem("inspectionSchedules")) || [];
  list.push(record);
  localStorage.setItem("inspectionSchedules", JSON.stringify(list));
}

function showToast(message) {
  toast.textContent = message;
  toast.style.display = "block";
  setTimeout(() => (toast.style.display = "none"), 2200);
}

function clearForm() {
  form.reset();
}

cancelBtn.addEventListener("click", () => {
  clearForm();
  showToast("Cancelled.");
});

closeBtn.addEventListener("click", () => {
  // If you want it to go back to previous page:
  window.history.back();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const record = {
    hawkerCentre: document.getElementById("hawkerCentre").value.trim(),
    stallName: document.getElementById("stallName").value.trim(),
    priority: document.getElementById("priority").value,
    address: document.getElementById("address").value.trim(),
    date: document.getElementById("date").value,
    time: document.getElementById("time").value,
    officerId: document.getElementById("officerId").value.trim(),
    notes: document.getElementById("notes").value.trim(),
    createdAt: new Date().toISOString(),
  };

  saveSchedule(record);
  showToast("✅ Inspection scheduled successfully!");
  clearForm();
});
