// Wait until the page fully loads
document.addEventListener("DOMContentLoaded", () => {

  // Base price of the item (Regular size, no add-ons)
  const basePrice = 5.50;

  // Extra cost if Large is selected
  let sizeExtra = 0;

  // Default quantity
  let quantity = 1;

  // Total cost of selected add-ons
  let addonTotal = 0;

  // Base nutrition values (Regular, no add-ons)
  const baseNutrition = {
    calories: 520,
    protein: 28,
    carbs: 42,
    fat: 24
  };

  // Extra nutrition added from size or add-ons
  let nutritionExtra = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  };

  // Get elements from HTML to update dynamically
  const priceDisplay = document.querySelector(".price");
  const totalDisplay = document.querySelector(".addtotal");
  const qtyNum = document.querySelector(".qty-num");

  const calEl = document.querySelector(".calories");
  const proteinEl = document.querySelector(".protein");
  const carbsEl = document.querySelector(".carbs");
  const fatEl = document.querySelector(".fat");

  const sizeButtons = document.querySelectorAll(".pill");
  const addonButtons = document.querySelectorAll(".addon");
  const qtyButtons = document.querySelectorAll(".qty-btn");

  // Main function that updates price + nutrition
  function updateAll() {

    // Calculate single item price
    const singleItemPrice = basePrice + sizeExtra + addonTotal;

    // Multiply by quantity
    const totalPrice = singleItemPrice * quantity;

    // Update price display
    priceDisplay.textContent = `$${singleItemPrice.toFixed(2)}`;
    totalDisplay.textContent = `$${totalPrice.toFixed(2)}`;

    // Calculate total nutrition (including extras and quantity)
    const totalNutrition = {
      calories: (baseNutrition.calories + nutritionExtra.calories) * quantity,
      protein: (baseNutrition.protein + nutritionExtra.protein) * quantity,
      carbs: (baseNutrition.carbs + nutritionExtra.carbs) * quantity,
      fat: (baseNutrition.fat + nutritionExtra.fat) * quantity
    };

    // Update nutrition display
    calEl.textContent = totalNutrition.calories;
    proteinEl.textContent = totalNutrition.protein + "g";
    carbsEl.textContent = totalNutrition.carbs + "g";
    fatEl.textContent = totalNutrition.fat + "g";
  }

  // ======================
  // SIZE SELECTION
  // ======================

  sizeButtons.forEach(btn => {
    btn.addEventListener("click", () => {

      // Remove active class from all buttons
      sizeButtons.forEach(b => b.classList.remove("active"));

      // Add active class to selected button
      btn.classList.add("active");

      // If Large selected
      if (btn.textContent.includes("Large")) {
        sizeExtra = 1.50;               // Add extra cost
        nutritionExtra.calories = 120;  // Add extra calories
        nutritionExtra.carbs = 15;      // Add extra carbs
      } else {
        // If Regular selected
        sizeExtra = 0;
        nutritionExtra.calories = 0;
        nutritionExtra.carbs = 0;
      }

      // Recalculate everything
      updateAll();
    });
  });

  // ======================
  // ADD-ONS SELECTION
  // ======================

  addonButtons.forEach(btn => {
    btn.addEventListener("click", () => {

      // Get price text like "+$1.00"
      const priceText = btn.querySelector(".addon-price").textContent;

      // Convert to number (remove "+$")
      const addonPrice = parseFloat(priceText.replace("+$", ""));

      // If already selected → remove it
      if (btn.classList.contains("selected")) {

        btn.classList.remove("selected");
        addonTotal -= addonPrice;

        // Remove extra nutrition
        nutritionExtra.calories -= 50;
        nutritionExtra.protein -= 3;

      } else {
        // If not selected → add it

        btn.classList.add("selected");
        addonTotal += addonPrice;

        // Add extra nutrition
        nutritionExtra.calories += 50;
        nutritionExtra.protein += 3;
      }

      // Recalculate everything
      updateAll();
    });
  });

  // ======================
  // QUANTITY BUTTONS
  // ======================

  qtyButtons.forEach(btn => {
    btn.addEventListener("click", () => {

      // Increase quantity
      if (btn.textContent === "+") quantity++;

      // Decrease quantity (minimum 1)
      if (btn.textContent === "−" && quantity > 1) quantity--;

      // Update quantity display
      qtyNum.textContent = quantity;

      // Recalculate price & nutrition
      updateAll();
    });
  });

}); // End of DOMContentLoaded


// ======================
// ADD TO CART BUTTON
// ======================

document.querySelector(".addcart").addEventListener("click", () => {

  const CART_KEY = "cart";

  // Get item name
  const name = document.querySelector(".item-page-title").textContent;

  // Get current single-item price (remove "$")
  const price = parseFloat(
    document.querySelector(".price").textContent.replace("$","")
  );

  // Get quantity
  const qty = parseInt(
    document.querySelector(".qty-num").textContent
  );

  // Get existing cart from localStorage
  const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

  // Add new item to cart
  cart.push({ name, price, qty });

  // Save updated cart
  localStorage.setItem(CART_KEY, JSON.stringify(cart));

});
