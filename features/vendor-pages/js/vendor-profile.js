import { auth, getVendorProfile, updateVendorProfile } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";


const DEMO_VENDOR_ID = "vendor001";
let currentUid = DEMO_VENDOR_ID; // default to demo vendor

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUid = user.uid;
    console.log("Using Auth UID:", currentUid);
  } else {
    console.log("No login detected, using DEMO vendor001");
  }
  loadProfile(currentUid);
});


// ===== Helpers =====
function $(id) {
  return document.getElementById(id);
} ``

function setDisabled(sectionId, disabled) {
  if (sectionId === "operatingHours") {
    document.querySelectorAll(".operating-hours input").forEach(function (el) {
      el.disabled = disabled;
    });
    return;
  }

  const form = $(sectionId + "Form");
  if (!form) return;

  form.querySelectorAll("input, select, textarea").forEach(function (el) {
    el.disabled = disabled;
  });
}

function showActions(sectionId, show) {
  const actions = $(sectionId + "Actions");
  if (!actions) return;
  actions.classList.toggle("hidden", !show);
}

function showEditButton(sectionId, show) {
  const form = $(sectionId + "Form");
  const section = form ? form.closest(".section-card") : document.querySelector(".operating-hours").closest(".section-card");
  const btn = section.querySelector(".edit-btn");
  if (btn) btn.style.display = show ? "flex" : "none";
}

// ===== Edit UX (same behavior as your original, just safer) =====
function toggleEdit(e, sectionId) {
  setDisabled(sectionId, false);
  showActions(sectionId, true);
  showEditButton(sectionId, false);
}
window.toggleEdit = toggleEdit;

function cancelEdit(sectionId) {
  setDisabled(sectionId, true);
  showActions(sectionId, false);
  showEditButton(sectionId, true);

  // reload from Firebase so "Cancel" truly cancels
  if (currentUid) loadProfile(currentUid);
}
window.cancelEdit = cancelEdit;

// ===== Gather / Apply data =====
function getOperatingHours() {
  const days = ["mon","tue","wed","thu","fri","sat","sun"];
  const out = {};
  days.forEach(function (d) {
    out[d] = {
      active: $(d + "Active").checked,
      open: $(d + "Open").value,
      close: $(d + "Close").value
    };
  });
  return out;
}

function setOperatingHours(hours) {
  const days = ["mon","tue","wed","thu","fri","sat","sun"];
  days.forEach(function (d) {
    const h = (hours && hours[d]) ? hours[d] : null;
    if (!h) return;
    $(d + "Active").checked = !!h.active;
    $(d + "Open").value = h.open || $(d + "Open").value;
    $(d + "Close").value = h.close || $(d + "Close").value;
  });
}

function buildProfileData() {
  return {
    businessInfo: {
      businessName: $("businessName").value,
      businessType: $("businessType").value,
      cuisineTypes: $("cuisineTypes").value,
      taxId: $("taxId").value,
      businessDesc: $("businessDesc").value
    },
    contactInfo: {
      email: $("email").value,
      phone: $("phone").value,
      secondaryPhone: $("secondaryPhone").value,
      website: $("website").value,
      address: $("address").value
    },
    operatingHours: getOperatingHours()
  };
}

function applyProfileData(data) {
  if (!data) return;

  // Business
  if (data.businessInfo) {
    $("businessName").value = data.businessInfo.businessName || $("businessName").value;
    $("businessType").value = data.businessInfo.businessType || $("businessType").value;
    $("cuisineTypes").value = data.businessInfo.cuisineTypes || $("cuisineTypes").value;
    $("taxId").value = data.businessInfo.taxId || $("taxId").value;
    $("businessDesc").value = data.businessInfo.businessDesc || $("businessDesc").value;

    // update sidebar display
    $("displayBusinessName").textContent = $("businessName").value;

    // initials in circle
    const name = ($("businessName").value || "").trim();
    const parts = name.split(/\s+/);
    const initials = (parts[0] ? parts[0][0] : "V") + (parts[1] ? parts[1][0] : "");
    $("profileImage").textContent = initials.toUpperCase();
  }

  // Contact
  if (data.contactInfo) {
    $("email").value = data.contactInfo.email || $("email").value;
    $("phone").value = data.contactInfo.phone || $("phone").value;
    $("secondaryPhone").value = data.contactInfo.secondaryPhone || $("secondaryPhone").value;
    $("website").value = data.contactInfo.website || $("website").value;
    $("address").value = data.contactInfo.address || $("address").value;
  }

  // Hours
  if (data.operatingHours) setOperatingHours(data.operatingHours);
    // ===== LEFT PANEL (SIDEBAR) SYNC =====
  const sideEmail = document.getElementById("sideEmail");
  const sidePhone = document.getElementById("sidePhone");
  const sideMemberSince = document.getElementById("sideMemberSince");

  // these come from your form fields
  const emailVal = document.getElementById("email") ? document.getElementById("email").value : "";
  const phoneVal = document.getElementById("phone") ? document.getElementById("phone").value : "";
  const taxVal = document.getElementById("taxId") ? document.getElementById("taxId").value : "";

  if (sideEmail) sideEmail.textContent = emailVal || "-";
  if (sidePhone) sidePhone.textContent = phoneVal || "-";
  // Member since: if you don't store it in Firebase, just leave it as-is
  // (optional: you can set it once during signup, later)

}

function loadProfile(uid) {
  getVendorProfile(uid, function (profile) {
    applyProfileData(profile);

    // lock all fields after load
    setDisabled("businessInfo", true);
    setDisabled("contactInfo", true);
    setDisabled("operatingHours", true);

    showActions("businessInfo", false);
    showActions("contactInfo", false);
    showActions("operatingHours", false);

    showEditButton("businessInfo", true);
    showEditButton("contactInfo", true);
    showEditButton("operatingHours", true);
  });
}

// ===== Save handlers =====
function saveEdit(e, sectionId) {
  e.preventDefault();
  if (!currentUid) return alert("Please login first.");

  const data = buildProfileData();
  updateVendorProfile(currentUid, data).then(function () {
    applyProfileData(data);
    alert("Profile updated successfully!");
    cancelEdit(sectionId);
  });
}
window.saveEdit = saveEdit;

function saveOperatingHours() {
  if (!currentUid) return alert("Please login first.");

  const data = buildProfileData();
  updateVendorProfile(currentUid, data).then(function () {
    alert("Operating hours updated successfully!");
    cancelEdit("operatingHours");
  });
}
window.saveOperatingHours = saveOperatingHours;

