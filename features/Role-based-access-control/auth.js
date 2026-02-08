/* ================================
   1. Import Firebase modules
================================ */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";

import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js"

import {
    getDatabase,
    ref,
    get,
    child
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

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


// This auth listener runs when a page loads, user logs in or user logs out
onAuthStateChanged(auth, (user) => {
    // Saves the user state (important!)
    currentUser = user;
    authResolved = true;

    callbacks.forEach(cb => cb());
    callbacks = [];

    if (!user) {
        if (window.router) window.router();
        return;
    }

    // once user is logged in, it query the db for user's data such as their role
    // then with that it redirects the user accordingly
    const dbRef = ref(getDatabase());

    try {
        get(child(dbRef, `users/${user.uid}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                const userRole = userData.role;
                
                sessionStorage.setItem("role", userRole);
                sessionStorage.setItem("userid", user.uid);
                
                if (location.hash === "#/login") {
                    location.hash = `#/${userRole}_main`;
                }
            } else {
                console.error("No user data in DB!");
            }
        })
    } catch(error) {
        console.error("Failed to get user data!!!!!!!!!");
    }

    if (window.router) window.router();
});

export function onAuthReady(cb) {
    if (authResolved) {
        cb();
    } else {
        callbacks.push(cb);
    }
}