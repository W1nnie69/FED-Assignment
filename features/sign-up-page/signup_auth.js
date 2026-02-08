/* ================================
   1. Import Firebase modules
================================ */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import {
    getDatabase,
    ref,
    set
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js"

import { firebaseConfig } from "../../assets/js/config.js";

/* ================================
   Initialize Firebase
================================ */
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

const params = new URLSearchParams(window.location.search);
const role = params.get("role");

document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById('signupForm');
    const signuperrorMsg = document.getElementById('signuperrorMsg');

    console.log("Attaching signup listener");
    sessionStorage.clear("role");
    sessionStorage.clear("userid");

    signupForm.addEventListener("submit", function(event) {
        console.log("submit event fired");
        event.preventDefault(); //stop form from submiting as there is no REAL backend...

        try {
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // SIGNED UP THRU FIREBASE AUTH
                    const user = userCredential.user;
                    console.log("Logging on as:", user, user.uid)
                    signuperrorMsg.style.color = 'green';
                    signuperrorMsg.textContent = "User creation successful!";

                    // Create a user "object" in the db
                    // User role is assigned based on the selection during the signup
                    set(ref(db, 'users/' + user.uid), {
                        email: email,
                        role: role,
                    })
                    .then(() => {
                        alert("Success! You will be redirected to the login page.");
                
                        window.parent.location.hash = "#/login" //redirect to login page
                        

                    })
                    .catch((error) => {
                        console.error("Error writing to DB:", error);
                        alert("There was an error signing up. Please try again.");
                    })
                    
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(`errorCode: ${errorCode}, errorMessage: ${errorMessage}`)
                    signuperrorMsg.style.color = 'red';
                    signuperrorMsg.textContent = "Something went wrong with signup thing.";
                });

        } catch(err) {
            console.log(err);
        }
    });
});


