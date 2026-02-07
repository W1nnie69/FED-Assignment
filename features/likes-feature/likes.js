const likeButtons = document.querySelectorAll(".like-btn");



// Loop through each like button
likeButtons.forEach(button => 
{
    // Get the <span> inside the button that shows the like count
    const countSpan = button.querySelector(".like-count");
    let count = parseInt(countSpan.textContent);
    // Track whether the user has liked this item
    let liked = false;

    button.addEventListener("click",() =>
    {
        if (!liked)
        {
            count++;
            liked = true;
            button.classList.add("liked");
        }
        else
        {
            count--;
            liked = false;
            button.classList.remove("liked");
        }

        countSpan.textContent = count;

    });
});