/* ================================
   1. Import Firebase modules
================================ */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import {
    getDatabase,
    ref,
    get,
    child
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js"

import { firebaseConfig } from "./config.js";

/* ================================
   Initialize Firebase
================================ */
const app = initializeApp(firebaseConfig);
const dbRef = ref(getDatabase());
const auth = getAuth(app);

const loginForm = document.getElementById('loginForm');
const loginerrorMsg = document.getElementById('loginerrorMsg');

loginForm.addEventListener("submit", function(event) {
    event.preventDefault(); //stop form from submiting as there is no REAL backend...

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    //call firebase auth func 
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in thru auth
            const user = userCredential.user;
            console.log("Logging on as:", user.uid)
            
            // const userRef = ref(db, "users/" + user.uid);
            
            // queries the db for user's role
            get(child(dbRef, `users/${user.uid}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    console.log("user data", userData);
                    const role = userData.role;
                    console.log("User role:", role);
                    loginerrorMsg.style.color = 'green';
                    loginerrorMsg.textContent = "Login successful!";
                } else {
                    console.log("No user data found in db (u messed up)");
                }
            }).catch((error) => {
                console.log("error:", error);
            });

            // setTimeout(() => {
            //     window.location.href = "dashboard.html" //redirect to dashboard
            // }, 2000);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`errorCode: ${errorCode}, errorMessage: ${errorMessage}`);
            loginerrorMsg.style.color = 'red';
            loginerrorMsg.textContent = "Invalid username or password.";
        });
});