// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import {
    getDatabase,
    ref,
    push,
    get,
    child
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

import { firebaseConfig } from "../../assets/js/config.js";


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db);
const reviewsRef = ref(db, "reviews");


// DOM elements
const stars = document.querySelectorAll(".stars span");
const submitbtn = document.getElementById("submitReview");
const reviewtxt = document.getElementById("review");
const thankyou = document.getElementById("thankyou");
const reviews = document.getElementById("reviews-container");

let rating = 0;


// Enable / disable submit button
function toggleSubmitButton() {
    submitbtn.disabled = !(rating > 0 || reviewtxt.value.trim() !== "");
}


// Highlight stars
function highlightStars(uptoIndex) {
    stars.forEach((star, i) => {
        star.style.color = i <= uptoIndex ? "yellow" : "black";
    });
}


// Star interactions
stars.forEach((star, index) => {

    star.addEventListener("click", () => {
        if (rating === index + 1) {
            rating = 0;
            highlightStars(-1);
        } else {
            rating = index + 1;
            highlightStars(index);
        }
        toggleSubmitButton();
    });

    star.addEventListener("mouseover", () => {
        highlightStars(index);
    });

    star.addEventListener("mouseout", () => {
        highlightStars(rating - 1);
    });
});

reviewtxt.addEventListener("input", toggleSubmitButton);
submitbtn.disabled = true;


// Add review to page
function addReviewToPage(rating, text) {
    const noReviewsMsg = reviews.querySelector("p");
    if (noReviewsMsg && noReviewsMsg.textContent === "No reviews yet.") {
        noReviewsMsg.remove();
    }

    const reviewDiv = document.createElement("div");
    reviewDiv.classList.add("review");

    const starsP = document.createElement("p");
    starsP.textContent = "★".repeat(rating) + "☆".repeat(5 - rating);

    const textP = document.createElement("p");
    textP.textContent = text;

    reviewDiv.appendChild(starsP);
    reviewDiv.appendChild(textP);
    reviews.appendChild(reviewDiv);
}


// Save review to Firebase
function saveReviewToFirebase(rating, text) {
    push(reviewsRef, {
        rating: rating,
        text: text,
        timestamp: Date.now()
    });
}

// Load reviews from Firebase
function loadReviewsFromFirebase() {
    get(child(dbRef, "reviews"))
        .then(snapshot => {
            reviews.innerHTML = "";

            if (!snapshot.exists()) {
                reviews.innerHTML = "<p>No reviews yet.</p>";
                return;
            }

            const data = snapshot.val();
            Object.values(data).forEach(review => {
                addReviewToPage(review.rating, review.text);
            });
        })
        .catch(error => {
            console.error("Error loading reviews:", error);
        });
}

// Submit review
submitbtn.addEventListener("click", () => {
    if (rating === 0 && reviewtxt.value.trim() === "") return;

    // Popup message
    let message = "Thank you for your feedback!";
    if (rating > 0) message += "\nRating: " + rating + " stars";
    if (reviewtxt.value.trim() !== "") message += "\nReview: " + reviewtxt.value;

    thankyou.textContent = message;
    thankyou.classList.add("show");

    setTimeout(() => {
        thankyou.classList.remove("show");
    }, 3000);

    // Save to Firebase
    saveReviewToFirebase(rating, reviewtxt.value.trim());

    // Show immediately
    addReviewToPage(rating, reviewtxt.value.trim());

    // Reset form
    rating = 0;
    reviewtxt.value = "";
    highlightStars(-1);
    toggleSubmitButton();
});

// Load reviews on page load
loadReviewsFromFirebase();
