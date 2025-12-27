let menu = [
  {
    img: "images/biryani.jpg",
    name: "Biryani",
    price: 250,
  },
  {
    img: "images/brownie.jpg",
    name: "Brownie",
    price: 200,
  },
  {
    img: "images/chole.jpg",
    name: "Chole",
    price: 150,
  },
  {
    img: "images/burger.jpg",
    name: "Burger",
    price: 120,
  },
  {
    img: "images/hakka.jpg",
    name: "Noodles",
    price: 130,
  },
  {
    img: "images/coffe.jpg",
    name: "Coffee",
    price: 140,
  },
  {
    img: "images/fries.jpg",
    name: "French Fries",
    price: 90,
  },
  {
    img: "images/dosa.jpg",
    name: "Dosa",
    price: 50,
  },
  {
    img: "images/idli.jpg",
    name: "Idli",
    price: 80,
  },
  {
    img: "images/pizza.jpg",
    name: "Pizza",
    price: 300,
  },
  {
    img: "images/pavbhaji.jpg",
    name: "Pav Bhaji",
    price: 100,
  },
  {
    img: "images/rice.jpg",
    name: "fried Rice",
    price: 110,
  },
  {
    img: "images/thali.jpg",
    name: "gujrati Thali",
    price: 220,
  },
];
let menus = document.querySelector(".menus");

menus.innerHTML = menu.map((item, index) =>  {
    return `<div id="card-container">
             <img src="${item.img}" alt="">
             <h2>${item.name}</h2>
             <span>Price : ${item.price}</span>
              <button onclick="addTocart(${index})">"Add to Cart"</button>
        </div>`;
  }).join("");
function addTocart(index){
    let cart = JSON.parse(localStorage.getItem("cart")) || []
    cart.push(menu[index])
    
    localStorage.setItem("cart" , JSON.stringify(cart)); 
    alert(`${menu[index].name} added to cart`);
}