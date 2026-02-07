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

  // Get values
  const hawkerCentre = document.getElementById("hcname").value.trim();
  const stallName = document.getElementById("stallName").value.trim();
  const officerId = document.getElementById("officerId").value.trim();
  const date = document.getElementById("inspectionDate").value;
  const score = document.getElementById("score").value.trim();
  const grade = document.getElementById("grade").value;
  const remarks = document.getElementById("remarks").value.trim();

  // Create inspection record
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

  // Save last inspected stall (for View History button)
  localStorage.setItem(
    "lastInspection",
    JSON.stringify({ hawkerCentre, stallName })
  );

  // ✅ Save current officer ID (for dashboard + navbar)
  localStorage.setItem("currentOfficerId", officerId);

  alert("Inspection submitted successfully!");
  form.reset();
  setLastSavedUI();
});

/* =========================
   View Hygiene History
========================= */
viewHistoryBtn.addEventListener("click", () => {
  let hawkerCentre = document.getElementById("hcname").value.trim();
  let stallName = document.getElementById("stallName").value.trim();

  // If form is empty (after reset), use lastInspection
  if (!hawkerCentre || !stallName) {
    const last = JSON.parse(localStorage.getItem("lastInspection"));
    if (!last) {
      alert("Please submit an inspection first.");
      return;
    }
    hawkerCentre = last.hawkerCentre;
    stallName = last.stallName;
  }

  // ✅ RELATIVE path (prevents Cannot GET error)
  const url =
    `hygiene-history.html?hawker=${encodeURIComponent(hawkerCentre)}` +
    `&stall=${encodeURIComponent(stallName)}`;

  window.location.href = url;
});

// Init
setLastSavedUI();


