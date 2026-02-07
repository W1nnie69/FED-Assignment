const stars = document.querySelectorAll(".stars span");
const submitbtn = document.querySelector("button");
const reviewtxt = document.getElementById("review");
const thankyou = document.getElementById("thankyou");
const reviews = document.getElementById("reviews-container")
let rating = 0;

//Enable / disable submit button
function togglesubmitbutton() {
    if (rating > 0 || reviewtxt.value.trim() !== "") {
        submitbtn.disabled = false;
    } else {
        submitbtn.disabled = true;
    }
};

// Function to color stars up to a given index
function highlightStars(uptoIndex)
{
    stars.forEach((star, i) => {
        star.style.color = i <= uptoIndex ? "yellow" : "black";
    })
};

// Add click/hover interactions to stars
stars.forEach((star, index) => {
    
    // Click: select or deselect rating
    star.addEventListener("click", () => {
        if (rating === index + 1)
        {
            rating = 0;
            highlightStars(-1);
        }
        else
        {
            rating = index + 1;
            highlightStars(index);           
        }

        togglesubmitbutton();
    });

    // Hover: temporary highlight
    star.addEventListener("mouseover", () => {highlightStars(index)})

    // Mouse out: revert to selected rating
    star.addEventListener("mouseout", () => {highlightStars(rating - 1);}) 
});

reviewtxt.addEventListener("input", togglesubmitbutton);
submitbtn.disabled = true;

// Submit: show popup with rating/review and reset form
submitbtn.addEventListener("click", () => {
    let message = "Thank you for your feedback!"

    if (rating > 0)
    {
        message += "\nRating: " + rating + " stars";
    }

    if (reviewtxt.value.trim() !== "") 
    {
        message += "\nReview: " + reviewtxt.value;
    }

    // Display message in popup
    thankyou.textContent = message;
    thankyou.classList.add("show");

    // Hide popup after 3 seconds
    setTimeout(() => {
        thankyou.classList.remove("show");
    }, 3000);

    addReviewToPage(rating, reviewtxt.value.trim());

    // Reset form
    rating = 0;
    reviewtxt.value = "";
    highlightStars(-1);
    togglesubmitbutton();
});

//Add review to the page
function addReviewToPage(rating, text)
{
    const noReviewsMsg = reviews.querySelector("p");
    if (noReviewsMsg && noReviewsMsg.textContent === "No reviews yet.") 
    {
        noReviewsMsg.remove();
    }

    const reviewDiv = document.createElement("div");
    reviewDiv.classList.add("review");

    const starsSpan = document.createElement("p");
    starsSpan.textContent = "★".repeat(rating) + "☆".repeat(5 - rating);
    reviewDiv.appendChild(starsSpan);

    const reviewText = document.createElement("p");
    reviewText.textContent = text;
    reviewDiv.appendChild(reviewText);

    reviews.appendChild(reviewDiv);

}