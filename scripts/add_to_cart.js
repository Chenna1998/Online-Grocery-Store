function addToCart(itemNumber, quantity) {
    // Check if cart already exists
    const existingTransactionId = localStorage.getItem('transactionId');
    //console.log("Transaction before: "+existingTransactionId);
    // Update cart and transaction tables
    $.ajax({
      url: "../scripts/add_to_cart.php",
      method: "POST",
      data: {
        itemNumber: itemNumber,
        quantity: quantity,
        existingTransactionId: existingTransactionId,
      },
      success: function(response) {
        parsedResponse = JSON.parse(response);
        //console.log(response);
        //console.log(parsedResponse);
        if (parsedResponse.error) {
          alert(parsedResponse.error);
          return;
        }
  
        // Update UI based on response
        if (parsedResponse.newTransaction) {
            //console.log("response id: "+parsedResponse.transactionId);
          localStorage.setItem('transactionId', parsedResponse.transactionId);
        }
  
        if (parsedResponse.outOfStock) {
          alert("Item " + itemNumber + " is out of stock!");
          return;
        }
       // console.log("Transactions after: "+localStorage.getItem('transactionId'));
        // Update cart display (implement your logic here)
        // ...
  
        alert("Item added to cart!");
      },
      error: function(error) {
        console.error(error);
        alert("Error adding item to cart.");
      },
    });
  }
  