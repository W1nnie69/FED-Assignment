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

import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js"

import { firebaseConfig } from "../../assets/js/config.js";

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

    // calls the signOut function to ensure any existing user isnt signed in lol
    // signOut(auth);

    //call firebase auth func 
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in thru auth
            const user = userCredential.user;
            console.log("Logging on as:", user.uid)
            
            // queries the db for user's role
            get(child(dbRef, `users/${user.uid}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    console.log("user data", userData);
                    const userRole = userData.role;
                    console.log("User role:", userRole);
                    loginsuccessMsg.textContent = "Login successful!";

                    // cache user's role in localstorage
                    // cache user's id in sessionstorage
                    localStorage.setItem("role", userRole);
                    sessionStorage.setItem("userid", user.uid);
                    
                } else {
                    console.log("No user data found in db (u messed up)");
                }
            }).catch((error) => {
                console.log("error:", error);
            });            
        
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`errorCode: ${errorCode}, errorMessage: ${errorMessage}`);
            loginerrorMsg.style.color = 'red';
            loginerrorMsg.textContent = "Invalid username or password.";
        });
});