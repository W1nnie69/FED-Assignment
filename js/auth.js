/* ================================
   1. Import Firebase modules
================================ */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import {
    getDatabase,
    ref,
    push,
    set,
    get,
    update,
    remove,
    child,
    onValue
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js"

/* ================================
   Firebase configuration
   (Please DO NOT SHARE THIS!!)
================================ */
const firebaseConfig = {
    apiKey: "AIzaSyD1Mi5NbFyBoXzaJvqVLF0w6GV5a57fhAg",
    authDomain: "fed-assignment-e2628.firebaseapp.com",
    databaseURL: "https://fed-assignment-e2628-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "fed-assignment-e2628",
    storageBucket: "fed-assignment-e2628.firebasestorage.app",
    messagingSenderId: "648176446382",
    appId: "1:648176446382:web:6ee0309ddc7bb80afcf63f"

};


/* ================================
   Initialize Firebase
================================ */
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

const docTitle = document.title

let loginForm;
let loginerrorMsg;
let signupForm;
let signuperrorMsg;

if (docTitle == "Login page") {
    loginForm = document.getElementById('loginForm');
    loginerrorMsg = document.getElementById('loginerrorMsg');

    loginForm.addEventListener("submit", function(event) {
    event.preventDefault(); //stop form from submiting as there is no REAL backend...

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    //call firebase auth func 
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log("Logging on as:", user)
            loginerrorMsg.style.color = 'green';
            loginerrorMsg.textContent = "Login successful!";

            setTimeout(() => {
                window.location.href = "dashboard.html" //redirect to dashboard
            }, 2000);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`errorCode: ${errorCode}, errorMessage: ${errorMessage}`)
            loginerrorMsg.style.color = 'red';
            loginerrorMsg.textContent = "Invalid username or password.";
        });
});
}
else if (docTitle == "Sign up page") {
    signupForm = document.getElementById('signupForm');
    signuperrorMsg = document.getElementById('signuperrorMsg');

    signupForm.addEventListener("submit", function(event) {
    event.preventDefault(); //stop form from submiting as there is no REAL backend...

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // SIGNED UP 
            const user = userCredential.user;
            console.log("Logging on as:", user)
            signuperrorMsg.style.color = 'green';
            signuperrorMsg.textContent = "User creation successful!";

            setTimeout(() => {
                window.location.href = "dashboard.html" //redirect to dashboard
            }, 2000);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`errorCode: ${errorCode}, errorMessage: ${errorMessage}`)
            signuperrorMsg.style.color = 'red';
            signuperrorMsg.textContent = "Something went wrong with signup thing.";
        });
    });
}



