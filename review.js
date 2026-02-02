const stars = document.querySelectorAll(".stars span");
let rating = 0;

console.log(stars)

// Function to color stars up to a given index
function highlightStars(uptoIndex)
{
    stars.forEach((star, i) => {
        star.style.color = i <= uptoIndex ? "yellow" : "black";
    })
}

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
    });

    // Hover: temporary highlight
    star.addEventListener("mouseover", () => {
        highlightStars(index)
    })

    // Mouse out: revert to selected rating
    star.addEventListener("mouseout", () => {
        highlightStars(rating - 1);
    }) 
});

const submitbtn = document.querySelector("button");
const reviewtxt = document.getElementById("review");
const thankyou = document.getElementById("thankyou");

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

    // Reset form
    rating = 0;
    reviewtxt.value = "";
    highlightStars(-1);
})