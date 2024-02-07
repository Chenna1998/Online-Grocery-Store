// Customers by zip code and month
$("#view-transaction-by-month").click(function (event) {
    // Implement functionality to display customers living in a specific zip code with more than 2 transactions in a specific month
    event.preventDefault();
    $("#view-transaction-by-month-container").show();
    $("#view-transaction-by-month").hide();
});

$("#get-transactions-by-month").click(function (event) {
    event.preventDefault();
    const transactionMonth = $("#transaction-month").val();

    $.ajax({
        url: "../scripts/fetch_transaction_month.php",
        method: "POST",
        data: {
            transactionMonth: transactionMonth,
        },
        success: function (response) {
            //console.log(response);
            
            if (response.includes('error')) {
                // Handle error message from PHP
                //console.log("in alert loop");
                message = JSON.parse(response);
                alert(message.error);
              } else {
            const transactions = JSON.parse(response);
            const transactionHTML = generateTransactionsHTML(transactions);

            const newWindow = window.open("", "_blank");
            newWindow.document.open();
            newWindow.document.write(generateTransactionsPageHTML(transactionHTML));
            newWindow.document.close();
              }
        },
        error: function (error) {
            alert("Error retrieving customers:", error);
        }
    });
    $("#view-transaction-by-month-container").hide();
    $("#view-transaction-by-month").show();
});

$("#view-transaction-three-months").click(function (event) {
    event.preventDefault();
    const transactionMonth = $("#transaction-month").val();

    $.ajax({
        url: "../scripts/fetch_transactions_three.php",
        method: "GET",
        success: function (response) {
            //console.log(response);
            if (response.includes('error')) {
                // Handle error message from PHP
                response = JSON.parse(response);
                alert(response.error);
              } else {
            const transactions = JSON.parse(response);
            const transactionHTML = generateTransactionsHTML(transactions);

            const newWindow = window.open("", "_blank");
            newWindow.document.open();
            newWindow.document.write(generateTransactionsPageHTML(transactionHTML));
            newWindow.document.close();
              }
        },
        error: function (error) {
            console.error("Error retrieving customers:", error);
        }
    });
    $("#view-transaction-by-month-container").hide();
    $("#view-transaction-by-month").show();
});

$("#view-transaction-year").click(function (event) {
    // Implement functionality to display customers living in a specific zip code with more than 2 transactions in a specific month
    event.preventDefault();
    $("#view-transaction-by-year-container").show();
    $("#view-transaction-year").hide();
});

$("#get-transactions-by-year").click(function (event) {
    event.preventDefault();
    const transactionYear = $("#transaction-year").val();

    $.ajax({
        url: "../scripts/fetch_transaction_year.php",
        method: "POST",
        data: {
            transactionYear: transactionYear,
        },
        success: function (response) {
            //console.log(response);
            if (response.includes('error')) {
                // Handle error message from PHP
                response = JSON.parse(response);
                alert(response.error);
              } else {
            const transactions = JSON.parse(response);
            const transactionHTML = generateTransactionsHTML(transactions);

            const newWindow = window.open("", "_blank");
            newWindow.document.open();
            newWindow.document.write(generateTransactionsPageHTML(transactionHTML));
            newWindow.document.close();
              }
        },
        error: function (error) {
            console.error("Error retrieving customers:", error);
        }
    });
    $("#view-transaction-by-year-container").hide();
    $("#view-transaction-year").show();
});

/*Utility functions -- start*/
function generateTransactionsHTML(transactions) {
    //console.log(transactionsData);
    let transactionListHTML = "";
    for (const transaction of transactions) {
        transactionListHTML += `<tr>
          <td>${transaction.transactionId}</td>
          <td>${transaction.transactionStatus}</td>
          <td>${transaction.transactionDate}</td>
          <td>${transaction.totalPrice}</td>
        </tr>`;
    }
    return transactionListHTML;
}

function generateTransactionsPageHTML(inventoryHTML) {
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
      </head>
      <body>
        <h1>Transaction Items</h1>
        <table border="1" style="width: 100%;">
          <tr>
            <th>Transaction ID</th>
            <th>Transaction Status</th>
            <th>Transaction Date</th>
            <th>Total Price</th>
          </tr>
          ${inventoryHTML}
        </table>
      </body>
      </html>
    `;
}

/*Utility functions -- end*/