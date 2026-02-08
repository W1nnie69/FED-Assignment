// /FED-Assignment/js/nea-officer-dashboard.js

import { db } from "./firebase.js";
import {
  ref,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

/* =========================
   Grade helpers
========================= */
function gradeToPoints(g) {
  const map = { A: 4, B: 3, C: 2, D: 1 };
  return map[g] ?? null;
}

function pointsToGrade(avg) {
  if (avg >= 3.5) return "A";
  if (avg >= 2.5) return "B";
  if (avg >= 1.5) return "C";
  return "D";
}

/* =========================
   UI elements
========================= */
const totalEl = document.getElementById("totalInspections");
const avgScoreEl = document.getElementById("avgScore");
const avgGradeEl = document.getElementById("avgGrade");
const recentTable = document.getElementById("recentTable");

// Current officer (keep using localStorage for identity)
const officerId = (localStorage.getItem("currentOfficerId") || "").trim();

/* =========================
   Render dashboard from data
========================= */
function renderDashboard(allInspections) {
  // Filter for this officer if officerId exists; otherwise show all
  const data = officerId
    ? allInspections.filter((r) => (r.officerId || "").trim() === officerId)
    : allInspections;

  // Total inspections
  totalEl.textContent = String(data.length);

  // Avg score
  const scores = data
    .map((r) => Number(r.score))
    .filter((n) => Number.isFinite(n));

  const avgScore = scores.length
    ? scores.reduce((a, b) => a + b, 0) / scores.length
    : null;

  avgScoreEl.textContent = avgScore === null ? "-" : avgScore.toFixed(1);

  // Avg grade
  avgGradeEl.className = ""; // reset classes
  const gradePoints = data
    .map((r) => gradeToPoints((r.grade || "").toUpperCase()))
    .filter((n) => n !== null);

  const avgGrade = gradePoints.length
    ? pointsToGrade(gradePoints.reduce((a, b) => a + b, 0) / gradePoints.length)
    : null;

  avgGradeEl.textContent = avgGrade ? avgGrade : "-";
  if (avgGrade) avgGradeEl.classList.add(`grade-${avgGrade}`);

  // Recent table
  if (!data.length) {
    recentTable.innerHTML = `<tr><td colspan="6">No inspections found.</td></tr>`;
    return;
  }

  const list = [...data]
    .sort((a, b) => {
      const at = typeof a.createdAt === "number" ? a.createdAt : Date.parse(a.date || "") || 0;
      const bt = typeof b.createdAt === "number" ? b.createdAt : Date.parse(b.date || "") || 0;
      return bt - at;
    })
    .slice(0, 10);

  recentTable.innerHTML = list
    .map(
      (r) => `
      <tr>
        <td>${r.date || "-"}</td>
        <td>${r.hawkerCentre || "-"}</td>
        <td>${r.stallName || "-"}</td>
        <td>${r.score ?? "-"}</td>
        <td class="grade-${r.grade || ""}">${r.grade || "-"}</td>
        <td>${r.remarks || "-"}</td>
      </tr>
    `
    )
    .join("");
}

/* =========================
   Live Firebase updates
========================= */
onValue(ref(db, "inspections"), (snapshot) => {
  const data = snapshot.val();

  if (!data) {
    // No inspections at all
    renderDashboard([]);
    return;
  }

  // Convert object -> array
  const allInspections = Object.values(data);
  renderDashboard(allInspections);
});

/* =========================
   OPTIONAL: Clear local-only cache
   (does NOT affect Firebase)
========================= */
// If you have a button with id="clearLocalBtn", this clears old localStorage data
const clearLocalBtn = document.getElementById("clearLocalBtn");
if (clearLocalBtn) {
  clearLocalBtn.addEventListener("click", () => {
    localStorage.removeItem("inspectionHistory"); // old key
    localStorage.removeItem("inspectionSchedules"); // old key
    alert("Local dashboard cache cleared (Firebase data not affected).");
  });
}

/* =========================
   OPTIONAL: Clear Firebase data (TESTING ONLY)
   (adds a button id="clearFirebaseBtn")
========================= */
const clearFirebaseBtn = document.getElementById("clearFirebaseBtn");
if (clearFirebaseBtn) {
  clearFirebaseBtn.addEventListener("click", async () => {
    const ok = confirm("Delete ALL Firebase inspections? (Testing only)");
    if (!ok) return;

    try {
      await remove(ref(db, "inspections"));
      alert("Firebase inspections cleared.");
      // onValue will auto-update UI to 0
    } catch (err) {
      console.error(err);
      alert("Failed to clear Firebase inspections. Check console.");
    }
  });
}
