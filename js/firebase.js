import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  set,
  update,
  remove,
  onValue
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const auth = getAuth(app);

/* ================================
   VENDOR MENU FUNCTIONS
   Path: vendors/{vendorId}/menuItems
================================ */

/**
 * Listen to menu items (LIVE updates)
 */
export function listenMenuItems(vendorId, callback) {
  const menuRef = ref(db, "vendors/" + vendorId + "/menuItems");

  onValue(menuRef, function (snapshot) {
    const data = snapshot.val() || {};
    const items = [];

    for (const key in data) {
      items.push({
        id: key,
        name: data[key].name || "",
        description: data[key].description || "",
        price: data[key].price || 0,
        category: data[key].category || "",
        cuisine: data[key].cuisine || "", 
        available: data[key].available ?? true
      });
    }

    callback(items);
  });
}

/**
 * Add new menu item
 */
export function addMenuItem(vendorId, itemData) {
  const menuRef = ref(db, "vendors/" + vendorId + "/menuItems");
  const newItemRef = push(menuRef);

  return set(newItemRef, itemData);
}

/**
 * Update existing menu item
 */
export function updateMenuItem(vendorId, itemId, itemData) {
  const itemRef = ref(db, "vendors/" + vendorId + "/menuItems/" + itemId);
  return update(itemRef, itemData);
}

/**
 * Delete menu item
 */
export function deleteMenuItem(vendorId, itemId) {
  const itemRef = ref(db, "vendors/" + vendorId + "/menuItems/" + itemId);
  return remove(itemRef);
}




/* ================================
   VENDOR ORDERS FUNCTIONS
   Path: vendors/{vendorId}/orders
================================ */

/**
 * Listen to orders (LIVE)
 */
export function listenOrders(vendorId, callback) {
  const ordersRef = ref(db, "vendors/" + vendorId + "/orders");

  onValue(ordersRef, function (snapshot) {
    const data = snapshot.val() || {};
    const orders = [];

    for (const key in data) {
      orders.push({
        id: key,
        ...data[key]
      });
    }

    callback(orders);
  });
}

/**
 * Update order status
 */
export function updateOrderStatus(vendorId, orderId, status) {
  const orderRef = ref(db, "vendors/" + vendorId + "/orders/" + orderId);
  return update(orderRef, { status: status });
}




/* ================================
   VENDOR PROFILE FUNCTIONS
   Path: vendors/{vendorId}/profile
================================ */

export function getVendorProfile(vendorId, callback) {
  const profileRef = ref(db, "vendors/" + vendorId + "/profile");

  onValue(profileRef, function (snapshot) {
    callback(snapshot.val());
  });
}

export function updateVendorProfile(vendorId, profileData) {
  const profileRef = ref(db, "vendors/" + vendorId + "/profile");
  return update(profileRef, profileData);
}




