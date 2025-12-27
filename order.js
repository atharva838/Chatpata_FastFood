let paytotal = 0;
function generate() {
  paytotal = localStorage.getItem("total") || 0;

  document.getElementById("qrsection").style.display = "block";
  document.getElementById("billamount").innerText = paytotal;

  let upiID = "dahrmeshgurav@okicici";
  let name = "Dahrmesh Gurav";

  let upiURL = `upi://pay?pa=${upiID}&pn=${name}&am=${paytotal}&cu=INR`;

  let qrAPI =
    "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" +
    encodeURIComponent(upiURL);

  document.getElementById("qrimage").src = qrAPI;
  localStorage.setItem("paytotal", paytotal);

}

// function placeOrder() {
//     let confirmorder = confirm("Do you want to place the order ? ");
//     if (confirmorder) { 
//         document.getElementById("orderform").requestSubmit();
//     }
// }


let orderform = document.getElementById("orderform")
function submitorder(event){
    event.preventDefault();
    let name = document.getElementById("username").value;
    let mobile = document.getElementById("mobile").value;
    let address = document.getElementById("orderd").value;

    if(!address){
        alert("Please Enter A valid Address");
    }

    localStorage.setItem("userdetails", JSON.stringify({name,mobile,address,paytotal}));

    generate();
}