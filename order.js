const orderForm = document.getElementById("orderform");
const checkoutMessage = document.getElementById("checkout-message");

const UPI_ID = ""; // Add your own verified UPI ID to enable QR generation.
const PAYEE_NAME = "Chatpata FastFood";
const DELIVERY_FEE = 0;

const money = amount =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(amount);

function getOrderCart() {
  try {
    const value = JSON.parse(localStorage.getItem("cart") || "[]");
    if (!Array.isArray(value)) return [];

    return value.filter(item =>
      item &&
      typeof item.name === "string" &&
      Number.isFinite(Number(item.price)) &&
      Number(item.price) >= 0
    ).map(item => ({
      id: String(item.id || item.name),
      name: item.name,
      price: Number(item.price),
      quantity: Math.max(1, Math.floor(Number(item.quantity) || 1))
    }));
  } catch {
    return [];
  }
}

function calculateOrder() {
  const cart = getOrderCart();
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );
  const delivery = cart.length ? DELIVERY_FEE : 0;

  return {
    cart,
    subtotal,
    delivery,
    total: subtotal + delivery
  };
}

function displayOrderTotal() {
  const order = calculateOrder();

  document.getElementById("order-subtotal").textContent = money(order.subtotal);
  document.getElementById("order-delivery").textContent = money(order.delivery);
  document.getElementById("billamount").textContent = money(order.total);

  // Retain compatibility with the existing cart/order pages.
  localStorage.setItem("total", String(order.total));

  if (typeof window.updateCartCount === "function") {
    window.updateCartCount();
  }

  if (!order.cart.length) {
    showMessage("Your cart is empty. Please add food from the menu first.");
    orderForm.querySelector('button[type="submit"]').disabled = true;
  }

  return order;
}

function showMessage(text) {
  checkoutMessage.textContent = text;
  checkoutMessage.hidden = false;
}

function hideMessage() {
  checkoutMessage.textContent = "";
  checkoutMessage.hidden = true;
}

function showPaymentQR(total) {
  const section = document.getElementById("qrsection");
  const image = document.getElementById("qrimage");
  const instructions = document.getElementById("payment-instructions");

  section.hidden = false;

  if (!UPI_ID || !/^[\w.-]+@[\w.-]+$/.test(UPI_ID)) {
    image.hidden = true;
    instructions.textContent =
      "Order details saved for this demo. Add your own verified UPI ID in order.js to configure a payment QR.";
    return;
  }

  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: PAYEE_NAME,
    am: total.toFixed(2),
    cu: "INR",
    tn: "Chatpata FastFood order"
  });

  const upiURL = `upi://pay?${params.toString()}`;
  image.src =
    "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" +
    encodeURIComponent(upiURL);
  image.hidden = false;
  instructions.textContent =
    "Scan with a compatible UPI app and verify the recipient and amount before approving payment.";
}

orderForm.addEventListener("submit", event => {
  event.preventDefault();
  hideMessage();

  const order = calculateOrder();

  if (!order.cart.length) {
    showMessage("Your cart is empty. Please return to the menu.");
    return;
  }

  if (!orderForm.reportValidity()) return;

  const name = document.getElementById("username").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const address = document.getElementById("orderd").value.trim();

  if (name.length < 2 || address.length < 8) {
    showMessage("Please enter a valid name and complete delivery address.");
    return;
  }

  if (!/^[6-9]\d{9}$/.test(mobile)) {
    showMessage("Please enter a valid 10-digit Indian mobile number.");
    return;
  }

  const orderRecord = {
    name,
    mobile,
    address,
    items: order.cart,
    subtotal: order.subtotal,
    delivery: order.delivery,
    total: order.total,
    createdAt: new Date().toISOString(),
    status: "Demo order — not submitted to a server"
  };

  try {
    localStorage.setItem("userdetails", JSON.stringify({
      name,
      mobile,
      address,
      paytotal: order.total
    }));
    localStorage.setItem("lastOrder", JSON.stringify(orderRecord));
  } catch {
    showMessage("Unable to save your order in this browser. Check storage settings.");
    return;
  }

  showMessage(
    `Order details saved in this browser. Total: ${money(order.total)}. This is a demo, not a confirmed restaurant order.`
  );

  showPaymentQR(order.total);
});

displayOrderTotal();
