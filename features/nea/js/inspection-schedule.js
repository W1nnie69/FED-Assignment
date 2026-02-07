const form = document.getElementById("scheduleForm");
const toast = document.getElementById("schedToast");
const table = document.getElementById("scheduleTable");

function render() {
  const list = JSON.parse(localStorage.getItem("inspectionSchedules")) || [];
  if (!list.length) {
    table.innerHTML = `<tr><td colspan="4">No schedules yet.</td></tr>`;
    return;
  }

  list.sort((a,b) => (a.date + a.time).localeCompare(b.date + b.time));

  table.innerHTML = list.map(s => `
    <tr>
      <td>${s.date}</td>
      <td>${s.time}</td>
      <td>${s.hawkerCentre}</td>
      <td>${s.stallName}</td>
    </tr>
  `).join("");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const hawkerCentre = document.getElementById("schedHawker").value.trim();
  const stallName = document.getElementById("schedStall").value.trim();
  const date = document.getElementById("schedDate").value;
  const time = document.getElementById("schedTime").value;

  const list = JSON.parse(localStorage.getItem("inspectionSchedules")) || [];
  list.push({ hawkerCentre, stallName, date, time });
  localStorage.setItem("inspectionSchedules", JSON.stringify(list));

  toast.style.display = "block";
  setTimeout(() => (toast.style.display = "none"), 1800);

  form.reset();
  render();
});

render();

