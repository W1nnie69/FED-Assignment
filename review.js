const stars = document.querySelectorAll(".stars span");
let rating = 0;

console.log(stars)

stars.forEach(function(star, index)
{
    star.addEventListener("click", function()
    {
        rating = index + 1

        for (let i = 0; i < stars.length; i++)
        {
            if (i <= index)
            {
                stars[i].style.color = "yellow";
            }

            else
            {
                stars[i].style.color = "black";
            }
        }
        
    });
});

const submitbtn = document.querySelector("button");
const reviewtxt = document.getElementById("review");
const thankyou = document.getElementById("thankyou");

submitbtn.addEventListener("click", function()
{
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
    reviewText.value = "";
    stars.forEach(star => star.style.color = "black");
})