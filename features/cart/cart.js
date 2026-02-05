document.addEventListener("DOMContentLoaded", () => {

  const CART_KEY = "cart";
  const SERVICE_FEE = 0.75;

  const emptyState = document.getElementById("empty-state");
  const cartContent = document.getElementById("cart-content");
  const cartItems = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");
  const payBtn = document.getElementById("pay-btn");

  function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function format(n) {
    return "$" + n.toFixed(2);
  }

  function render() {
    const cart = getCart();

    if (cart.length === 0) {
      emptyState.style.display = "block";
      cartContent.style.display = "none";
      return;
    }

    emptyState.style.display = "none";
    cartContent.style.display = "block";

    cartItems.innerHTML = "";

    let subtotal = 0;

    cart.forEach((item, index) => {
      subtotal += item.price * item.qty;

      const row = document.createElement("div");
      row.className = "item-row";

      row.innerHTML = `
        <div>
          <strong>${item.name}</strong><br>
          Qty: ${item.qty}
          <div class="controls">
            <button data-i="${index}" class="minus">−</button>
            <button data-i="${index}" class="plus">+</button>
            <button data-i="${index}" class="remove">Remove</button>
          </div>
        </div>
        <div>${format(item.price * item.qty)}</div>
      `;

      cartItems.appendChild(row);
    });

    subtotalEl.textContent = format(subtotal);
    totalEl.textContent = format(subtotal + SERVICE_FEE);
  }

  document.addEventListener("click", (e) => {
    const index = e.target.dataset.i;
    const cart = getCart();

    if (e.target.classList.contains("plus")) {
      cart[index].qty++;
      saveCart(cart);
      render();
    }

    if (e.target.classList.contains("minus")) {
      cart[index].qty = Math.max(1, cart[index].qty - 1);
      saveCart(cart);
      render();
    }

    if (e.target.classList.contains("remove")) {
      cart.splice(index, 1);
      saveCart(cart);
      render();
    }
  });

  payBtn.addEventListener("click", () => {

  const cart = getCart();
  if (cart.length === 0) return;

  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  const newOrder = {
    id: "ORD-" + Math.floor(Math.random() * 10000),
    date: new Date().toLocaleDateString(),
    items: cart,
    total: cart.reduce((sum, item) => sum + item.price * item.qty, 0) + 0.75,
    status: "Completed"
  };

  orders.push(newOrder);

  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.removeItem(CART_KEY);

  alert("Payment successful!");
  window.location.href = "../order-history/order-history.html";
});

});
