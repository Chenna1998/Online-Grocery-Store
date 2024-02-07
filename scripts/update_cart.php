<?php
$jsonFilePath = 'C:/xampp/htdocs/NXT210027-HW4/json/cart.json';
//error_log($jsonFilePath);
// //libxml_use_internal_errors(true);
$jsonData = json_decode(file_get_contents($jsonFilePath), true);

if ($jsonData === null) {
     // Handle JSON decoding error
     header('HTTP/1.1 500 Internal Server Error');
     exit('Failed to decode JSON: ' . json_last_error_msg());
}

foreach ($_POST['products'] as $product) {
    $productData = explode(':', $product);
    $productName = $productData[0];
    $productQuantity = $productData[1];
    $productPrice = $productData[2];

    $productIndex = array_search($productName, array_column($jsonData['products'], 'name'));
    //error_log('Product Index: ' . print_r(array_column($jsonData['products'], 'name'), true));
    if ($productIndex !== false) {
        // Update the quantity
        $jsonData['products'][$productIndex]['quantity'] = $productQuantity;
    } 
    else if($productIndex === false){
        $newProduct = array(
            'name' => $productName,
            'quantity' => $productQuantity,
            'price' => $productPrice
        );
        $jsonData['products'][] = $newProduct;
    }else {
        // Handle the case where the product is not found
        header('HTTP/1.1 404 Product Not Found');
        exit('Product not found in JSON.');
    }
    

}

$updatedJsonContent = json_encode($jsonData, JSON_PRETTY_PRINT);
if ($updatedJsonContent === false) {
    header('HTTP/1.1 500 Internal Server Error');
    exit('Failed to encode JSON.');
}


// Save the updated XML content
$result = file_put_contents($jsonFilePath, $updatedJsonContent);
if ($result === false) {
    header('HTTP/1.1 500 Internal Server Error');
    exit('Failed to write to XML file.');
}

// Return a success message
header('Content-Type: application/json');
echo json_encode(['success' => true]);
?>