const menu = [
  { id: "biryani", img: "images/biryani.jpg", name: "Biryani", price: 250, description: "Aromatic rice packed with flavour." },
  { id: "brownie", img: "images/brownie.jpg", name: "Brownie", price: 200, description: "A rich chocolate treat." },
  { id: "chole", img: "images/chole.jpg", name: "Chole", price: 150, description: "A comforting North Indian classic." },
  { id: "burger", img: "images/burger.jpg", name: "Burger", price: 120, description: "A satisfying, flavourful bite." },
  { id: "noodles", img: "images/hakka.jpg", name: "Noodles", price: 130, description: "Tasty Hakka-style noodles." },
  { id: "coffee", img: "images/coffe.jpg", name: "Coffee", price: 140, description: "A comforting cup to enjoy." },
  { id: "fries", img: "images/fries.jpg", name: "French Fries", price: 90, description: "Crispy golden potato fries." },
  { id: "dosa", img: "images/dosa.jpg", name: "Dosa", price: 50, description: "A South Indian favourite." },
  { id: "idli", img: "images/idli.jpg", name: "Idli", price: 80, description: "Soft, steamed rice cakes." },
  { id: "pizza", img: "images/pizza.jpg", name: "Pizza", price: 300, description: "A cheesy crowd-pleaser." },
  { id: "pav-bhaji", img: "images/pavbhaji.jpg", name: "Pav Bhaji", price: 100, description: "Spiced vegetable mash with pav." },
  { id: "fried-rice", img: "images/rice.jpg", name: "Fried Rice", price: 110, description: "A delicious rice favourite." },
  { id: "gujarati-thali", img: "images/thali.jpg", name: "Gujarati Thali", price: 220, description: "A traditional meal with variety." }
];

const grid = document.getElementById("menu-grid");
const search = document.getElementById("menu-search");
const count = document.getElementById("menu-count");
const message = document.getElementById("menu-message");

const money = value =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(value);

function readCart() {
  try {
    const value = JSON.parse(localStorage.getItem("cart") || "[]");
    return Array.isArray(value) ? value.filter(item =>
      item && typeof item.name === "string" &&
      Number.isFinite(Number(item.price)) &&
      Number(item.price) >= 0
    ) : [];
  } catch {
    return [];
  }
}

function showMessage(text) {
  if (!message) return;
  message.textContent = text;
  message.hidden = false;
  window.clearTimeout(showMessage.timer);
  showMessage.timer = window.setTimeout(() => {
    message.hidden = true;
  }, 2600);
}

function renderMenu(query = "") {
  if (!grid) return;

  const normalized = query.trim().toLowerCase();
  const filtered = menu.filter(item =>
    item.name.toLowerCase().includes(normalized) ||
    item.description.toLowerCase().includes(normalized)
  );

  count.textContent = `${filtered.length} ${filtered.length === 1 ? "dish" : "dishes"}`;

  if (!filtered.length) {
    grid.innerHTML = '<div class="empty-menu"><h2>No dishes found</h2><p>Try another search.</p></div>';
    return;
  }

  grid.replaceChildren();

  filtered.forEach(item => {
    const card = document.createElement("article");
    card.className = "food-card";

    const img = document.createElement("img");
    img.className = "food-image";
    img.src = item.img;
    img.alt = item.name;
    img.loading = "lazy";
    img.onerror = () => {
      img.removeAttribute("src");
      img.classList.add("food-image-fallback");
      img.alt = `${item.name} image unavailable`;
    };

    const content = document.createElement("div");
    content.className = "food-content";

    const title = document.createElement("h2");
    title.textContent = item.name;

    const description = document.createElement("p");
    description.textContent = item.description;

    const bottom = document.createElement("div");
    bottom.className = "food-bottom";

    const price = document.createElement("span");
    price.className = "food-price";
    price.textContent = money(item.price);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "add-button";
    button.textContent = "＋ Add";

    button.addEventListener("click", () => {
      try {
        const cart = readCart();
        const existing = cart.find(entry => entry.id === item.id);

        if (existing) {
          existing.quantity = Math.max(1, Number(existing.quantity) || 1) + 1;
        } else {
          cart.push({ ...item, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        if (typeof window.updateCartCount === "function") {
          window.updateCartCount();
        }

        showMessage(`${item.name} added to your cart.`);
      } catch {
        showMessage("Unable to save your cart. Check your browser storage.");
      }
    });

    bottom.append(price, button);
    content.append(title, description, bottom);
    card.append(img, content);
    grid.append(card);
  });
}

if (search) {
  search.addEventListener("input", event => renderMenu(event.target.value));
}

renderMenu();
