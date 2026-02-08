import { db } from "./firebase.js";
import {
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

const tableBody = document.getElementById("historyTable");
const stallInfo = document.getElementById("stallInfo");

const params = new URLSearchParams(window.location.search);
const hawker = params.get("hawker");
const stall = params.get("stall");

// UI label at top
if (stallInfo) {
  stallInfo.textContent =
    hawker && stall ? `${stall} · ${hawker}` : "Showing all records";
}

// Read from Firebase Realtime Database
onValue(ref(db, "inspections"), (snapshot) => {
  const data = snapshot.val();

  if (!data) {
    tableBody.innerHTML = `<tr><td colspan="7">No inspection records saved yet.</td></tr>`;
    return;
  }

  // Convert object -> array
  const history = Object.values(data);

  // Filter by hawker + stall (case-insensitive). If no params, show all.
  const filtered =
    hawker && stall
      ? history.filter((r) => {
          const hc = (r.hawkerCentre || "").trim().toLowerCase();
          const sn = (r.stallName || "").trim().toLowerCase();
          return (
            hc === hawker.trim().toLowerCase() &&
            sn === stall.trim().toLowerCase()
          );
        })
      : history;

  // Sort newest first:
  // Prefer createdAt (number), fallback to date (yyyy-mm-dd)
  const list = filtered.sort((a, b) => {
    const at = typeof a.createdAt === "number" ? a.createdAt : Date.parse(a.date || "") || 0;
    const bt = typeof b.createdAt === "number" ? b.createdAt : Date.parse(b.date || "") || 0;
    return bt - at;
  });

  if (!list.length) {
    tableBody.innerHTML = `<tr><td colspan="7">No records found for this stall.</td></tr>`;
    return;
  }

  tableBody.innerHTML = list
    .map(
      (r) => `
        <tr>
          <td>${r.date || "-"}</td>
          <td>${r.hawkerCentre || "-"}</td>
          <td>${r.stallName || "-"}</td>
          <td>${r.officerId || "-"}</td>
          <td>${r.score ?? "-"}</td>
          <td class="grade grade-${r.grade || ""}">${r.grade || "-"}</td>
          <td>${r.remarks || "-"}</td>
        </tr>
      `
    )
    .join("");
});

/* =========================
   Back button
========================= */
const backBtn = document.getElementById("backBtn");

if (backBtn) {
  backBtn.addEventListener("click", () => {
    window.location.href =
      "/FED-Assignment/features/nea/nea-officer-inspection.html";
  });
}
