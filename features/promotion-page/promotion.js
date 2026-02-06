const claimButtons = document.querySelectorAll(".claim-btn");
const promoPopup = document.getElementById("promo-popup");

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
    });
});