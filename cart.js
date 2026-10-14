const cartList = document.getElementById("cartlist");
const subtotalElement = document.getElementById("subtotal");
const deliveryElement = document.getElementById("delivery");
const totalElement = document.getElementById("maintotal");
const cartMessage = document.getElementById("cart-message");

const DELIVERY_FEE = 0;

const formatMoney = value =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(value);

function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (!Array.isArray(cart)) return [];

    return cart.filter(item =>
      item &&
      typeof item.name === "string" &&
      Number.isFinite(Number(item.price)) &&
      Number(item.price) >= 0
    ).map(item => ({
      ...item,
      price: Number(item.price),
      quantity: Math.max(1, Math.floor(Number(item.quantity) || 1))
    }));
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  if (typeof window.updateCartCount === "function") {
    window.updateCartCount();
  }
}

function showCartMessage(text) {
  if (!cartMessage) return;
  cartMessage.textContent = text;
  cartMessage.hidden = false;
  window.clearTimeout(showCartMessage.timer);
  showCartMessage.timer = window.setTimeout(() => {
    cartMessage.hidden = true;
  }, 2400);
}

function renderCart() {
  if (!cartList) return;

  const cart = getCart();
  saveCart(cart);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );
  const delivery = cart.length ? DELIVERY_FEE : 0;
  const total = subtotal + delivery;

  subtotalElement.textContent = formatMoney(subtotal);
  deliveryElement.textContent = formatMoney(delivery);
  totalElement.textContent = formatMoney(total);

  // Keep the existing total key for compatibility with order.js.
  localStorage.setItem("total", String(total));

  cartList.replaceChildren();

  if (!cart.length) {
    const empty = document.createElement("div");
    empty.className = "empty-cart";

    const icon = document.createElement("div");
    icon.className = "empty-icon";
    icon.textContent = "🛒";

    const heading = document.createElement("h2");
    heading.textContent = "Your cart is empty";

    const description = document.createElement("p");
    description.textContent = "Explore the menu and add something delicious.";

    const link = document.createElement("a");
    link.className = "button";
    link.href = "menu.html";
    link.textContent = "Explore menu";

    empty.append(icon, heading, description, link);
    cartList.append(empty);
    return;
  }

  cart.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "cart-item";

    const details = document.createElement("div");

    const heading = document.createElement("h2");
    heading.textContent = item.name;

    const price = document.createElement("p");
    price.className = "cart-item-price";
    price.textContent = `${formatMoney(item.price)} each`;

    const controls = document.createElement("div");
    controls.className = "cart-controls";

    const decrease = document.createElement("button");
    decrease.type = "button";
    decrease.className = "quantity-button";
    decrease.textContent = "−";
    decrease.setAttribute("aria-label", `Decrease ${item.name} quantity`);
    decrease.disabled = item.quantity <= 1;

    const quantity = document.createElement("span");
    quantity.className = "quantity-value";
    quantity.textContent = String(item.quantity);
    quantity.setAttribute("aria-label", "Quantity");

    const increase = document.createElement("button");
    increase.type = "button";
    increase.className = "quantity-button";
    increase.textContent = "+";
    increase.setAttribute("aria-label", `Increase ${item.name} quantity`);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-button";
    remove.textContent = "Remove";

    decrease.addEventListener("click", () => changeQuantity(index, -1));
    increase.addEventListener("click", () => changeQuantity(index, 1));
    remove.addEventListener("click", () => removeItem(index));

    controls.append(decrease, quantity, increase, remove);
    details.append(heading, price, controls);

    const lineTotal = document.createElement("strong");
    lineTotal.textContent = formatMoney(item.price * item.quantity);

    card.append(details, lineTotal);
    cartList.append(card);
  });
}

function changeQuantity(index, amount) {
  const cart = getCart();
  if (!cart[index]) return;

  cart[index].quantity += amount;

  if (cart[index].quantity < 1) return;

  saveCart(cart);
  renderCart();
}

function removeItem(index) {
  const cart = getCart();
  if (!cart[index]) return;

  const removedName = cart[index].name;
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
  showCartMessage(`${removedName} removed from your cart.`);
}

renderCart();
