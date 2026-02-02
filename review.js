const stars = document.querySelectorAll(".stars span");
let rating = 0;

console.log(stars)

function highlightStars(uptoIndex)
{
    stars.forEach((star, i) => {
        star.style.color = i <= uptoIndex ? "yellow" : "black";
    })
}

stars.forEach((star, index) => {
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

    star.addEventListener("mouseover", () => {
        highlightStars(index)
    })

    star.addEventListener("mouseout", () => {
        highlightStars(rating - 1);
    }) 
});

const submitbtn = document.querySelector("button");
const reviewtxt = document.getElementById("review");
const thankyou = document.getElementById("thankyou");

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

    thankyou.textContent = message;
    thankyou.classList.add("show");

    setTimeout(() => {
        thankyou.classList.remove("show");
    }, 3000);

    rating = 0;
    reviewtxt.value = "";
    highlightStars(-1);
})