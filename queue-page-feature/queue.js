const waitTime = document.getElementById("waitTime");
const orderready = document.getElementById("orderready");

// Generate a random wait time between min and max
function getRandomMin(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Initialize wait time with a random value between 2 and 10
let newWaitTime = getRandomMin(2, 10)
waitTime.textContent = newWaitTime

// Decrease wait time over time
const interval = setInterval(() =>
{
    newWaitTime = Math.max(0, newWaitTime - 1);
    waitTime.textContent = newWaitTime;

    if (newWaitTime === 0) {
        let message = "Order Ready!";

        orderready.textContent = message;
        orderready.classList.add("show");

        setTimeout(() => 
        {
            orderready.classList.remove("show");
        }, 3000);
    }
}, 6000);




