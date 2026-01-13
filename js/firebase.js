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
    child
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

/* ================================
   Firebase configuration
   (REPLACE with your own config)
================================ */
const firebaseConfig = {
    apiKey: "AIzaSyDpxmMVUhqos1w-gweyDdjC2qzWbNCLlQY",
    authDomain: "fed-assignment-7cc11.firebaseapp.com",
    databaseURL: "https://fed-assignment-7cc11-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "fed-assignment-7cc11",
    storageBucket: "fed-assignment-7cc11.firebasestorage.app",
    messagingSenderId: "738434802843",
    appId: "1:738434802843:web:8263aad78ca97cbb5c923e"
};


/* ================================
   Initialize Firebase
================================ */
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* ================================
   Helper: Log output
================================ */
// const log = document.getElementById("log");

// function writeLog(message) {
//     log.textContent += message + "\n";
//     log.scrollTop = log.scrollHeight;
// }
console.log("Checking db:")
console.log(db)

function writeTestData(userID, name, password) {
    set(ref(db, 'users/' + userID), {
        username: name,
        password: password
    });
}

console.log("Writing test data")
writeTestData("s000", "dani", "password")

