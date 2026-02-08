import { auth, listenOrders, listenMenuItems, getVendorProfile } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

// Demo fallback (same idea you used in vendor-profile.js)
const DEMO_VENDOR_ID = "vendor001";
let currentUid = DEMO_VENDOR_ID;

function $(id) {
  return document.getElementById(id);
}

function computeInitials(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] || "V";
  const b = parts[1]?.[0] || "";
  return (a + b).toUpperCase();
}

function startDashboard(vendorId) {
  // 1) Profile -> business name + avatar
  getVendorProfile(vendorId, (profile) => {
    const businessName =
      profile?.businessInfo?.businessName ||
      profile?.businessName ||
      "Vendor";

    const initials = computeInitials(businessName);

    const nameEl = $("dashBusinessName");
    const avatarEl = $("dashAvatar");

    if (nameEl) nameEl.textContent = businessName;
    if (avatarEl) avatarEl.textContent = initials;
  });

  // 2) Orders -> today revenue + total orders
  listenOrders(vendorId, (orders) => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const startTs = todayStart.getTime();

    let todayRevenue = 0;
    let totalOrders = orders.length;

    for (const o of orders) {
      const createdAt = Number(o.createdAt || 0);
      const isToday = createdAt >= startTs;
      const notCancelled = o.status !== "cancelled";

      if (isToday && notCancelled) {
        todayRevenue += Number(o.total || 0);
      }
    }

    const revenueEl = $("dashTodayRevenue");
    const ordersEl = $("dashTotalOrders");

    if (revenueEl) revenueEl.textContent = "$" + todayRevenue.toFixed(2);
    if (ordersEl) ordersEl.textContent = String(totalOrders);
  });

  // 3) Menu -> active menu item count
  listenMenuItems(vendorId, (items) => {
    // "available" in your firebase.js defaults to true
    const activeCount = items.filter((it) => it.available !== false).length;

    const menuCountEl = $("dashActiveMenuItems");
    if (menuCountEl) menuCountEl.textContent = String(activeCount);
  });

  // 4) Rating (optional)
  // If you DON'T store rating in Firebase yet, keep it as-is.
  // If later you store something like profile.rating, you can update here:
  //
  // getVendorProfile(vendorId, (profile) => {
  //   const rating = profile?.rating;
  //   if (rating != null && $("dashAvgRating")) $("dashAvgRating").textContent = String(rating);
  // });
}

// Auth -> use real user when logged in, else demo vendor001
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUid = user.uid;
    console.log("Dashboard using Auth UID:", currentUid);
  } else {
    console.log("Dashboard: no login detected, using DEMO vendor001");
  }

  startDashboard(currentUid);
});
