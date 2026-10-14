(function () {
  "use strict";

  function readCart() {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      return Array.isArray(cart) ? cart : [];
    } catch {
      return [];
    }
  }

  function updateCartCount() {
    const count = readCart().reduce((sum, item) => {
      const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
      return sum + quantity;
    }, 0);

    document.querySelectorAll("[data-cart-count]").forEach(element => {
      element.textContent = String(count);
      element.setAttribute("aria-label", `${count} items in cart`);
    });
  }

  function updateYear() {
    document.querySelectorAll("[data-year]").forEach(element => {
      element.textContent = String(new Date().getFullYear());
    });
  }

  window.updateCartCount = updateCartCount;

  updateCartCount();
  updateYear();

  // Refresh the count when another open tab changes the cart.
  window.addEventListener("storage", event => {
    if (event.key === "cart") updateCartCount();
  });
})();
