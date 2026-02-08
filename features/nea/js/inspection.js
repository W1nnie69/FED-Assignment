const form = document.getElementById("inspectionForm");
const viewHistoryBtn = document.getElementById("viewHistoryBtn");
const lastSavedText = document.getElementById("lastSavedText"); // optional UI text

/* =========================
   Helper: update "last saved"
========================= */
function setLastSavedUI() {
  if (!lastSavedText) return;

  const last = JSON.parse(localStorage.getItem("lastInspection"));
  lastSavedText.textContent = last
    ? `Last saved: ${last.stallName} · ${last.hawkerCentre}`
    : "";
}

/* =========================
   Submit inspection
========================= */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const hawkerCentre = document.getElementById("hcname").value.trim();
  const stallName = document.getElementById("stallName").value.trim();
  const officerId = document.getElementById("officerId").value.trim();
  const date = document.getElementById("inspectionDate").value;
  const score = document.getElementById("score").value.trim();
  const grade = document.getElementById("grade").value;
  const remarks = document.getElementById("remarks").value.trim();

  const record = {
    hawkerCentre,
    stallName,
    officerId,
    date,
    score,
    grade,
    remarks,
  };

  // Save ALL inspections
  const history =
    JSON.parse(localStorage.getItem("inspectionHistory")) || [];
  history.push(record);
  localStorage.setItem("inspectionHistory", JSON.stringify(history));

  // Save last inspection info (optional UI)
  localStorage.setItem(
    "lastInspection",
    JSON.stringify({ hawkerCentre, stallName })
  );

  // Save current officer ID (dashboard / navbar use)
  localStorage.setItem("currentOfficerId", officerId);

  alert("Inspection submitted successfully!");
  form.reset();
  setLastSavedUI();
});

/* =========================
   View ALL Hygiene History
========================= */
viewHistoryBtn.addEventListener("click", () => {
  // 🚀 No query params = show ALL records
  window.location.href = "hygiene-history.html";
});

/* =========================
   Init
========================= */
setLastSavedUI();



