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
queueFill.style.width = ((10-newWaitTime)/10*100) + "%";

// Decrease wait time over time
const interval = setInterval(() =>
{
    newWaitTime = Math.max(0, newWaitTime - 1);
    waitTime.textContent = newWaitTime;
    queueFill.style.width = ((10-newWaitTime)/10*100) + "%";

    if (newWaitTime === 0) {

        orderready.textContent = "Order Ready!";
        orderready.classList.add("show");

        setTimeout(() => 
        {
            orderready.classList.remove("show");
        }, 3000);

        clearInterval(interval);

        location.href = "../order-endpage/order-endpage.html";
    }
}, 600);




