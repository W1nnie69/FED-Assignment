import { db, auth, listenOrders, updateOrderStatus } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { ref, push, set } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

const DEMO_VENDOR_ID = "vendor001";
let currentVendorId = DEMO_VENDOR_ID;

let orders = [];
let started = false;

// ===== DOM =====
const newOrdersEl = document.getElementById("newOrders");
const activeOrdersEl = document.getElementById("activeOrders");
const completedOrdersEl = document.getElementById("completedOrders");
const historyOrdersEl = document.getElementById("historyOrders");
const revenueEl = document.getElementById("todayRevenue");

const newCountEl = document.getElementById("newOrdersCount");
const preparingCountEl = document.getElementById("preparingCount");
const readyCountEl = document.getElementById("readyCount");

// ===== Tabs (called from HTML onclick) =====
function switchTab(e, tabName) {
  // tab button
  document.querySelectorAll(".tab").forEach(function (t) {
    t.classList.remove("active");
  });
  if (e && e.target) e.target.classList.add("active");

  // tab content
  document.querySelectorAll(".tab-content").forEach(function (c) {
    c.classList.remove("active");
  });
  const tab = document.getElementById(tabName + "Tab");
  if (tab) tab.classList.add("active");
}
window.switchTab = switchTab;

// ===== Utils =====
function getTimeAgo(createdAt) {
  if (!createdAt) return "—";

  const minutes = Math.floor((Date.now() - createdAt) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes === 1) return "1 min ago";
  if (minutes < 60) return minutes + " mins ago";

  const hours = Math.floor(minutes / 60);
  if (hours === 1) return "1 hour ago";
  return hours + " hours ago";
}

function statusText(status) {
  const map = {
    new: "New Order",
    preparing: "Preparing",
    ready: "Ready for Pickup",
    completed: "Completed",
    cancelled: "Cancelled"
  };
  return map[status] || status;
}

// ===== Render =====
function renderOrder(order) {
  const sClass = "status-" + (order.status || "new");
  const timeAgo = getTimeAgo(order.createdAt);

  const cust = order.customer || {};
  const name = cust.name || "Walk-in Customer";
  const phone = cust.phone || "";
  const avatar = (name.trim().split(" ")[0][0] || "U").toUpperCase() +
                 ((name.trim().split(" ")[1] && name.trim().split(" ")[1][0]) ? name.trim().split(" ")[1][0].toUpperCase() : "");

  const items = order.items || [];
  const itemsHtml = items.map(function (it) {
    const qty = it.quantity || 1;
    const price = Number(it.price || 0);
    const mods = it.modifications || "";

    return `
      <div class="order-item">
        <div class="item-quantity">${qty}x</div>
        <div class="item-details">
          <h4>${it.name || "Item"}</h4>
          ${mods ? `<div class="item-modifications">${mods}</div>` : ""}
        </div>
        <div class="item-price">$${price.toFixed(2)}</div>
        <div class="item-subtotal">$${(qty * price).toFixed(2)}</div>
      </div>
    `;
  }).join("");

  const subtotal = Number(order.subtotal || 0);
  const tax = Number(order.tax || 0);
  const total = Number(order.total || (subtotal + tax));

  const notesHtml = order.notes
    ? `
      <div class="order-notes">
        <div class="notes-label">📝 Special Instructions:</div>
        <div>${order.notes}</div>
      </div>
    `
    : "";

  return `
    <div class="order-card">
      <div class="order-header">
        <div class="order-id">Order #${order.id}</div>

        <div class="order-time">
          <span class="time-ago">${timeAgo}</span>
        </div>

        <div class="order-status ${sClass}">${statusText(order.status)}</div>
        <div class="order-total">$${total.toFixed(2)}</div>
      </div>

      <div class="order-body">
        <div class="order-info">
          <div class="customer-info">
            <div class="customer-avatar">${avatar}</div>
            <div class="customer-details">
              <h3>${name}</h3>
              <div class="customer-contact">${phone}</div>
            </div>
          </div>
          ${notesHtml}
        </div>

        <div class="items-list">
          <div class="items-header">Order Items</div>
          ${itemsHtml}
        </div>

        <div class="order-summary">
          <div class="summary-row">
            <span>Subtotal</span>
            <span>$${subtotal.toFixed(2)}</span>
          </div>
          <div class="summary-row">
            <span>Tax</span>
            <span>$${tax.toFixed(2)}</span>
          </div>
          <div class="summary-row">
            <span>Total</span>
            <span>$${total.toFixed(2)}</span>
          </div>
        </div>

        <div class="order-actions">
          ${actionButtons(order)}
        </div>
      </div>
    </div>
  `;
}

function renderOrderNoActions(order) {
  // same card, but without action buttons
  const html = renderOrder(order);
  return html.replace(/<div class="order-actions">[\s\S]*?<\/div>/, '<div class="order-actions"></div>');
}

function actionButtons(order) {
  const id = order.id;

  if (order.status === "new") {
    return `
      <button class="action-btn accept" onclick="updateStatus('${id}','preparing')">✓ Accept Order</button>
      <button class="action-btn reject" onclick="updateStatus('${id}','cancelled')">✕ Reject</button>
    `;
  }
  if (order.status === "preparing") {
    return `<button class="action-btn ready" onclick="updateStatus('${id}','ready')">Mark as Ready</button>`;
  }
  if (order.status === "ready") {
    return `<button class="action-btn complete" onclick="updateStatus('${id}','completed')">Complete Order</button>`;
  }
  return "";
}

// Called by button HTML above
function updateStatus(orderId, newStatus) {
  updateOrderStatus(currentVendorId, orderId, newStatus);
}
window.updateStatus = updateStatus;

// ===== Lists + stats =====
function renderAll() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startTs = startOfToday.getTime();

  const newList = orders.filter(function (o) { return o.status === "new"; });
  const activeList = orders.filter(function (o) { return o.status === "preparing" || o.status === "ready"; });
  const completedToday = orders.filter(function (o) { return o.status === "completed" && (o.createdAt || 0) >= startTs; });

  // HISTORY = anything before today (completed/cancelled/whatever)
  const historyList = orders
  .filter(function (o) {
    return o.status === "completed" || o.status === "cancelled";
  })
  .sort(function (a, b) {
    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  // TODAY REVENUE = sum totals for orders created today, excluding cancelled
  let revenue = 0;
  for (let i = 0; i < orders.length; i++) {
    const o = orders[i];
    const isToday = (o.createdAt || 0) >= startTs;
    const notCancelled = o.status !== "cancelled";
    if (isToday && notCancelled) {
      revenue += Number(o.total || 0);
    }
  }

  // render tabs
  newOrdersEl.innerHTML = newList.length ? newList.map(renderOrder).join("") : emptyState("No new orders", "New orders will appear here");
  activeOrdersEl.innerHTML = activeList.length ? activeList.map(renderOrder).join("") : emptyState("No active orders", "Orders being prepared will appear here");
  completedOrdersEl.innerHTML = completedToday.length ? completedToday.map(renderOrder).join("") : emptyState("No completed orders today", "Completed orders will appear here");

  // history: reuse same order card but no action buttons (simpler)
    historyOrdersEl.innerHTML = historyList.length
    ? historyList.map(function (o) { return renderOrderNoActions(o); }).join("")
    : emptyState("No history yet", "Completed/cancelled orders will appear here");

  // stats
  newCountEl.textContent = newList.length;
  preparingCountEl.textContent = orders.filter(function (o) { return o.status === "preparing"; }).length;
  readyCountEl.textContent = orders.filter(function (o) { return o.status === "ready"; }).length;

  if (revenueEl) revenueEl.textContent = "$" + revenue.toFixed(2);
}


function emptyState(title, desc) {
  return `<div class="empty-state"><h3>${title}</h3><p>${desc}</p></div>`;
}

// ===== Test Order Button =====
function addTestOrderButton() {
  const header = document.querySelector(".header");
  if (!header) return;

  const btn = document.createElement("button");
  btn.className = "action-btn ready";
  btn.style.maxWidth = "260px";
  btn.textContent = "➕ Create Test Order";
  btn.addEventListener("click", createTestOrder);

  header.appendChild(btn);
}

function createTestOrder() {
  const orderData = {
    status: "new",
    createdAt: Date.now(),
    customer: { name: "Test Customer", phone: "9123 4567" },
    items: [
      { name: "Chicken Rice", quantity: 1, price: 4.5, modifications: "" },
      { name: "Ice Milo", quantity: 1, price: 2.0, modifications: "Less sugar" }
    ],
    notes: "This is a test order for demo."
  };

  // calculate totals simply
  let subtotal = 0;
  for (let i = 0; i < orderData.items.length; i++) {
    subtotal += (orderData.items[i].quantity || 1) * Number(orderData.items[i].price || 0);
  }
  orderData.subtotal = subtotal;
  orderData.tax = 0;
  orderData.total = subtotal;

  const ordersRef = ref(db, "vendors/" + currentVendorId + "/orders");
  const newRef = push(ordersRef);
  set(newRef, orderData);
}

// ===== Firebase LIVE =====
addTestOrderButton();

function startOrders(vendorId) {
  if (started) return;
  started = true;

  listenOrders(vendorId, function (list) {
    orders = list;
    renderAll();
  });
}

// Use logged-in UID if available, else DEMO vendor001
onAuthStateChanged(auth, (user) => {
  currentVendorId = user ? user.uid : DEMO_VENDOR_ID;
  console.log("Orders page vendorId =", currentVendorId);
  startOrders(currentVendorId);
});
