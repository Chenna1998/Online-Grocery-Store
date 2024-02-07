<?php
$filename = $_POST['filename'];
$xmlFilePath = 'C:/xampp/htdocs/NXT210027-HW4/xml/' . $filename;

// Load the existing XML content
$xmlContent = file_get_contents($xmlFilePath);
//echo "file content php: ". $xmlContent ;
if ($xmlContent === false) {
    header('HTTP/1.1 500 Internal Server Error');
    exit('Failed to read XML file.');
}

// Parse the XML content
libxml_use_internal_errors(true);
$xml = simplexml_load_string($xmlContent);
//echo "php debug: ". json_encode($xml) ;
if ($xml === false) {
    $errors = libxml_get_errors();
    header('HTTP/1.1 500 Internal Server Error');
    exit('Failed to parse XML: ' . print_r($errors, true));
}

// Update the XML content
foreach ($_POST['products'] as $product) { 
    $productData = explode(':', $product);
    $productName = $productData[0];
    $productQuantity = $productData[1];

    //echo "php debug: ". $productName ;
    // Iterate over each product in the XML
    foreach ($xml->product as $xmlProduct) {
        // Check if the product name matches
        if ((string)$xmlProduct->name == $productName) {
            // Assuming that 'quantity' is a child element of 'product'
            $xmlProduct->quantity = $productQuantity;
            break; // Exit the loop once the product is found
        }
    } 
    if(!isset($xmlProduct)){
        // Handle the case where the product is not found
        header('HTTP/1.1 404 Not Found');
        exit('Product not found in XML.');
    }
}

// Save the updated XML content
$result = file_put_contents($xmlFilePath, $xml->asXML());
if ($result === false) {
    header('HTTP/1.1 500 Internal Server Error');
    exit('Failed to write to XML file.');
}

// Return a success message
header('Content-Type: application/json');
echo json_encode(['success' => true]);
?>