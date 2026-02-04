document.addEventListener("DOMContentLoaded", () => {

  const basePrice = 5.50;
  let sizeExtra = 0;
  let quantity = 1;
  let addonTotal = 0;

  // Base nutrition (Regular, no addons)
  const baseNutrition = {
    calories: 520,
    protein: 28,
    carbs: 42,
    fat: 24
  };

  let nutritionExtra = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  };

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

  function updateAll() {

    const singleItemPrice = basePrice + sizeExtra + addonTotal;
    const totalPrice = singleItemPrice * quantity;

    priceDisplay.textContent = `$${singleItemPrice.toFixed(2)}`;
    totalDisplay.textContent = `$${totalPrice.toFixed(2)}`;

    const totalNutrition = {
      calories: (baseNutrition.calories + nutritionExtra.calories) * quantity,
      protein: (baseNutrition.protein + nutritionExtra.protein) * quantity,
      carbs: (baseNutrition.carbs + nutritionExtra.carbs) * quantity,
      fat: (baseNutrition.fat + nutritionExtra.fat) * quantity
    };

    calEl.textContent = totalNutrition.calories;
    proteinEl.textContent = totalNutrition.protein + "g";
    carbsEl.textContent = totalNutrition.carbs + "g";
    fatEl.textContent = totalNutrition.fat + "g";
  }

  // SIZE
  sizeButtons.forEach(btn => {
    btn.addEventListener("click", () => {

      sizeButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      if (btn.textContent.includes("Large")) {
        sizeExtra = 1.50;
        nutritionExtra.calories = 120;
        nutritionExtra.carbs = 15;
      } else {
        sizeExtra = 0;
        nutritionExtra.calories = 0;
        nutritionExtra.carbs = 0;
      }

      updateAll();
    });
  });

  // ADD-ONS
  addonButtons.forEach(btn => {
    btn.addEventListener("click", () => {

      const priceText = btn.querySelector(".addon-price").textContent;
      const addonPrice = parseFloat(priceText.replace("+$", ""));

      if (btn.classList.contains("selected")) {

        btn.classList.remove("selected");
        addonTotal -= addonPrice;

        // remove nutrition
        nutritionExtra.calories -= 50;
        nutritionExtra.protein -= 3;

      } else {

        btn.classList.add("selected");
        addonTotal += addonPrice;

        // add nutrition
        nutritionExtra.calories += 50;
        nutritionExtra.protein += 3;
      }

      updateAll();
    });
  });

  // QUANTITY
  qtyButtons.forEach(btn => {
    btn.addEventListener("click", () => {

      if (btn.textContent === "+") quantity++;
      if (btn.textContent === "−" && quantity > 1) quantity--;

      qtyNum.textContent = quantity;
      updateAll();
    });
  });

});
