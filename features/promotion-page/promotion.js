const claimButtons = document.querySelectorAll(".claim-btn");
const promoPopup = document.getElementById("promo-popup");

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
        button.textContent = "Claimed";
    });
});