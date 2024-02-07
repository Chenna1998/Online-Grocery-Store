const categorySelector = document.getElementById('category-selector'); // Use generic element ID
const productList = document.getElementById('product_list'); // Use generic element ID
const productError = document.getElementById('products-error'); // Use generic element ID
let pgCategory ="";

if(document.title === "Fresh Products")
{
    pgCategory = "Fresh Products";
}
else if(document.title === "Frozen")
{
    pgCategory = "Frozen Products";
}
else if(document.title === "Pantry")
{
    pgCategory = "Pantry Products";
}
else if(document.title === "Breakfast & Cereal")
{
    pgCategory = "Breakfast Products";
}
else if(document.title === "Baking")
{
    pgCategory = "baking";
}

fetchProducts(pgCategory, "all");

categorySelector.addEventListener('change', () => {
    const selectedCategory = categorySelector.value;
    fetchProducts(pgCategory, selectedCategory);
  });
  
function fetchProducts(pgCategory, selectedCategory){
    $.ajax({
        url: "../scripts/get_products.php",
        method: "GET", // Set method to GET
        data: { // Send selected category as data
          category: pgCategory,
          subCategory: selectedCategory,
        },
        success: function(response) { // Handle successful response
          productList.innerHTML = ""; // Clear existing content
          productError.textContent = ""; // Clear error message
    
          if (response.error) { // Check for errors in response
            productError.textContent = response.error;
          } else {
              parsedResponse = JSON.parse(response);
              parsedResponse.forEach(function(product) { // Loop through products
              const item = document.createElement("tr"); // Create table row
              const baseUrl = "../images/";
              item.innerHTML = `
                  <td>${product.name}</td>
                  <td><img src="${baseUrl}${product.name}.jpg" class="image-small"></td> 
                  <td>$${product.price}</td>
                  <td><button onclick="addToCart('${product.itemNumber}',1)">Add to Cart</button></td>
              `; // Set HTML for table row
              productList.appendChild(item); // Append row to product list
            });
          }
        },
        error: function(error) { // Handle errors
          productError.textContent = "Error fetching products.";
        },
      });
}