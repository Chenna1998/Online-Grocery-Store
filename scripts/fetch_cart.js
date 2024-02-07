const productList = document.getElementById('cart_product_list'); // Use generic element ID
const totalPrice = document.getElementById('total-price'); // Use generic element ID

if (pgTitle === "OnGro - Cart") {
    document.addEventListener('DOMContentLoaded', function () {
        displayCart();
    });

    function submitCart(){
        $.ajax({
            url: "../scripts/submit_cart.php",
            method: "GET", // Set method to POST
            success: function(response) {
                alert("Thank you for shopping!");
                localStorage.removeItem('transactionId');
                displayCart();
            },
            error: function(error) { // Handle errors
                alert("error submitting transaction");
            },
        })
    }

    function clearCart(){
        $.ajax({
            url: "../scripts/cancel_cart.php",
            method: "GET", // Set method to POST
            success: function(response) {
                alert("Cart cleared successfully!");
                localStorage.removeItem('transactionId');
                displayCart();
            },
            error: function(error) { // Handle errors
                alert("error cancelling transaction");
            },
        })
    }

    function cancelOneItem() {
        const itemNumber = prompt("Enter the item number to cancel:");
        const tId = prompt("Enter the transaction number of the item to cancel:");
    
        if (itemNumber) {
            $.ajax({
                url: "../scripts/cancel_one_item.php",
                method: "POST",
                data: {
                    itemNumber: itemNumber,
                    transactionId: tId,
                },
                success: function (response) {
                    response = JSON.parse(response);
                    if (response.success) {
                        alert("Item canceled successfully!");
    
                        if (response.removeTransactionId && (tId === localStorage.getItem('transactionId'))) {
                            localStorage.removeItem('transactionId');
                        }
    
                        displayCart();
                    } else {
                        alert("Error canceling item: " + response.error);
                    }
                },
                error: function (error) {
                    alert("Error canceling item.");
                },
            });
        }
    }
    
    

    function displayCart(){
        $.ajax({
            url: "../scripts/fetch_cart.php",
            method: "GET", // Set method to GET
            success: function(response) { // Handle successful response
              productList.innerHTML = ""; // Clear existing content
              totalPrice.textContent = ""; // Clear error message
        
              if (response.error) { // Check for errors in response
                totalPrice.textContent = response.error;
              } else {
                  parsedResponse = JSON.parse(response);
                  const header = document.createElement("tr"); // Create table row
                  header.innerHTML = `
                        <td><strong>Item Number</strong></td>
                        <td><strong>Category</strong></td> 
                        <td><strong>Sub Category</strong></td>
                        <td><strong>Name</strong></td>
                        <td><strong>Quantity</strong></td>
                        <td><strong>Price (Each Item)</strong></td>
                        <td><strong>Amount</strong></td> 
                        <td><strong>Transaction Id</strong></td>
                    `; // Set HTML for table row
                    productList.appendChild(header); // Append row to product list
                  parsedResponse["products"].forEach(function(product) { // Loop through products
                    const item = document.createElement("tr"); // Create table row
                    item.innerHTML = `
                        <td>${product.itemNumber}</td>
                        <td>${product.category}</td> 
                        <td>${product.subCategory}</td>
                        <td>${product.name}</td>
                        <td>${product.quantity}</td>
                        <td>${product.price}</td> 
                        <td>${product.amount}</td>
                        <td>${product.transactionId}</td>
                    `; // Set HTML for table row
                    productList.appendChild(item); // Append row to product list
                });
                totalPrice.textContent = `Total Price: $${parsedResponse.totalPrice}`;
              }
            },
            error: function(error) { // Handle errors
              productError.textContent = "Error fetching products.";
            },
          });
    }
}