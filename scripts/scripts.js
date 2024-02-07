// Initialize currentPage based on the initial URL
const pgTitle = document.title;

function validateForm() {
    const firstName = document.querySelector('input[name="firstName"]').value;
    const lastName = document.querySelector('input[name="lastName"]').value;
    const email = document.querySelector('input[name="Email"]').value;
    const contact = document.querySelector('input[name="Contact"]').value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const query = document.querySelector("#query").value;
    const error = document.getElementById("error");

    // Regular expressions for validation
    const nameRegex = /^[A-Z][a-z]*$/;
    const emailRegex = /^\S+@\S+\.\S+$/;
    const contactRegex = /^\(\d{3}\) \d{3}-\d{4}$/;

    // Validate first name and last name
    if (
        !nameRegex.test(firstName) ||
        !nameRegex.test(lastName) ||
        firstName === lastName
    ) {
        error.textContent =
            "Please enter valid first and last names with the first letter capitalized.";
        return false;
    }

    // Validate email address
    if (!emailRegex.test(email)) {
        error.textContent = "Please enter a valid email address.";
        return false;
    }

    // Validate contact number
    if (!contactRegex.test(contact)) {
        error.textContent =
            "Please enter a valid contact number in the format (123) 456-7890.";
        return false;
    }

    // Validate gender
    if (!gender) {
        error.textContent = "Please select a gender.";
        return false;
    }

    // Validate query length
    if (query.length < 10) {
        error.textContent = "Please write a query with at least 10 characters.";
        return false;
    }

    return true;
}

function displayDateTime() {
    const dateTimeElement = document.getElementById("date-time");
    const now = new Date();
    const dateTimeString = now.toLocaleString();
    dateTimeElement.textContent = dateTimeString;
}

// Call the function to display the date and time when the page loads
displayDateTime();
// You can also update the time every second to make it real-time
setInterval(displayDateTime, 1000);

document.addEventListener('DOMContentLoaded', function () {
    // Fetch session data using AJAX
    $.ajax({
      url: '../scripts/sessionData.php',
      method: 'GET',
      dataType: 'json',
      success: function (data) {
        const { isLoggedIn, isAdmin } = data;
  
        // Get buttons
        const registerBtn = document.getElementById('registerBtn');
        const loginBtn = document.getElementById('loginBtn');
        const cartBtn = document.getElementById('cartBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const myAccountBtn = document.getElementById('myAccountBtn');
        const navbar = document.getElementById("navbar");

        // Hide or show buttons based on login status
        if (isLoggedIn) {
          registerBtn.style.display = 'none';
          loginBtn.style.display = 'none';
          cartBtn.style.display = 'none';
          logoutBtn.style.display = 'inline-block';
          navbar.style.display = 'none';

          if(!isAdmin)
          {
            navbar.style.display = 'inline-block';
            cartBtn.style.display = 'inline-block';
          }
          // Show My Account link and set the correct href
          myAccountBtn.style.display = 'inline-block';
          myAccountBtn.addEventListener('click', function (event) {
            // Prevent default link behavior
            event.preventDefault();
          
            // Check if admin
            if (isAdmin) {
              window.location.href = '../html/Admin.html';
            } else {
              window.location.href = '../html/MyAccount.html';
            }
          });
          
        } else {
          cartBtn.style.display = 'none';
          logoutBtn.style.display = 'none';
          myAccountBtn.style.display = 'none';
          navbar.style.display = 'none';
        }
      },
      error: function (error) {
        console.error(error);
      }
    });
  });
  

  function logout() {
    // Send an AJAX request to destroy the session
    $.ajax({
      url: '../scripts/logout.php',
      method: 'POST',
      dataType: 'json',
      success: function (data) {
        if (data.success) {
          // Show success message
          alert(data.message);
  
          // Update button visibility
          registerBtn.style.display = 'inline-block';
          loginBtn.style.display = 'inline-block';
          cartBtn.style.display = 'none';
          logoutBtn.style.display = 'none';
          myAccountBtn.style.display = 'none';
          navbar.style.display = 'none';
  
          // Redirect user
          window.location.href = '../html/Login.html';
        } else {
          console.error(data.error);
        }
      },
      error: function (error) {
        console.error(error);
      },
    });
  }
  
  if(document.title === "My Account - Admin") 
  {
    window.onload = function (event) {
        event.preventDefault();
        $.ajax({
          url: '../scripts/check_access.php',
          method: 'GET',
          dataType: 'json',
          success: function (data) {
            if (data.authorized) {
              // Display admin content
              //window.location.href = '../html/Admin.html';
            } else {
              window.location.href = '../html/Home.html';
              alert('Access restricted!');
            }
          },
          error: function (error) {
            console.error(error);
          }
        });
      };
      
  }
  

var currentItemsArray;
/*Script to populate fresh products based on selection criteria - start*/
// Define your product data (name, price, quantity, and category)
let fresh_products, frozen, pantry_products, breakfast_products, baking_products, candy_products, snack_products;

let products, fname;
/*Script to handle xml & json data fetch - start*/
// function fetch_data_xml_search(filename, callback) {
//     // Define the path to your XML file
//     const xmlFilePath = 'http://localhost/NXT210027-HW4/xml/' + filename;

//     // Create a new XMLHttpRequest object
//     const xhr = new XMLHttpRequest();

//     // Specify the type of request and the URL
//     xhr.open('GET', xmlFilePath, true);

//     // Set up a callback function to handle the response
//     xhr.onreadystatechange = function () {
//         // Check if the request is complete
//         if (xhr.readyState === XMLHttpRequest.DONE) {
//             // Check if the request was successful (status code 200)
//             if (xhr.status === 200) {
//                 // Parse the XML data into a DOM object
//                 const parser = new DOMParser();
//                 const xmlDoc = parser.parseFromString(xhr.responseText, 'text/xml');

//                 // Extract product information from the XML
//                 products = Array.from(xmlDoc.querySelectorAll('product')).map((product) => {
//                     return {
//                         name: product.querySelector('name').textContent,
//                         price: parseFloat(product.querySelector('price').textContent),
//                         quantity: parseInt(product.querySelector('quantity').textContent),
//                     };
//                 });

//                 // Now you can use the 'products' array as needed in your application
//                 //console.log("product xml:" + products);
//                 callback(products);
//             } else {
//                 // Handle the error if the request was not successful
//                 console.error('Failed to load XML file');
//             }
//         }
//     };
//     // Send the request
//     xhr.send();
// }

// function fetch_data_xml(filename, callback) {
//     // Define the path to your XML file
//     const xmlFilePath = 'http://localhost/NXT210027-HW4/xml/' + filename;

//     // Create a new XMLHttpRequest object
//     const xhr = new XMLHttpRequest();

//     // Specify the type of request and the URL
//     xhr.open('GET', xmlFilePath, true);

//     // Set up a callback function to handle the response
//     xhr.onreadystatechange = function () {
//         // Check if the request is complete
//         if (xhr.readyState === XMLHttpRequest.DONE) {
//             // Check if the request was successful (status code 200)
//             if (xhr.status === 200) {
//                 // Parse the XML data into a DOM object
//                 const parser = new DOMParser();
//                 const xmlDoc = parser.parseFromString(xhr.responseText, 'text/xml');

//                 // Extract product information from the XML
//                 products = Array.from(xmlDoc.querySelectorAll('product')).map((product) => {
//                     return {
//                         name: product.querySelector('name').textContent,
//                         price: parseFloat(product.querySelector('price').textContent),
//                         quantity: parseInt(product.querySelector('quantity').textContent),
//                         category: product.querySelector('category').textContent,
//                     };
//                 });

//                 // Now you can use the 'products' array as needed in your application
//                 console.log("product xml:" + products);
//                 callback(products);
//             } else {
//                 // Handle the error if the request was not successful
//                 console.error('Failed to load XML file');
//             }
//         }
//     };
//     // Send the request
//     xhr.send();
// }

// function fetch_data_json(filename, callback) {
//     const jsonFilePath = `http://localhost/NXT210027-HW4/json/${filename}`;

//     // Use the fetch API to get the JSON file
//     fetch(jsonFilePath)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`Failed to fetch JSON file: ${response.status} ${response.statusText}`);
//             }
//             return response.json();
//         })
//         .then(data => {
//             // Extract product information from the JSON
//             products = data.products.map((product) => {
//                 return {
//                     name: product.name,
//                     price: parseFloat(product.price),
//                     quantity: parseInt(product.quantity),
//                     category: product.category,
//                 };
//             });

//             // Now you can use the 'products' array as needed in your application
//             //console.log(products);
//             callback(products);
//         })
//         .catch(error => {
//             // Handle any errors that occurred during the fetch
//             console.error('Error fetching JSON file:', error);
//         });
// }

/*Script to handle xml & json data fetch - end */
/* Script to handle xml & json data write - start */
// function updateXmlFile(filename, updatedProducts) {
//     const xmlFilePath = 'http://localhost/NXT210027-HW4/scripts/update_xml.php';
//     const xhr = new XMLHttpRequest();
//     xhr.open('POST', xmlFilePath, true);
//     xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

//     // Convert the array of products and filename to a URL-encoded string
//     const updatedData = `filename=${encodeURIComponent(filename)}&` +
//         updatedProducts.map(product => {
//             //console.log("Product data:", product.name + ':' + product.quantity);
//             return `products[]=${encodeURIComponent(product.name + ':' + product.quantity)}`;
//         }).join('&');
//     //console.log("updateddata: "+updatedData);
//     xhr.send(updatedData);

//     xhr.onreadystatechange = function () {
//         if (xhr.readyState === XMLHttpRequest.DONE) {
//             if (xhr.status === 200) {
//                 try {
//                     //console.log(xhr.responseText);
//                     const jsonResponse = JSON.parse(xhr.responseText);
//                     console.log('JSON Response:' + jsonResponse);
//                     if (jsonResponse.success) {
//                         console.log('XML file updated successfully.');
//                     } else {
//                         console.error('Failed to update XML file.');
//                     }
//                 } catch (error) {
//                     console.error('Error parsing JSON:', error);
//                     console.error('Response Content:', xhr.responseText);
//                 }
//             } else {
//                 console.error('Failed to update XML file. Status:', xhr.status);
//             }
//         }
//     };

// }

// function updateJsonFile(filename, updatedProducts, callback) {
//     const jsonFilePath = 'http://localhost/NXT210027-HW4/scripts/test.php';
//     const xhr = new XMLHttpRequest();
//     xhr.open('POST', jsonFilePath, true);
//     xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

//     // Convert the array of products and filename to a URL-encoded string
//     const updatedData = `filename=${encodeURIComponent(filename)}&` +
//         updatedProducts.map(product => {
//             return `products[]=${encodeURIComponent(product.name + ':' + product.quantity)}`;
//         }).join('&');
//     //console.log("up data: "+updatedData);

//     xhr.onreadystatechange = function () {
//         if (xhr.readyState === XMLHttpRequest.DONE) {
//             if (xhr.status === 200) {
//                 try {
//                     const jsonResponse = JSON.parse(xhr.responseText);
//                     if (jsonResponse.success) {
//                         //console.log('JSON file updated successfully.');
//                         callback(null);
//                     } else {
//                         console.error('Failed to update JSON file.');
//                         callback('Failed to update JSON file.');
//                     }
//                 } catch (error) {
//                     console.error('Error parsing JSON:', error);
//                     console.error('Response Content:', xhr.responseText);
//                     callback('Error parsing JSON.');
//                 }
//             } else {
//                 console.error('Failed to update JSON file. Status:', xhr.status);
//                 callback(`Failed to update JSON file. Status: ${xhr.status}`);
//             }
//         }
//     };
//     xhr.send(updatedData);
// }

/* Script to handle xml & json data write - end */

/*function displayProducts(productArray, category, productListId) {
    let productList = $('#' + productListId);
    productList.empty(); // Clear the table
    console.log(productArray);
    productArray.forEach(function (product) {
        if (category === 'all' || product.category === category) {
            let displayedQuantity = product.quantity;
            let productRow = $('<tr>').appendTo(productList);

            productRow.append('<td>' + product.name + '</td>');
            productRow.append('<td><img src="../images/' + product.name + '.jpg" class="image-small"></td>');
            productRow.append('<td>$' + product.price.toFixed(2) + '</td>');
            productRow.append('<td><span id="' + product.name + '-quantity" style="display: none;">Inventory:' + displayedQuantity + '</span></td>');
            productRow.append('<td><button onclick="addToCart(\'' + product.name + '\')">Add to Cart</button></td>');
        }
    });
}*/

// Function to add products to the cart
/*function addToCart(productName) {
    
    if (!currentItemsArray) {
        if (fname.endsWith(".xml")) {
            fetch_data_xml(fname, function (data) {
                currentItemsArray = data;
            });
        }
        else if (fname.endsWith(".json")){
            fetch_data_json(fname, function (data) {
                currentItemsArray = data;
            });
        }

    }

    const productArray = currentItemsArray;
    const product = productArray.find((p) => p.name === productName);
    const existingItem = localStorage.getItem(productName);

    console.log(existingItem);
    if (existingItem) {
        console.log("existingItem");
        const inventory = document.querySelector(`#${productName}-quantity`).textContent.split(":");
        console.log("Inventory: " + inventory[1]);
        if (inventory[1] > 0 && product.quantity >= 1) {
            product.quantity = product.quantity - 1;

            const quantityCell = document.querySelector(`#${productName}-quantity`);
            //console.log(quantityCell);
            if (quantityCell) {
                //quantityCell.textContent = "";
                quantityCell.textContent = `Inventory: ${product.quantity}`;
            }
            // Split the stored value to get count and price
            const [pname, count, price] = existingItem.split(',');

            // Increase the count
            const newCount = parseInt(count) + 1;
            //remove old item before adding the new item
            localStorage.removeItem(productName);
            // Update the value in localStorage
            localStorage.setItem(productName, `${pname},${newCount},${price}`);
            
            // Update the XML file after modifying the quantity
            //console.log(fname);
            if (fname.endsWith(".xml")) {
                console.log("callinig xml");
                // fetch_data_xml(fname, function (data) {
                //     const updatedProducts = data.map((p) => {
                //         if (p.name === productName) {
                //             p.quantity = product.quantity;
                //         }
                //         return p;
                //     });

                updateXmlFile(fname, currentItemsArray);
                // });
            }
            else if (fname.endsWith(".json")) {
                console.log("callinig json");
                // fetch_data_json(fname, function (data) {
                //     const updatedProducts = data.map((p) => {
                //         if (p.name === productName) {
                //             p.quantity = product.quantity;
                //         }
                //         return p;
                //     });
                updateJsonFile(fname, currentItemsArray, function (error) {
                    if (!error) {
                        // Handle success
                        console.log('JSON file updated successfully.');
                    } else {
                        // Handle error
                        console.error('Failed to update JSON file.');
                    }
                });
                // });
            }

            console.log(localStorage.getItem(productName));
            // Implement cart functionality here
            displayErrorMessage("Added one more item of " + productName + " to the cart. Total: " + newCount + "", pgTitle.toLowerCase() + "-error");
        }
        else {
            displayErrorMessage("Sorry, " + productName + " is out of stock.", pgTitle.toLowerCase() + "-error");
        }

    } else {
        if (product) {
            console.log("newItem");
            if (product.quantity >= 1) {
                product.quantity = product.quantity - 1;
                //console.log(product.quantity);
                // Update the quantity in the HTML
                const quantityCell = document.querySelector(`#${productName}-quantity`);
                //console.log(quantityCell);
                if (quantityCell) {
                    //quantityCell.textContent = "";
                    quantityCell.textContent = `Inventory: ${product.quantity}`;
                }
                // Implement cart functionality here
                displayErrorMessage("Added one item of " + productName + " to the cart.", pgTitle.toLowerCase() + "-error");

                var val = productName + "," + 1 + "," + product.price;
                localStorage.setItem(productName, val);

                if (fname.endsWith(".xml")) {
                    // fetch_data_xml(fname, function (data) {
                    //     const updatedProducts = data.map((p) => {
                    //         if (p.name === productName) {
                    //             p.quantity = product.quantity;
                    //         }
                    //         return p;
                    //     });

                    updateXmlFile(fname, currentItemsArray);
                    //});
                }
                else if (fname.endsWith(".json")) {
                    console.log("calling json update");
                    // fetch_data_json(fname, function (data) {
                    //     const updatedProducts = data.map((p) => {
                    //         if (p.name === productName) {
                    //             p.quantity = product.quantity;
                    //         }
                    //         return p;
                    //     });
                    updateJsonFile(fname, currentItemsArray, function (error) {
                        if (!error) {
                            // Handle success
                            console.log('JSON file updated successfully.');
                        } else {
                            // Handle error
                            console.error('Failed to update JSON file.' + error);
                        }
                    });
                    //});
                }
                console.log(localStorage.getItem(productName));
            } else {
                displayErrorMessage("Sorry, " + productName + " is out of stock.", pgTitle.toLowerCase() + "-error");
            }
        } else {
            displayErrorMessage("Product not found: " + productName, pgTitle.toLowerCase() + "-error");
        }
    }
}*/

/*function displaySearchProducts(productArray, productListId) {
    let productList = $('#' + productListId);
    productList.empty(); // Clear the table
    //console.log(productArray);
    productArray.forEach(function (product) {
        let displayedQuantity = product.quantity;
        let productRow = $('<tr>').appendTo(productList);

        productRow.append('<td>' + product.name + '</td>');
        productRow.append('<td><img src="../images/' + product.name + '.jpg" class="image-small"></td>');
        productRow.append('<td>$' + product.price.toFixed(2) + '</td>');
        productRow.append('<td id="' + product.name + '-quantity" style="display: none;">Inventory:' + displayedQuantity + '</td>');
        productRow.append('<td><input type="number" placeholder="Enter quantity" id="' + product.name + '-userQuantity"></td>');
        productRow.append('<td><button onclick="addToCartSearch(\'' + product.name + '\')">Add to Cart</button></td>');
    });
}*/

var errorItem = "";
// Function to add products to the cart
// function addToCartSearch(productName) {
//     //const quantityInput = document.getElementById(`${productName}-quantity`);
//     //const quantity = parseInt(quantityInput.value);
//     const productArray = currentItemsArray;
//     const product = productArray.find((p) => p.name === productName);
//     const existingItem = localStorage.getItem(productName);
//     const userInputItem = document.querySelector(`#${productName}-userQuantity`);
//     const userInput = parseInt(userInputItem.value);

//     // Check if the input is empty or not a number
//     if (userInput === "" || isNaN(userInput) || userInput <= 0) {
//         displayErrorMessage("Please enter a valid quantity.", pgTitle.toLowerCase() + "-error");
//         return;
//     }
//     if (!errorItem.trim() === "") {
//         // Clear any previous error messages
//         clearErrorMessage(errorItem);
//     }

//     if (!currentItemsArray) {
//         fetch_data_xml_search(fname, function (data) {
//             currentItemsArray = data;
//         });
//     }


//     //console.log(existingItem);
//     if (existingItem) {
//         const inventoryElement = document.querySelector(`#${productName}-quantity`).textContent.split(":");
//         const inventory = parseInt(inventoryElement[1]);
//         if (inventory > 0 && product.quantity >= 1 && userInput <= parseInt(inventory)) {
//             const temp = product.quantity - userInput;
//             const quantityCell = document.querySelector(`#${productName}-quantity`);
//             //console.log(quantityCell);
//             if (quantityCell) {
//                 //quantityCell.textContent = "";
//                 quantityCell.textContent = `Inventory: ${temp}`;
//             }
//             // Split the stored value to get count and price
//             const [pname, count, price] = existingItem.split(',');

//             // Increase the count
//             const newCount = parseInt(count) + userInput;
//             //remove old item before adding the new item
//             localStorage.removeItem(productName);
//             // Update the value in localStorage
//             localStorage.setItem(productName, `${pname},${newCount},${price}`);

//             if (fname.endsWith(".xml")) {
//                 fetch_data_xml_search(fname, function (data) {
//                     const updatedProducts = data.map((p) => {
//                         if (p.name === productName) {
//                             p.quantity = product.quantity;
//                         }
//                         return p;
//                     });
//                     updateXmlFile(fname, updatedProducts);
//                 });
//             }

//             console.log(localStorage.getItem(productName));
//             // Implement cart functionality here
//             displayErrorMessage("Added one more item of " + productName + " to the cart. Total: " + newCount + "", pgTitle.toLowerCase() + "-error");
//         }
//         else {
//             displayErrorMessage("Sorry, " + productName + " is out of stock.", pgTitle.toLowerCase() + "-error");
//         }

//     } else {

//         if (product) {
//             console.log("productName: " + productName + ", product.name: " + product.name);
//             if (product.quantity >= 1 && userInput <= product.quantity) {
//                 product.quantity = product.quantity - userInput;
//                 console.log(product.quantity);
//                 // Update the quantity in the HTML
//                 const quantityCell = document.querySelector(`#${productName}-quantity`);
//                 //console.log(quantityCell);
//                 if (quantityCell) {
//                     //quantityCell.textContent = "";
//                     quantityCell.textContent = `Inventory: ${product.quantity}`;
//                 }
//                 // Implement cart functionality here
//                 displayErrorMessage("Added items of " + productName + " to the cart.", pgTitle.toLowerCase() + "-error");


//                 var val = productName + "," + userInput + "," + product.price;
//                 localStorage.setItem(productName, val);
//                 if (fname.endsWith(".xml")) {
//                     fetch_data_xml_search(fname, function (data) {
//                         const updatedProducts = data.map((p) => {
//                             if (p.name === productName) {
//                                 p.quantity = product.quantity;
//                             }
//                             return p;
//                         });

//                         updateXmlFile(fname, updatedProducts);
//                     });
//                 }
//                 console.log(localStorage.getItem(productName));
//             } else {
//                 displayErrorMessage("Sorry, " + productName + " is out of stock.", pgTitle.toLowerCase() + "-error");
//             }
//         } else {
//             displayErrorMessage("Product not found: " + productName, pgTitle.toLowerCase() + "-error");
//         }
//     }
// }

// Function to search for candy by name
// function searchItem(searchElement, errorElement, itemList) {
//     const inputElement = document.getElementById(searchElement);
//     const itemName = inputElement.value.trim().toLowerCase();

//     // Validate candy name (should not contain numbers)
//     if (!isValidItemName(itemName)) {
//         displayErrorMessage("Invalid item name. Please enter a valid name.", errorElement);
//         return;
//     }
//     errorItem = errorElement;
//     // Clear any previous error messages
//     clearErrorMessage(errorElement);

//     // Get candy details by name
//     const itemDetails = getItemDetailsByName(itemName);

//     if (itemDetails) {
//         // Candy found, display details
//         displayItemDetails(itemDetails, itemList);
//         //displaySearchProducts(itemDetails, itemList);
//     } else {
//         displayErrorMessage("Item not found in inventory.", errorElement);
//     }
// }

// // Function to validate candy name (no numbers allowed)
// function isValidItemName(name) {
//     const regex = /^[a-zA-Z\s]*$/;
//     return regex.test(name);
// }

// // Function to clear error message
function clearErrorMessage(errorElementId) {
    const errorElement = document.getElementById(errorElementId);
    errorElement.textContent = "";
}

// Function to display an error message
function displayErrorMessage(message, errorElementId) {
    const errorElement = document.getElementById(errorElementId);
    errorElement.textContent = message;
}

// // Function to get candy details by name
// function getItemDetailsByName(name) {
//     // Replace this with your actual candy data array  
//     return currentItemsArray.find((product) => product.name.includes(name));

// }

// // Function to display candy details
// function displayItemDetails(item, itemList) {
//     const itemTable = document.getElementById(itemList);
//     itemTable.textContent = ""; // Clear the table

//     const row = itemTable.insertRow();
//     let displayQuantity = item.quantity;
//     if (localStorage.length > 0) {
//         const storedData = localStorage.getItem(item.name);
//         if (storedData) {
//             const storedQuantity = parseInt(storedData.split(",")[1]);
//             // Subtract the stored quantity from the displayed quantity
//             displayQuantity -= storedQuantity;
//         }
//     }
//     row.innerHTML = `
//       <td>${item.name}</td>
//       <td><img src="../images/${item.name}.jpg" class="image-small"></td>
//       <td>$${item.price.toFixed(2)}</td>
//       <td id="${item.name}-quantity" style="display: none;">Inventory: ${displayQuantity}</td>
//       <td>
//         <input type="number" placeholder="Enter quantity" id="${item.name}-userQuantity" required>
//         <button onclick="addToCartSearch('${item.name}')">Add to Cart</button>
//       </td>
//     `;
// }

// Call displayProducts with default category "all" and appropriate productArray
/*if (pgTitle === "Fresh Products") {
    fname = "fresh_products.xml";
    fetch_data_xml(fname, function (data) {
        fresh_products = data;
        currentItemsArray = fresh_products;
        displayProducts(fresh_products, "all", "fresh_product_list");
    });

    const freshCategorySelector = document.getElementById("fresh-category-selector");
    freshCategorySelector.addEventListener("change", () => {
        fetch_data_xml(fname, function (data) {
            const selectedCategory = freshCategorySelector.value;
            fresh_products = data;
            currentItemsArray = fresh_products;
            console.log(currentItemsArray);
            displayProducts(fresh_products, selectedCategory, "fresh_product_list");
        });
    });
} else if (pgTitle === "Frozen") {
    fname = "frozen_products.xml";
    fetch_data_xml(fname, function (data) {
        frozen = data;
        currentItemsArray = frozen;
        console.log(currentItemsArray);
        displayProducts(frozen, "all", "frozen_list");
    });

    const frozenCategorySelector = document.getElementById(
        "frozen-category-selector"
    );
    frozenCategorySelector.addEventListener("change", () => {
        fetch_data_xml(fname, function (data) {
            const selectedCategory = frozenCategorySelector.value;
            frozen = data;
            currentItemsArray = frozen;
            console.log(currentItemsArray);
            displayProducts(frozen, selectedCategory, "frozen_list");
        });
    });
} else if (pgTitle === "Pantry") {
    fname = "pantry_products.json";
    fetch_data_json(fname, function (data) {
        pantry_products = data;
        currentItemsArray = pantry_products;
        displayProducts(pantry_products, "all", "pantry_list");
    });

    const pantryCategorySelector = document.getElementById(
        "pantry-category-selector"
    );
    pantryCategorySelector.addEventListener("change", () => {
        fetch_data_json(fname, function (data) {
           const selectedCategory = pantryCategorySelector.value;
            pantry_products = data;
            currentItemsArray = pantry_products;
            displayProducts(pantry_products, selectedCategory, "pantry_list");
        });
    });
} else if (pgTitle === "Breakfast & Cereal") {
    fname = "breakfast_products.json";
    fetch_data_json(fname, function (data) {
        breakfast_products = data;
        currentItemsArray = breakfast_products;
        displayProducts(breakfast_products, "all", "breakfast_list");
    });
    const breakfastCategorySelector = document.getElementById(
        "breakfast-category-selector"
    );
    breakfastCategorySelector.addEventListener("change", () => {
        fetch_data_json(fname, function (data) {
            const selectedCategory = breakfastCategorySelector.value;
            breakfast_products = data;
            currentItemsArray = breakfast_products;
            displayProducts(breakfast_products, selectedCategory, "breakfast_list");
        });
    });
} else if (pgTitle === "Candy") {
    fname = "candy_products.xml";
    fetch_data_xml_search(fname, function (data) {
        candy_products = data;
        currentItemsArray = candy_products;
        displaySearchProducts(candy_products, "candy_list");
    });
} else if (pgTitle === "Snacks") {
    fname = "snack_products.xml";
    fetch_data_xml_search(fname, function (data) {
        snack_products = data;
        currentItemsArray = snack_products;
        displaySearchProducts(snack_products, "snack_list");
    });
} else if (pgTitle === "Baking") {
    fname = "baking_products.json";
    fetch_data_json(fname, function (data) {
        baking_products = data;
        currentItemsArray = baking_products;
        displayProducts(baking_products, "all", "baking_list");
    });
    const bakingCategorySelector = document.getElementById(
        "baking-category-selector"
    );
    bakingCategorySelector.addEventListener("change", () => {
        fetch_data_xml(fname, function (data) {
            const selectedCategory = bakingCategorySelector.value;
            baking_products = data;
            currentItemsArray = baking_products;
            displayProducts(baking_products, selectedCategory, "baking_product_list");
        });
        
    });
}
*/
// function fetch_cart_data_json(callback) {
//     const jsonFilePath = `http://localhost/NXT210027-HW4/json/cart.json`;

//     // Use the fetch API to get the JSON file
//     fetch(jsonFilePath)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`Failed to fetch JSON file: ${response.status} ${response.statusText}`);
//             }
//             return response.json();
//         })
//         .then(data => {
//             // Extract product information from the JSON
//             products = data.products.map((product) => {
//                 return {
//                     name: product.name,
//                     price: parseFloat(product.price),
//                     quantity: parseInt(product.quantity),
//                 };
//             });

//             // Now you can use the 'products' array as needed in your application
//             //console.log(products);
//             callback(products);
//         })
//         .catch(error => {
//             // Handle any errors that occurred during the fetch
//             console.error('Error fetching JSON file:', error);
//         });
// }


// function updateCartJsonFile(updatedProducts, callback) {
//     const jsonFilePath = 'http://localhost/NXT210027-HW4/scripts/update_cart.php';
//     const xhr = new XMLHttpRequest();
//     xhr.open('POST', jsonFilePath, true);
//     xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

//     // Convert the array of products and filename to a URL-encoded string
//     const updatedData = updatedProducts.map(product => {
//         return `products[]=${encodeURIComponent(product.name + ':' + product.quantity + ':' + product.price)}`;
//     }).join('&');
//     //console.log("up data: " + updatedData);

//     xhr.onreadystatechange = function () {
//         if (xhr.readyState === XMLHttpRequest.DONE) {
//             if (xhr.status === 200) {
//                 try {
//                     const jsonResponse = JSON.parse(xhr.responseText);
//                     if (jsonResponse.success) {
//                         //console.log('JSON file updated successfully.');
//                         callback(null);
//                     } else {
//                         console.error('Failed to update JSON file.');
//                         callback('Failed to update JSON file.');
//                     }
//                 } catch (error) {
//                     console.error('Error parsing JSON:', error);
//                     console.error('Response Content:', xhr.responseText);
//                     callback('Error parsing JSON.');
//                 }
//             } else {
//                 console.error('Failed to update JSON file. Status:', xhr.status);
//                 callback(`Failed to update JSON file. Status: ${xhr.status}`);
//             }
//         }
//     };
//     xhr.send(updatedData);
// }

//populating items from local storage to cart
/*if (pgTitle === "OnGro - Cart") {
    document.addEventListener('DOMContentLoaded', function () {
        const cartItemsArray = Object.keys(localStorage);
        let items;
        console.log("length: "+ cartItemsArray.length);
        if (cartItemsArray.length > 0) {
            // LocalStorage is not empty
            // You can decide whether to fetch data immediately or wait for the "Go to Cart" button click
            // fetch_cart_data_json(callback);
            // Retrieve cart items from localStorage
            fetch_cart_data_json(function (data) {
                if (data.length == 0) {
                    console.log("Initaiting file cart: write");
                    // Retrieve cart items from localStorage
                    const cartItems = Object.keys(localStorage).map((key) => {
                        const [name, quantity, price] = localStorage.getItem(key).split(',');
                        return {
                            name: name,
                            quantity: quantity,
                            price: price,
                        };
                    });
                    //console.log("Quant: "+cartItems[quantity]);
                    updateCartJsonFile(cartItems, function (error) {
                        if (!error) {
                            console.log("Cart updated successfully");
                        } else {
                            console.error("Cart update failed: " + error);
                        }
                    });
                    items = cartItems;
                }
                else if (data) {
                    const cartItems = data.map((product) => {
                        console.log(product);
                        return {
                            name: product.name,
                            quantity: product.quantity,
                            price: product.price,
                        };
                    });

                    // Check if each product in localStorage is in the data array
                    Object.keys(localStorage).forEach((key) => {
                        const [name, quantity, price] = localStorage.getItem(key).split(',');
                        const foundProduct = cartItems.find((product) => product.name === name);

                        if (foundProduct) {
                            // Product found in the existing data array, update its quantity
                            foundProduct.quantity = parseInt(quantity);
                        } else {
                            // Product not found in the existing data array, append it
                            cartItems.push({
                                name: name,
                                quantity: quantity,
                                price: price,
                            });
                        }
                    });


                    updateCartJsonFile(cartItems, function (error) {
                        if (!error) {
                            console.log("Cart updated successfully");
                        } else {
                            console.error("Cart update failed: " + error);
                        }
                    });
                    items = cartItems;
                } else {
                    console.log("data is null");
                }

                const cartTable = document.getElementById("cart_product_list");
                const totalPriceDisplay = document.getElementById("total-price");
                let totalPrice = 0;

                // Generate HTML for each item in the cart
                items.forEach((item) => {
                    const row = cartTable.insertRow();
                    row.innerHTML = `
                        <td>${item.name}</td>
                        <td>Quantity: ${item.quantity}</td>
                        <td>Price: $${parseFloat(item.price).toFixed(2)}</td>
                        <td>Amount: $${(item.quantity * item.price).toFixed(2)}</td>
                    `;

                    totalPrice += item.quantity * item.price;
                });

                // Display the total price
                totalPriceDisplay.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
            });
        }
    });
}*/

console.log("Items in local storage: " + Object.keys(localStorage));

/*function clearCart() {
    const clearJsonFile = async () => {
        try {
            const response = await fetch('http://localhost/NXT210027-HW4/scripts/clear_cart.php', {
                method: 'POST', // or 'GET' depending on your server-side script
                headers: {
                    'Content-Type': 'application/json',
                },
                // Add additional options if needed
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            // Handle the result as needed
            console.log(result);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Call the function
    clearJsonFile();
    localStorage.clear();
    // Optionally, you can reload the page to reflect the changes immediately
    window.location.reload();
}*/