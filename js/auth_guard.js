/* ================================
   1. Import Firebase modules
================================ */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";

import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js"

import { firebaseConfig } from "./config.js";

/* ================================
   Initialize Firebase
================================ */
const app = initializeApp(firebaseConfig);
// const dbRef = ref(getDatabase());
const auth = getAuth(app);

// signOut(auth);

console.log("starting script");

// enforces auth with firebase, make sure user is logged in.
onAuthStateChanged(auth, user => {
  if (!user) {
    // Not logged in
    console.log("user not logged in");
    alert("You are not logged in!");
    window.location.replace("login.html");
    return;
    }
    
    // document.body.classList.remove("hidden");
    console.log("user is logged");
    
    // enforces role based access control to disallow user mismatch (e.g. vendor accessing operator pages)
    const requiredRole = document.body.dataset.requiredRole;
    const userRole = localStorage.getItem("role");

    // if the page doesnt require any roles, function will return.
    if (!requiredRole) return;

    if (!userRole || userRole !== requiredRole) {
        alert("Access denied");
        window.location.replace("login.html");
    }
});
   