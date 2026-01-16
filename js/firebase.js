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

import { firebaseConfig } from "./config.js";

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

//test
function writeTestData(userID, name, password) {
    set(ref(db, 'users/' + userID), {
        username: name,
        password: password
    });
}

//testing
function getUserData(userType, un) {
   userType = userType.toLowerCase();
   let dbpath = "";

   if (userType == "patrons") {
      dbpath = 'users/patrons';
   }
   else if (userType == "vendors") {
      dbpath = 'users/vendors';
   }
   else if (userType == "operator") {
      dbpath = 'users/operator';
   }  
   else {
      console.log("Invalid userType!");
      return;
   }

   const userData = ref(db, dbpath);
   onValue(userData, (snapshot) => {
      const users = snapshot.val();
      console.log(users);

      for (const userId in users) {
         if (users[userId].username === un)  {
            console.log("user exists");
            return;
         }
         else {
            console.log("User does not exist")
            return;
         }
      }
   });

   
}

getUserData("patrons", "dani")

