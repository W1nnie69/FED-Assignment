const form = document.getElementById("inspectionForm");
const viewHistoryBtn = document.getElementById("viewHistoryBtn");
const lastSavedText = document.getElementById("lastSavedText"); // optional

function setLastSavedUI() {
  if (!lastSavedText) return;
  const last = JSON.parse(localStorage.getItem("lastInspection"));
  lastSavedText.textContent = last
    ? `Last saved: ${last.stallName} · ${last.hawkerCentre}`
    : "";
}

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

  // ✅ Save ALL records (append)
  const history = JSON.parse(localStorage.getItem("inspectionHistory")) || [];
  history.push(record);
  localStorage.setItem("inspectionHistory", JSON.stringify(history));

  // ✅ Save last inspected so View button works after reset
  localStorage.setItem(
    "lastInspection",
    JSON.stringify({ hawkerCentre, stallName })
  );

  alert("Inspection submitted successfully!");
  form.reset();

  setLastSavedUI(); // optional
});

viewHistoryBtn.addEventListener("click", () => {
  // Try current inputs first
  let hawkerCentre = document.getElementById("hcname").value.trim();
  let stallName = document.getElementById("stallName").value.trim();

  // If empty (because reset), use lastInspection
  if (!hawkerCentre || !stallName) {
    const last = JSON.parse(localStorage.getItem("lastInspection"));
    if (!last) {
      alert("Please submit an inspection first.");
      return;
    }
    hawkerCentre = last.hawkerCentre;
    stallName = last.stallName;
  }

  // ✅ IMPORTANT: set correct path to your history page
  // If your history page is in /FED-Assignment/pages/, change accordingly.
  const url =
    `/FED-Assignment/pages/hygiene-history.html?hawker=${encodeURIComponent(
      hawkerCentre
    )}&stall=${encodeURIComponent(stallName)}`;

  window.location.href = url;
});

setLastSavedUI(); // optional

