const likeButtons = document.querySelectorAll(".like-btn");
const profileIcon = document.getElementById("profileIcon");
const profileMenu = document.getElementById("profileMenu");
const profileLinks = document.querySelectorAll(".profile-link");


profileIcon.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent click from closing immediately
    profileMenu.classList.toggle("hidden");
});

// Close the menu if clicking outside
document.addEventListener("click", () => {
    if (!profileMenu.classList.contains("hidden")) {
        profileMenu.classList.add("hidden");
    }
});

profileLinks.forEach(link => {
    link.addEventListener("click", () => {
        const text = link.textContent.trim();

        if (text === "Promotion") {
            window.location.href = "../promotion-page/promotion.html";
        }

        if (text === "Review") {
            window.location.href = "../review-page-feature/review_page.html";
        }
    });
});

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