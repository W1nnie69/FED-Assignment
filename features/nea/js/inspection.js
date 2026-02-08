import { db } from "./firebase.js";
import {
  ref,
  push,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

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
   Submit inspection (Firebase)
========================= */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const hawkerCentre = document.getElementById("hcname").value.trim();
  const stallName = document.getElementById("stallName").value.trim();
  const officerId = document.getElementById("officerId").value.trim();
  const date = document.getElementById("inspectionDate").value;
  const scoreRaw = document.getElementById("score").value.trim();
  const grade = document.getElementById("grade").value;
  const remarks = document.getElementById("remarks").value.trim();

  const record = {
    hawkerCentre,
    stallName,
    officerId,
    date,
    score: scoreRaw === "" ? null : Number(scoreRaw),
    grade,
    remarks,
    createdAt: Date.now(), // ✅ for sorting in history page
  };

  try {
    // ✅ Save to Realtime Database
    await push(ref(db, "inspections"), record);

    // ✅ Optional localStorage (for UI / navbar / dashboard)
    localStorage.setItem(
      "lastInspection",
      JSON.stringify({ hawkerCentre, stallName })
    );
    localStorage.setItem("currentOfficerId", officerId);

    alert("Inspection submitted successfully!");
    form.reset();
    setLastSavedUI();
  } catch (err) {
    console.error(err);
    alert("Failed to submit inspection. Check console.");
  }
});

/* =========================
   View ALL Hygiene History
========================= */
viewHistoryBtn.addEventListener("click", () => {
  window.location.href = "hygiene-history.html";
});

/* =========================
   Init
========================= */
setLastSavedUI();




