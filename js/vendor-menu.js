import { auth, listenMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

const DEMO_VENDOR_ID = "vendor001";
let currentVendorId = DEMO_VENDOR_ID;


let items = [];
let editId = null;
let started = false;

// ===== DOM =====
const menuGrid = document.getElementById("menuGrid");
const menuModal = document.getElementById("menuModal");
const modalTitle = document.getElementById("modalTitle");
const menuForm = document.getElementById("menuForm");

const itemName = document.getElementById("itemName");
const itemDescription = document.getElementById("itemDescription");
const itemPrice = document.getElementById("itemPrice");
const itemCategory = document.getElementById("itemCategory");
const itemCuisine = document.getElementById("itemCuisine");
const itemStatus = document.getElementById("itemStatus");

// filters
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const cuisineFilter = document.getElementById("cuisineFilter");
const statusFilter = document.getElementById("statusFilter");

// ===== MODAL =====
function openModal(title) {
  modalTitle.textContent = title;
  menuModal.classList.add("active"); // IMPORTANT: your CSS uses .active
}

function closeModal() {
  menuModal.classList.remove("active");
  menuForm.reset();
  editId = null;
}

function openAddModal() {
  editId = null;
  menuForm.reset();
  itemStatus.value = "available";
  openModal("Add Menu Item");
}

window.openAddModal = openAddModal;
window.closeModal = closeModal;

// ===== RENDER =====
function render(list) {
  menuGrid.innerHTML = "";

  if (list.length === 0) {
    menuGrid.innerHTML = "<p>No items found.</p>";
    return;
  }

  for (let i = 0; i < list.length; i++) {
    const it = list[i];

    const isAvailable = it.available !== false;
    const badgeClass = isAvailable ? "badge-available" : "badge-soldout";
    const badgeText = isAvailable ? "Available" : "Sold Out";

    // simple “image placeholder” (no real upload)
    const placeholder = (it.name || "🍽").trim().charAt(0).toUpperCase();

    // tags area: show cuisine as a tag (clean + matches your original tag styling)
    const tagsHTML = it.cuisine
      ? `<span class="tag">${it.cuisine}</span>`
      : "";

    const card = document.createElement("div");
    card.className = "menu-card";

    card.innerHTML = `
      <div class="menu-image">
        ${placeholder}
        <div class="availability-badge ${badgeClass}">${badgeText}</div>
      </div>

      <div class="menu-content">
        <div class="menu-header">
          <div>
            <div class="menu-title">${it.name || ""}</div>
          </div>
          <div class="menu-price">$${Number(it.price || 0).toFixed(2)}</div>
        </div>

        <div class="menu-category">${it.category || "-"}</div>

        <div class="menu-description">${it.description || ""}</div>

        <div class="menu-tags">
          ${tagsHTML}
        </div>

        <div class="menu-actions">
          <button class="btn-icon edit" data-action="edit" data-id="${it.id}">Edit</button>
          <button class="btn-icon delete" data-action="delete" data-id="${it.id}">Delete</button>
          <button class="btn-icon toggle ${isAvailable ? "" : "soldout"}" data-action="toggle" data-id="${it.id}">
            ${isAvailable ? "Mark Sold Out" : "Mark Available"}
          </button>
        </div>
      </div>
    `;

    menuGrid.appendChild(card);
  }
}


// ===== FILTER =====
function filterMenu() {
  const search = (searchInput.value || "").toLowerCase();
  const cat = categoryFilter.value;
  const cui = cuisineFilter.value;
  const stat = statusFilter.value;

  const filtered = items.filter(function (it) {
    const name = (it.name || "").toLowerCase();
    const desc = (it.description || "").toLowerCase();

    const matchSearch = !search || name.includes(search) || desc.includes(search);
    const matchCat = !cat || it.category === cat;
    const matchCui = !cui || it.cuisine === cui;

    const isAvailable = it.available !== false;
    const matchStat =
      !stat ||
      (stat === "available" && isAvailable) ||
      (stat === "soldout" && !isAvailable);

    return matchSearch && matchCat && matchCui && matchStat;
  });

  render(filtered);
}

window.filterMenu = filterMenu;

// If you remove inline onchange later, these still work:
searchInput && searchInput.addEventListener("input", filterMenu);
categoryFilter && categoryFilter.addEventListener("change", filterMenu);
cuisineFilter && cuisineFilter.addEventListener("change", filterMenu);
statusFilter && statusFilter.addEventListener("change", filterMenu);

// ===== EDIT/DELETE BUTTONS =====
menuGrid.addEventListener("click", function (e) {
  if (e.target.tagName !== "BUTTON") return;

  const action = e.target.dataset.action;
  const id = e.target.dataset.id;
  if (!action || !id) return;

  const it = items.find(function (x) { return x.id === id; });
  if (!it) return;

  if (action === "edit") {
    editId = id;
    itemName.value = it.name || "";
    itemDescription.value = it.description || "";
    itemPrice.value = it.price || "";
    itemCategory.value = it.category || "";
    itemCuisine.value = it.cuisine || "";
    itemStatus.value = (it.available === false) ? "soldout" : "available";
    openModal("Edit Menu Item");
  }

  if (action === "delete") {
    if (confirm("Delete this item?")) deleteMenuItem(currentVendorId, id);
  }
  if (action === "toggle") {
  const newAvailability = (it.available === false); // if sold out, make available
  updateMenuItem(currentVendorId, id, { available: newAvailability });
  return;
  }  
});

// ===== SAVE =====
menuForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const data = {
    name: itemName.value.trim(),
    description: itemDescription.value.trim(),
    price: Number(itemPrice.value),
    category: itemCategory.value,
    cuisine: itemCuisine.value,
    available: (itemStatus.value === "available")
  };

  if (editId) updateMenuItem(currentVendorId, editId, data);
  else addMenuItem(currentVendorId, data);

  closeModal();
});

// ===== FIREBASE LIVE =====
function startMenu(vendorId) {
  if (started) return;
  started = true;

  listenMenuItems(vendorId, function (list) {
    items = list;
    filterMenu();
  });
}

// Use logged-in UID if available, else DEMO vendor001
onAuthStateChanged(auth, (user) => {
  currentVendorId = user ? user.uid : DEMO_VENDOR_ID;
  console.log("Menu page vendorId =", currentVendorId);

  startMenu(currentVendorId);
});