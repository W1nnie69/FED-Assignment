import { db } from "./firebase.js";
import {
  ref,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

const form = document.getElementById("scheduleForm");
const toast = document.getElementById("schedToast");
const table = document.getElementById("scheduleTable");

// Realtime listener: auto re-render whenever DB changes
onValue(ref(db, "schedules"), (snapshot) => {
  const data = snapshot.val();

  if (!data) {
    table.innerHTML = `<tr><td colspan="4">No schedules yet.</td></tr>`;
    return;
  }

  // Convert object -> array
  const list = Object.values(data);

  // Sort by date+time (same logic as yours)
  list.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  table.innerHTML = list
    .map(
      (s) => `
      <tr>
        <td>${s.date || ""}</td>
        <td>${s.time || ""}</td>
        <td>${s.hawkerCentre || ""}</td>
        <td>${s.stallName || ""}</td>
      </tr>
    `
    )
    .join("");
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const hawkerCentre = document.getElementById("schedHawker").value.trim();
  const stallName = document.getElementById("schedStall").value.trim();
  const date = document.getElementById("schedDate").value;
  const time = document.getElementById("schedTime").value;

  // Optional: keep officer for tracking (if you already store it)
  const officerId = localStorage.getItem("currentOfficerId") || "";

  const record = {
    hawkerCentre,
    stallName,
    date,
    time,
    officerId,
    status: "scheduled",
    createdAt: Date.now(),
  };

  try {
    await push(ref(db, "schedules"), record);

    toast.style.display = "block";
    setTimeout(() => (toast.style.display = "none"), 1800);

    form.reset();
    // No need to call render(); onValue will update automatically
  } catch (err) {
    console.error(err);
    alert("Failed to save schedule. Check console.");
  }
});


