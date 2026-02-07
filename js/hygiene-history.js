const tableBody = document.getElementById("historyTable");
const stallInfo = document.getElementById("stallInfo");

const params = new URLSearchParams(window.location.search);
const hawker = params.get("hawker");
const stall = params.get("stall");

const history = JSON.parse(localStorage.getItem("inspectionHistory")) || [];

if (stallInfo) {
  stallInfo.textContent =
    hawker && stall ? `${stall} · ${hawker}` : "Showing all records";
}

if (!history.length) {
  tableBody.innerHTML =
    `<tr><td colspan="7">No inspection records saved yet.</td></tr>`;
} else {
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

  const list = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!list.length) {
    tableBody.innerHTML =
      `<tr><td colspan="7">No records found for this stall.</td></tr>`;
  } else {
    tableBody.innerHTML = list
      .map(
        (r) => `
        <tr>
          <td>${r.date || "-"}</td>
          <td>${r.hawkerCentre || "-"}</td>
          <td>${r.stallName || "-"}</td>
          <td>${r.officerId || "-"}</td>
          <td>${r.score || "-"}</td>
          <td class="grade grade-${r.grade || ""}">${r.grade || "-"}</td>
          <td>${r.remarks || "-"}</td>
        </tr>
      `
      )
      .join("");
  }
}


