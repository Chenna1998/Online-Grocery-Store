const categorySelector = document.getElementById('category-selector'); // Use generic element ID
const productList = document.getElementById('product_list'); // Use generic element ID
const productError = document.getElementById('products-error'); // Use generic element ID


if(document.title === "Snacks")
{
    pgCategory = "Snacks";
}
else if(document.title === "Candy")
{
    pgCategory = "Candy";
}

// Function to fetch product data from PHP
function fetchProductData(pgCategory, searchName) {
    $.ajax({
      url: "../scripts/get_search_products.php",
      method: "GET",
      data: {
        category: pgCategory,
        name: searchName,
      },
      success: function(response) {
        productList.innerHTML = "";
        productError.textContent = "";
  
        if (response.error) {
          productError.textContent = response.error;
        } else {
          const parsedResponse = JSON.parse(response);
          parsedResponse.forEach(function(product) {
            const item = document.createElement("tr");
            const baseUrl = "../images/";
            item.innerHTML = `
              <td>${product.name}</td>
              <td><img src="${baseUrl}${product.name}.jpg" class="image-small"></td> 
              <td>$${product.price}</td>
              <td><input type="number" placeholder="Enter quantity" id="${product.name}-userQuantity"></td>
              <td><button onclick="addToCart('${product.itemNumber}', $('#${product.name}-userQuantity').val())">Add to Cart</button></td>
            `;
            productList.appendChild(item);
          });
        }
      },
      error: function(error) {
        productError.textContent = "Error fetching products.";
      },
    });
  }
  
  // Function to handle search functionality
  function searchItem() {
    const searchInput = document.getElementById("candy-search-input");
    const searchTerm = searchInput.value.trim().toLowerCase();
    const errorElement = "products-error";
    console.log(errorElement);
    // Validate candy name (should not contain numbers)
    if (!isValidItemName(searchTerm)) {
        displayErrorMessage("Invalid item name. Please enter a valid name.", errorElement);
        return;
    }
    // Clear any previous error messages
    clearErrorMessage(errorElement);

    if (searchTerm) {
      // Filter products based on search term
      const searchName = searchTerm;
      fetchProductData(pgCategory, searchName);
    } else {
      // Clear search results and display all products of the category
      productList.innerHTML = "";
      fetchProductData(pgCategory, "");
    }
  }
  
  // Function to validate candy name (no numbers allowed)
function isValidItemName(name) {
    const regex = /^[a-zA-Z\s]*$/;
    return regex.test(name);
}

// Function to clear error message
function clearErrorMessage(errorElementId) {
    const errorElement = document.getElementById(errorElementId);
    errorElement.textContent = "";
}

function displayErrorMessage(message, errorElementId) {
    const errorElement = document.getElementById(errorElementId);
    errorElement.textContent = message;
}

  // Event listener for search button
  const searchButton = document.getElementById("search-button");
  searchButton.addEventListener("click", searchItem);
  
  // Initialize page with default category and display all products
  fetchProductData(pgCategory, "");
  