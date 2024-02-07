<?php
$cartJsonFilePath = 'C:/xampp/htdocs/NXT210027-HW4/json/cart.json';

$inventoryMapping = array(
    'Carrots' => 'C:/xampp/htdocs/NXT210027-HW4/xml/fresh_products.xml',
    'Strawberry' => 'C:/xampp/htdocs/NXT210027-HW4/xml/fresh_products.xml',
    'Mango' => 'C:/xampp/htdocs/NXT210027-HW4/xml/fresh_products.xml',
    'Orchids' => 'C:/xampp/htdocs/NXT210027-HW4/xml/fresh_products.xml',
    'Mayo' => 'C:/xampp/htdocs/NXT210027-HW4/xml/fresh_products.xml',
    'Apricots' => 'C:/xampp/htdocs/NXT210027-HW4/xml/fresh_products.xml',
    'Mushrooms' => 'C:/xampp/htdocs/NXT210027-HW4/xml/fresh_products.xml',
    'BrusselsSprouts' => 'C:/xampp/htdocs/NXT210027-HW4/xml/fresh_products.xml',
    'hotPockets' => 'C:/xampp/htdocs/NXT210027-HW4/xml/frozen_products.xml',
    'oreo' => 'C:/xampp/htdocs/NXT210027-HW4/xml/frozen_products.xml',
    'fishAndChips' => 'C:/xampp/htdocs/NXT210027-HW4/xml/frozen_products.xml',
    'pizza' => 'C:/xampp/htdocs/NXT210027-HW4/xml/frozen_products.xml',
    'frozenFish' => 'C:/xampp/htdocs/NXT210027-HW4/xml/frozen_products.xml',
    'pizzaRolls' => 'C:/xampp/htdocs/NXT210027-HW4/xml/frozen_products.xml',
    'shrimp' => 'C:/xampp/htdocs/NXT210027-HW4/xml/frozen_products.xml',
    'tomatoSoup' => 'C:/xampp/htdocs/NXT210027-HW4/json/pantry_products.json',
    'corn' => 'C:/xampp/htdocs/NXT210027-HW4/json/pantry_products.json',
    'hotSauce' => 'C:/xampp/htdocs/NXT210027-HW4/json/pantry_products.json',
    'PeanutButter' => 'C:/xampp/htdocs/NXT210027-HW4/json/pantry_products.json',
    'PizzaCrusts' => 'C:/xampp/htdocs/NXT210027-HW4/json/pantry_products.json',
    'oil' => 'C:/xampp/htdocs/NXT210027-HW4/json/pantry_products.json',
    'cheerios' => 'C:/xampp/htdocs/NXT210027-HW4/json/breakfast_products.json',
    'Eggo' => 'C:/xampp/htdocs/NXT210027-HW4/json/breakfast_products.json',
    'frenchToast' => 'C:/xampp/htdocs/NXT210027-HW4/json/breakfast_products.json',
    'QuakerOats' => 'C:/xampp/htdocs/NXT210027-HW4/json/breakfast_products.json',
    'Cinnabon' => 'C:/xampp/htdocs/NXT210027-HW4/json/breakfast_products.json',
    'pieFillings' => 'C:/xampp/htdocs/NXT210027-HW4/json/baking_products.json',
    'crusts' => 'C:/xampp/htdocs/NXT210027-HW4/json/baking_products.json',
    'puddingMixes' => 'C:/xampp/htdocs/NXT210027-HW4/json/baking_products.json',
    'piePans' => 'C:/xampp/htdocs/NXT210027-HW4/json/baking_products.json',
    'lays' => 'C:/xampp/htdocs/NXT210027-HW4/xml/snack_products.xml',
    'biscuits' => 'C:/xampp/htdocs/NXT210027-HW4/xml/snack_products.xml',
    'nuts' => 'C:/xampp/htdocs/NXT210027-HW4/xml/snack_products.xml',
    'crackers' => 'C:/xampp/htdocs/NXT210027-HW4/xml/snack_products.xml',
    'hersheys' => 'C:/xampp/htdocs/NXT210027-HW4/xml/candy_products.xml',
    'snickers' => 'C:/xampp/htdocs/NXT210027-HW4/xml/candy_products.xml',
    'mars' => 'C:/xampp/htdocs/NXT210027-HW4/xml/candy_products.xml',
    'lindor' => 'C:/xampp/htdocs/NXT210027-HW4/xml/candy_products.xml',
    // Add more items and their corresponding file paths as needed
);

// Read the existing JSON content from the cart file
$jsonData = json_decode(file_get_contents($cartJsonFilePath), true);

if ($jsonData === null) {
    // Handle JSON decoding error
    header('HTTP/1.1 500 Internal Server Error');
    exit('Failed to decode JSON: ' . json_last_error_msg());
}

// Loop through each product in the cart and update the inventory
foreach ($jsonData['products'] as $product) {
    $productName = $product['name'];
    $productQuantity = $product['quantity'];

    // Check if the item name exists in the inventory mapping
    if (array_key_exists($productName, $inventoryMapping)) {
        $inventoryFilePath = $inventoryMapping[$productName];

        // Update inventory based on the file type
        $fileExtension = pathinfo($inventoryFilePath, PATHINFO_EXTENSION);

        switch ($fileExtension) {
            case 'json':
                // Update JSON file
                $inventoryData = json_decode(file_get_contents($inventoryFilePath), true);

                if ($inventoryData !== null) {
                    $productIndex = array_search($productName, array_column($inventoryData['products'], 'name'));

                    if ($productIndex !== false) {
                        // Update the inventory quantity
                        $inventoryData['products'][$productIndex]['quantity'] += $productQuantity;
                    }

                    // Save the updated inventory content
                    $result = file_put_contents($inventoryFilePath, json_encode($inventoryData, JSON_PRETTY_PRINT));

                    if ($result === false) {
                        header('HTTP/1.1 500 Internal Server Error');
                        exit("Failed to write to $productName inventory file.");
                    }
                }
                break;
            case 'xml':
                // Update XML file
                $xml = simplexml_load_file($inventoryFilePath);
                if ($xml === false) {
                    $errors = libxml_get_errors();
                    header('HTTP/1.1 500 Internal Server Error');
                    exit('Failed to parse XML: ' . print_r($errors, true));
                }
                foreach ($xml->product as $xmlProduct) {
                    // Check if the product name matches
                    if ((string)$xmlProduct->name == $productName) {
                        // Assuming that 'quantity' is a child element of 'product'
                        $xmlProduct->quantity = (int)$xmlProduct->quantity + $productQuantity;
                        break; // Exit the loop once the product is found
                    }
                }
                // Save the updated XML content
                //$result = $xml->asXML($inventoryFilePath);
                $result = file_put_contents($inventoryFilePath, $xml->asXML());
                if ($result === false) {
                    header('HTTP/1.1 500 Internal Server Error');
                    exit("Failed to write to $productName inventory file.");
                }
                break;
            default:
                // Handle unsupported file types
                header('HTTP/1.1 500 Internal Server Error');
                exit("Unsupported file type: $fileExtension");
        }
    }
}

// Clear the products array in the cart JSON file
$jsonData['products'] = array();

// Encode the updated JSON content
$updatedJsonContent = json_encode($jsonData, JSON_PRETTY_PRINT);

if ($updatedJsonContent === false) {
    header('HTTP/1.1 500 Internal Server Error');
    exit('Failed to encode JSON.');
}

// Save the updated JSON content
$result = file_put_contents($cartJsonFilePath, $updatedJsonContent);

if ($result === false) {
    header('HTTP/1.1 500 Internal Server Error');
    exit('Failed to write to cart.json file.');
}

// Return a success message
header('Content-Type: application/json');
echo json_encode(['success' => true]);
?>
