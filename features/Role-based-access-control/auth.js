/* ================================
   1. Import Firebase modules
================================ */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";

import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js"

import { firebaseConfig } from "../../assets/js/config.js";

/* ================================
   Initialize Firebase
================================ */
const app = initializeApp(firebaseConfig);
// const dbRef = ref(getDatabase());
const auth = getAuth(app);

// signOut(auth);

console.log("starting script");

export let currentUser = null;

let authResolved = false;
let callbacks = [];


// enforces auth with firebase, make sure user is logged in.
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    authResolved = true;

    callbacks.forEach(cb => cb());
    callbacks = [];

    if (window.router) window.router();

    // once user is logged in, it will redirect to the respective dashboard
    if (user) {
        const role = localStorage.getItem("role");
        if (location.hash === "#/login") {
            window.parent.location.hash = `#/${role}_dash`;
        }
    }
});

export function onAuthReady(cb) {
    if (authResolved) {
        cb();
    } else {
        callbacks.push(cb);
    }
}