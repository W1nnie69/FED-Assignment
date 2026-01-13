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

