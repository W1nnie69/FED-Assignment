document.addEventListener("DOMContentLoaded", () => {
  const ordersEl = document.getElementById("orders");
  const emptyEl = document.getElementById("empty");

  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  if (orders.length === 0) {
    emptyEl.style.display = "block";
    return;
  }

  emptyEl.style.display = "none";

  // newest first
  orders.slice().reverse().forEach((order, idx) => {
    const card = document.createElement("div");
    card.className = "panel order-card";

    const status = (order.status || "Completed").toLowerCase();
    const badgeClass = status === "delivered" ? "delivered" : "completed";
    const badgeText = status === "delivered" ? "Delivered" : "Completed";

    const total = typeof order.total === "number" ? order.total : 0;

    // items list
    const itemsHtml = (order.items || []).map((it) => {
      const name = it.name || "Item";
      const qty = Number(it.qty || 1);
      const unit = Number(it.price || it.unitPrice || 0);
      const lineTotal = unit * qty;

      return `
        <div class="item-line">
          <div>
            <p class="item-name">${name}</p>
            <p class="item-sub">Qty: ${qty}</p>
          </div>
          <p class="item-price">$${lineTotal.toFixed(2)}</p>
        </div>
      `;
    }).join("");

    // fallback ID if not stored
    const id = order.id || `ORD-${String(idx + 1).padStart(3, "0")}`;
    const date = order.date || new Date().toLocaleDateString();

    card.innerHTML = `
      <div class="order-top">
        <div class="order-left">
          <div class="order-id-row">
            <span class="order-id">${id}</span>
            <span class="badge ${badgeClass}">${badgeText}</span>
          </div>
          <div class="order-date">
            <span>🕒</span>
            <span>${date}</span>
          </div>
        </div>

        <div class="order-right">
          <p class="total-label">Total</p>
          <p class="total-amount">$${total.toFixed(2)}</p>
        </div>
      </div>

      <div class="hr"></div>

      <div class="items-head">
        <span>📦</span>
        <span>Items</span>
      </div>

      ${itemsHtml}
    `;

    ordersEl.appendChild(card);
  });
});
