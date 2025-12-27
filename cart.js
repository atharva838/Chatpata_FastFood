let cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = 0;
let cartlist = document.getElementById("cartlist");

if (cart.length === 0) {
  cartlist.innerHTML = "<h1> Oops Your cart is empty </h1>";
} else {
  cartlist.innerHTML = cart.map(function (item, i) {
    total += item.price;
    return `
        <div id="cart1">
         <h2> ${item.name} </h2>
         <p> Price: ${item.price} </p>
         <button onclick="removeItem(${i})"> Remove </button>
        </div>`;
  }).join("");
}
function removeItem(i) {
  cart.splice(i, 1);
  localStorage.setItem("cart", JSON.stringify(cart));

  location.reload();
}
localStorage.setItem("total", total);

// function placeOrder() {
//   if (cart.length === 0) {
//     alert("Your Cart Is Empty! Please Add items to place order");
//   }

//   let ok = confirm("Please Confirm Your Order");
//     if (ok) {
//         alert("scan the OR and Pay" , total);
//   }
// }