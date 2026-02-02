const stars = document.querySelectorAll(".stars span");

console.log(stars)

stars.forEach(function(star, index)
{
    star.addEventListener("click", function()
    {
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