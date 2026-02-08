const claimButtons = document.querySelectorAll(".claim-btn");
const promoPopup = document.getElementById("promo-popup");
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

        if (text === "Likes") {
            window.location.href = "../likes-feature/likes.html";
        }

        if (text === "Review") {
            window.location.href = "../review-page-feature/review_page.html";
        }
    });
});

// Loop through each claim button and add a click event
claimButtons.forEach(button => 
{
    button.addEventListener("click", () =>
    {
        const promoName = button.parentElement.querySelector("h2").textContent;

        promoPopup.textContent = `You Claimed: ${promoName}`;
        promoPopup.classList.add("show");

        setTimeout(() => {
            promoPopup.classList.remove("show");
        }, 3000);

        // Disable the button so it can't be clicked again
        button.disabled = true;
        button.style.backgroundColor = "#888";
        button.style.cursor = "not-allowed";
        button.textContent = "Claimed";
    });
});