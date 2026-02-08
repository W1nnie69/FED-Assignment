// Wait until the page fully loads
document.addEventListener("DOMContentLoaded", () => {

  // Get the container where orders will be displayed
  const ordersEl = document.getElementById("orders");

  // Get the "no orders" message element
  const emptyEl = document.getElementById("empty");

  // Get saved orders from localStorage
  // If nothing exists, use empty array
  const orders = JSON.parse(localStorage.getItem("orders")) || [];


  // ==============================
  // IF NO ORDERS → SHOW EMPTY STATE
  // ==============================
  if (orders.length === 0) {
    emptyEl.style.display = "block";
    return; // Stop running the rest
  }

  // Hide empty message if orders exist
  emptyEl.style.display = "none";


  // ==============================
  // LOOP THROUGH ORDERS (Newest First)
  // ==============================

  // slice() makes a copy so we don't modify original array
  // reverse() shows newest orders first
  orders.slice().reverse().forEach((order, idx) => {

    // Create a new order card
    const card = document.createElement("div");
    card.className = "panel order-card";


    // ==============================
    // ORDER STATUS BADGE
    // ==============================

    // Default status = "Completed"
    const status = (order.status || "Completed").toLowerCase();

    // Choose badge style based on status
    const badgeClass =
      status === "delivered" ? "delivered" : "completed";

    const badgeText =
      status === "delivered" ? "Delivered" : "Completed";


    // ==============================
    // TOTAL PRICE
    // ==============================

    // Make sure total is a number
    const total =
      typeof order.total === "number" ? order.total : 0;


    // ==============================
    // BUILD ITEMS LIST
    // ==============================

    const itemsHtml = (order.items || []).map((it) => {

      // Get item details safely
      const name = it.name || "Item";
      const qty = Number(it.qty || 1);
      const unit = Number(it.price || it.unitPrice || 0);

      // Calculate total price for that item
      const lineTotal = unit * qty;

      // Return item HTML
      return `
        <div class="item-line">
          <div>
            <p class="item-name">${name}</p>
            <p class="item-sub">Qty: ${qty}</p>
          </div>
          <p class="item-price">$${lineTotal.toFixed(2)}</p>
        </div>
      `;

    }).join(""); // Join all items into one string


    // ==============================
    // ORDER ID & DATE (Fallback if missing)
    // ==============================

    // If no ID stored, auto-generate one
    const id =
      order.id || `ORD-${String(idx + 1).padStart(3, "0")}`;

    // If no date stored, use today's date
    const date =
      order.date || new Date().toLocaleDateString();


    // ==============================
    // BUILD ORDER CARD HTML
    // ==============================

    card.innerHTML = `
      <div class="order-top">

        <div class="order-left">
          <div class="order-id-row">
            <span class="order-id">${id}</span>
            <span class="badge ${badgeClass}">
              ${badgeText}
            </span>
          </div>

          <div class="order-date">
            <span>🕒</span>
            <span>${date}</span>
          </div>
        </div>

        <div class="order-right">
          <p class="total-label">Total</p>
          <p class="total-amount">
            $${total.toFixed(2)}
          </p>
        </div>

      </div>

      <div class="hr"></div>

      <div class="items-head">
        <span>📦</span>
        <span>Items</span>
      </div>

      ${itemsHtml}
    `;


    // Add the card to the page
    ordersEl.appendChild(card);

  });

});
