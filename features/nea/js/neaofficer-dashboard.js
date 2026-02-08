// /FED-Assignment/js/nea-officer-dashboard.js

function gradeToPoints(g) {
  const map = { A: 4, B: 3, C: 2, D: 1 };
  return map[g] ?? null;
}

function pointsToGrade(avg) {
  // Simple thresholds
  if (avg >= 3.5) return "A";
  if (avg >= 2.5) return "B";
  if (avg >= 1.5) return "C";
  return "D";
}

const officerId = localStorage.getItem("currentOfficerId"); // set by inspection form submission

const history = JSON.parse(localStorage.getItem("inspectionHistory")) || [];

// Filter for this officer if officerId exists; otherwise show all
const data = officerId
  ? history.filter((r) => (r.officerId || "").trim() === officerId.trim())
  : history;

document.getElementById("totalInspections").textContent = String(data.length);

// Avg score
const scores = data
  .map((r) => Number(r.score))
  .filter((n) => Number.isFinite(n));

const avgScore = scores.length
  ? (scores.reduce((a, b) => a + b, 0) / scores.length)
  : null;

document.getElementById("avgScore").textContent =
  avgScore === null ? "-" : avgScore.toFixed(1);

// Avg grade (A=4..D=1)
const gradePoints = data
  .map((r) => gradeToPoints((r.grade || "").toUpperCase()))
  .filter((n) => n !== null);

const avgGrade =
  gradePoints.length
    ? pointsToGrade(gradePoints.reduce((a, b) => a + b, 0) / gradePoints.length)
    : null;

const avgGradeEl = document.getElementById("avgGrade");
avgGradeEl.textContent = avgGrade ? avgGrade : "-";
if (avgGrade) avgGradeEl.classList.add(`grade-${avgGrade}`);

// Recent table
const recentTable = document.getElementById("recentTable");

if (!data.length) {
  recentTable.innerHTML = `<tr><td colspan="6">No inspections found.</td></tr>`;
} else {
  const list = [...data].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

  recentTable.innerHTML = list
    .map(
      (r) => `
      <tr>
        <td>${r.date || "-"}</td>
        <td>${r.hawkerCentre || "-"}</td>
        <td>${r.stallName || "-"}</td>
        <td>${r.score || "-"}</td>
        <td class="grade-${r.grade || ""}">${r.grade || "-"}</td>
        <td>${r.remarks || "-"}</td>
      </tr>
    `
    )
    .join("");
}
