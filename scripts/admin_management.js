$(document).ready(function() {
    // Add inventory
    $("#add-inventory").click(function(event) {
      // Implement functionality to add inventory from XML/JSON files
      event.preventDefault();
      $("#inventory-file").show();
      // Reset the form on successful upload
      $("#inventory-file").val(null);
      $("#inventory-message").text("");
      $("#add-inventory").hide();
    });
  
    $("#inventory-file").change(function(event) {
        event.preventDefault();
        if (event.target.files.length > 0) {
          const file = event.target.files[0];
          const allowedCategories = {
            'fresh_products': { type: 'xml', name: 'fresh_products' },
            'frozen_products': { type: 'xml', name: 'frozen_products' },
            'candy_products': { type: 'xml', name: 'candy_products' },
            'snack_products': { type: 'xml', name: 'snack_products' },
            'baking_products': { type: 'json', name: 'baking_products' },
            'breakfast_products': { type: 'json', name: 'breakfast_products' },
            'pantry_products': { type: 'json', name: 'pantry_products' },
          };
        
          // Extract file extension and filename
          const extension = file.name.split('.').pop().toLowerCase();
          const filename = file.name.split('.')[0].toLowerCase();
          console.log("extension: "+extension); 
          console.log("filename: "+filename); 
          // Check if category and file type match
          const categoryInfo = allowedCategories[filename];
          console.log("categoryInfo: "+categoryInfo.name); 
          if (!categoryInfo || categoryInfo.type !== extension || categoryInfo.name !== filename) {
            alert('Invalid file. Please upload a valid file.');
            event.preventDefault(); // Prevent form submission
            return;
          }
        
          const formData = new FormData();
          formData.append('inventoryFile', file);
      
          $("#parse-inventory").show();
      
          $("#parse-inventory").click(function(event) {
            event.preventDefault();
            $.ajax({
              url: "../scripts/upload_inventory.php",
              method: "POST",
              data: formData,
              contentType: false,
              processData: false,
              success: function(response) {
                $("#inventory-message").text("Inventory uploaded successfully.");
              },
              error: function(error) {
                console.error("Error parsing inventory file:", error);
              }
            });
            $("#inventory-file").hide();
            $("#parse-inventory").hide();
            $("#add-inventory").show();
            setTimeout(function () {
              location.reload();
            }, 3000); // Refresh the page after 5 seconds            
          })
        }
      });

    // View inventory
    $("#view-inventory").click(function(event) {
      // Implement functionality to view inventory items from the database
      event.preventDefault();
        $.ajax({
          url: "../scripts/get_inventory.php",
          method: "GET",
          success: function(response) {
            const inventoryData = JSON.parse(response);
            //console.log(inventoryData);
            if(Object.keys(inventoryData).length>0)
            {
            const inventoryHTML = generateInventoryHTML(inventoryData);
      
            const newWindow = window.open("", "_blank");
            newWindow.document.open();
            newWindow.document.write(generateInventoryPageHTML(inventoryHTML));
            newWindow.document.close();
            }
            else
            {
              const newWindow = window.open("", "_blank");
                newWindow.document.open();
                newWindow.document.write("<html><body><h3>No Items to display in inventory!!</h3></body></html>");
                newWindow.document.close();
            }
          },
          error: function(error) {
            console.error("Error retrieving inventory data:", error);
          }
        });      
    });
  
    // Low stock items
    $("#low-stock-items").click(function(event) {
      // Implement functionality to display items with low stock (quantity less than 3)
      event.preventDefault();
        $.ajax({
          url: "../scripts/get_inventory_low.php",
          method: "GET",
          success: function(response) {
            const inventoryData = JSON.parse(response);
            //console.log(inventoryData);
            if(Object.keys(inventoryData).length>0)
            {
                const inventoryHTML = generateInventoryHTML(inventoryData);
      
                const newWindow = window.open("", "_blank");
                newWindow.document.open();
                newWindow.document.write(generateInventoryPageHTML(inventoryHTML));
                newWindow.document.close();
            }
            else{
                const newWindow = window.open("", "_blank");
                newWindow.document.open();
                newWindow.document.write("<html><body><h3>No Items are low in stock!!</h3></body></html>");
                newWindow.document.close();
            }
            
          },
          error: function(error) {
            console.error("Error retrieving inventory data:", error);
          }
        });     
    });
  
    // Customers by transaction date
    $("#customers-by-transaction-date").click(function(event) {
      // Implement functionality to display customers with more than 2 transactions on a specific date
      event.preventDefault();
      $("#customer-by-date-container").show();
      $("#customers-by-transaction-date").hide();
    });

    $("#get-customers-by-date").click(function(event) {
        event.preventDefault();
        $("#customers-by-date-list").html("");
        const transactionDate = $("#transaction-date").val();

        $.ajax({
          url: "../scripts/get_customers_by_date.php",
          method: "POST",
          data: {
            transactionDate: transactionDate
          },
          success: function(response) {
            if (response.includes('error')) {
              // Handle error message from PHP
              //console.log("in alert loop");
              message = JSON.parse(response);
              alert(message.error);
            } else {
            const customers = JSON.parse(response);
            let customerListHTML = "<table><tr><td>Customer ID</td><td>First Name</td><td>Last Name</td></tr>";
      
            for (const customer of customers) {
              customerListHTML += `<tr>
                <td>${customer.customerID}</td>
                <td>${customer.firstName}</td>
                <td>${customer.lastName}</td>
              </tr>`;
            }
            customerListHTML += `</table>`
            $("#customers-by-date-list").html(customerListHTML);
          }
          },
          error: function(error) {
            console.error("Error retrieving customers:", error);
          }
        });
      });

    // Customers by zip code and month
    $("#customers-by-zip-code-and-month").click(function(event) {
      // Implement functionality to display customers living in a specific zip code with more than 2 transactions in a specific month
      event.preventDefault();
      $("#customer-by-zip-code-and-month-container").toggle();
      $("#customers-by-zip-code-and-month").hide();
    });

    $("#get-customers-by-zip").click(function(event) {
        event.preventDefault();
        $("#customers-by-zip-list").html("");
        const transactionMonth = $("#transaction-month").val();
        const zipCode = $("#transaction-zip").val();
        
        $.ajax({
          url: "../scripts/get_customers_by_zip.php",
          method: "POST",
          data: {
            transactionMonth: transactionMonth,
            zipCode: zipCode
          },
          success: function(response) {
            if (response.includes('error')) {
              // Handle error message from PHP
              //console.log("in alert loop");
              message = JSON.parse(response);
              alert(message.error);
            } else {
            const customers = JSON.parse(response);
            let customerListHTML = "<table><tr><td>Customer ID</td><td>First Name</td><td>Last Name</td></tr>";
      
            for (const customer of customers) {
              customerListHTML += `<tr>
                <td>${customer.customerID}</td>
                <td>${customer.firstName}</td>
                <td>${customer.lastName}</td>
              </tr>`;
            }
            customerListHTML += `</table>`
            $("#customers-by-zip-list").html(customerListHTML);
          }
          },
          error: function(error) {
            console.error("Error retrieving customers:", error);
          }
        });
      });
  
    // Customers older than 20 and transactions
    $("#customers-older-than-20-and-transactions").click(function(event) {
      // Implement functionality to display customers older than 20 years old with more than 3 transactions
      event.preventDefault();
      $("#customer-by-age-container").show();
      $("#customer-by-age-container").html("")
      $.ajax({
        url: "../scripts/get_customers_by_age.php",
        method: "GET",
        success: function(response) {
          if (response.includes('error')) {
            // Handle error message from PHP
            //console.log("in alert loop");
            message = JSON.parse(response);
            alert(message.error);
          } else {
          const customers = JSON.parse(response);
          let customerListHTML = "<table><tr><td>Customer ID</td><td>First Name</td><td>Last Name</td><td>Age</td></tr>";
    
          for (const customer of customers) {
            customerListHTML += `<tr>
              <td>${customer.customerID}</td>
              <td>${customer.firstName}</td>
              <td>${customer.lastName}</td>
              <td>${customer.age}</td>
            </tr>`;
          }
          customerListHTML += `</table>`
          $("#customer-by-age-container").html(customerListHTML);
        }
        },
        error: function(error) {
          console.error("Error retrieving customers:", error);
        }
      });
    });
  
    // Modify item details
    $("#modify-item-details").click(function(event) {
      // Implement functionality to modify item details (unit price and quantity)
      event.preventDefault();
      $("#item-id").toggle();
      $("#item-price").toggle();
      $("#item-quantity").toggle();
      $("#submit-updates").toggle();
      $("#modify-item-details").hide();
    });

    $("#submit-updates").click(function(event) {
        event.preventDefault();
        const itemId = $("#item-id").val();
        const itemPrice = $("#item-price").val();
        const itemQuantity = $("#item-quantity").val();
            $.ajax({
              url: "../scripts/update_inventory.php",
              method: "POST",
              data: {
                itemId: itemId,
                itemPrice: itemPrice,
                itemQuantity: itemQuantity
              },
              success: function(response) {
                //$("#inventory-message").show();
                $("#inventory-message").text("Inventory updated successfully.");
              },
              error: function(error) {
                console.error("Error updating inventory file:", error);
              }
            });
      
            $("#item-id").hide();
            $("#item-price").hide();
            $("#item-quantity").hide();
            $("#submit-updates").hide();
            $("#modify-item-details").toggle();
          });
        }
    );
  

  /*Utility functions -- start*/
  function generateInventoryHTML(inventoryData) {
    let inventoryHTML = "";
    for (const item of inventoryData) {
      inventoryHTML += `<tr>
        <td>${item.itemNumber}</td>
        <td>${item.name}</td>
        <td>${item.category}</td>
        <td>${item.subCategory}</td>
        <td>${item.unitPrice}</td>
        <td>${item.quantity}</td>
      </tr>`;
    }
    return inventoryHTML;
  }
  
  function generateInventoryPageHTML(inventoryHTML) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Inventory</title>
        <style>
          table, th, td {
            border: 1px solid black;
            border-collapse: collapse;
            padding: 5px;
          }
        </style>
      </head>
      <body>
        <h1>Inventory Items</h1>
        <table border="1" style="width: 100%;">
          <tr>
            <th>Item ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Sub Category</th>
            <th>Unit Price (In $)</th>
            <th>Quantity</th>
          </tr>
          ${inventoryHTML}
        </table>
      </body>
      </html>
    `;
  }
  
  /*Utility functions -- end*/
