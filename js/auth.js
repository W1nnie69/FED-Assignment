/* ================================
   1. Import Firebase modules
================================ */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
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
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js"

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
const auth = getAuth();

//firebase auth func... This should just work i think?
createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        //signed up..
        const user = userCredential.user;
        console.log("User created:", user)

    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`errorCode: ${errorCode}, errorMessage: ${errorMessage}`)
    });

//another firebase auth func
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log("Logging on as:", user)
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(`errorCode: ${errorCode}, errorMessage: ${errorMessage}`)
  });

const form = document.getElementById('loginForm');
const errorMsg = document.getElementsById('errorMsg');