document.addEventListener('DOMContentLoaded', function () {
    // Fetch and display transaction details
    fetchTransactionDetails();
});

function fetchTransactionDetails() {
    // You need to implement this function to fetch transaction details from the server
    // Make an AJAX request to a server-side script (e.g., fetch_transactions.php) to get transaction data
    // Update the #transactionDetails section with the retrieved data
    // View inventory
    $("#view-transaction").click(function(event) {
        // Implement functionality to view inventory items from the database
        event.preventDefault();
          $.ajax({
            url: "../scripts/fetch_transactions.php",
            method: "GET",
            success: function(response) {
              if (response.includes('error') && JSON.parse(response).error != false) {
                // Handle error message from PHP
                //console.log("in alert loop");
                message = JSON.parse(response);
                alert(message.error);
              } else {
              const transactionData = JSON.parse(response);
              //console.log(transactionData);
              const transactionHTML = generateTransactionHTML(transactionData["transactions"]);
        
              const newWindow = window.open("", "_blank");
              newWindow.document.open();
              newWindow.document.write(generateTransactionPageHTML(transactionHTML));
              newWindow.document.close();
              }
            },
            error: function(error) {
              console.error("Error retrieving inventory data:", error);
            }
          });      
      });
}



  /*Utility functions -- start*/
  function generateTransactionHTML(transactionsData) {
    //console.log(transactionsData);
    let inventoryHTML = "";
    for (const transactionId in transactionsData) {
      const transactionItems = transactionsData[transactionId];
      for (const item of transactionItems) {
        inventoryHTML += `<tr>
          <td>${transactionId}</td>
          <td>${item.transactionStatus}</td>
          <td>${item.transactionDate}</td>
          <td>${item.itemNumber}</td>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${item.cartStatus}</td>
        </tr>`;
      }
    }
    return inventoryHTML;
  }
  
  function generateTransactionPageHTML(inventoryHTML) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Transactions</title>
        <style>
          table, th, td {
            border: 1px solid black;
            border-collapse: collapse;
            padding: 5px;
          }
        </style>
        <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
      </head>
      <body>
        <h1>Transaction Items</h1>
        <table border="1" style="width: 100%;">
          <tr>
            <th>Transaction ID</th>
            <th>Transaction Status</th>
            <th>Transaction Date</th>
            <th>Item ID</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Cart Status</th>
          </tr>
          ${inventoryHTML}
        </table>
        <button id="remove-item-cart-button" onclick="cancelOneItem()">Cancel by transaction</button>
        <script src="../scripts/cancel_by_transaction.js"></script>
      </body>
      </html>
    `;
  }
  
  /*Utility functions -- end*/