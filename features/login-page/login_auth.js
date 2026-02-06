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

// login page init, to set up listeners for clicking
export function initLoginPage() {
    document.getElementById("showpopup")?.addEventListener("click", () => {
        document.getElementById("popup").style.display = "flex";
    });

    document.querySelector("#popup .buttons button")?.addEventListener("click", () => {
        document.getElementById("popup").style.display = "none";
    });

    
}

const loginForm = document.getElementById('loginForm');
const loginerrorMsg = document.getElementById('loginerrorMsg');

loginForm.addEventListener("submit", function(event) {
    event.preventDefault(); //stop form from submiting as there is no REAL backend...

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // calls the signOut function to ensure any existing user isnt signed in lol
    signOut(auth);

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
                    const userRole = userData.role;
                    console.log("User role:", userRole);
                    loginerrorMsg.style.color = 'green';
                    loginerrorMsg.textContent = "Login successful!";

                    // cache user's role in localstorage
                    localStorage.setItem("role", userRole);
                    
                } else {
                    console.log("No user data found in db (u messed up)");
                }
            }).catch((error) => {
                console.log("error:", error);
            });

            setTimeout(() => {
                // window.location.href = "vendor_dashboard.html"
                window.location.href = `${localStorage.getItem("role")}_dashboard.html` //redirect to dashboard appropriate dashboard
            }, 2000);
            
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`errorCode: ${errorCode}, errorMessage: ${errorMessage}`);
            loginerrorMsg.style.color = 'red';
            loginerrorMsg.textContent = "Invalid username or password.";
        });
});