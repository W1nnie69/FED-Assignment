document.addEventListener("DOMContentLoaded", () => {

  // Key name for storing cart in localStorage
  const CART_KEY = "cart";

  // Fixed service fee added to total
  const SERVICE_FEE = 0.75;

  // Get important HTML elements
  const emptyState = document.getElementById("empty-state");
  const cartContent = document.getElementById("cart-content");
  const cartItems = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");
  const payBtn = document.getElementById("pay-btn");

  // Get cart from localStorage
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  }

  // Save cart to localStorage
  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  // Format number into money format
  function format(n) {
    return "$" + Number(n).toFixed(2);
  }

  // Render cart items on screen
  function render() {
    const cart = getCart();

    // If cart empty → show empty message
    if (!cart || cart.length === 0) {
      emptyState.style.display = "block";
      cartContent.style.display = "none";
      return;
    }

    // If cart has items → show cart
    emptyState.style.display = "none";
    cartContent.style.display = "block";

    cartItems.innerHTML = ""; // Clear previous items
    let subtotal = 0;

    // Loop through cart items
    cart.forEach((item, index) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.qty) || 1;

      subtotal += price * qty;

      const row = document.createElement("div");
      row.className = "item-row";

      // Create item row layout
      row.innerHTML = `
        <div class="item-info">
          <div class="item-name">${item.name ?? "Item"}</div>
          <div class="item-qty">Qty: ${qty}</div>
          <div class="controls">
            <button type="button" data-i="${index}" class="minus">−</button>
            <button type="button" data-i="${index}" class="plus">+</button>
            <button type="button" data-i="${index}" class="remove">Remove</button>
          </div>
        </div>
        <div class="item-price">${format(price * qty)}</div>
      `;

      cartItems.appendChild(row);
    });

    // Update subtotal and total
    subtotalEl.textContent = format(subtotal);
    totalEl.textContent = format(subtotal + SERVICE_FEE);
  }

  // Handle plus, minus, remove button clicks
  cartItems.addEventListener("click", (e) => {
    const btn = e.target.closest("button");   // “Find the nearest parent element that matches this selector.”//
    if (!btn) return;

    const index = Number(btn.dataset.i);
    if (Number.isNaN(index)) return;

    const cart = getCart();
    if (!cart[index]) return;

    // Increase quantity
    if (btn.classList.contains("plus")) {
      cart[index].qty = (Number(cart[index].qty) || 1) + 1;
    }

    // Decrease quantity (minimum 1)
    if (btn.classList.contains("minus")) {
      cart[index].qty = Math.max(1, (Number(cart[index].qty) || 1) - 1);
    }

    // Remove item
    if (btn.classList.contains("remove")) {
      cart.splice(index, 1);
    }

    saveCart(cart);
    render(); // Re-render cart
  });

  // When Pay button is clicked
  payBtn.addEventListener("click", () => {
    const cart = getCart();
    if (!cart.length) return;

    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    // Calculate subtotal again
    const subtotal = cart.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.qty) || 1;
      return sum + price * qty;
    }, 0);

    // Create new order object
    const newOrder = {
      id: "ORD-" + Math.floor(Math.random() * 10000),
      date: new Date().toLocaleDateString(),
      items: cart,
      total: subtotal + SERVICE_FEE,
      status: "Completed"
    };

    // Save order
    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Clear cart
    localStorage.removeItem(CART_KEY);

    alert("Payment successful!");

    // Redirect to order history page
    window.location.href = "../order-history/order-history.html";
  });

  // Run render when page loads
  render();
});
