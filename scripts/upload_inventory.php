<?php
include("db_connection.php");

if (isset($_FILES['inventoryFile'])) {
  $file = $_FILES['inventoryFile'];

  // Validate file type and size
  $allowedTypes = ['xml', 'json'];
  $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

  if (!in_array($extension, $allowedTypes)) {
    echo 'Invalid file type. Please upload an XML or JSON file.';
    exit;
  }

  if ($file['size'] > 1024 * 1024 * 5) { // 5MB maximum file size
    echo 'File exceeds the maximum size limit of 5MB.';
    exit;
  }

  // Move the uploaded file to a temporary location
  $tempFilePath = tempnam(sys_get_temp_dir(), 'inventory_' . time());
  move_uploaded_file($file['tmp_name'], $tempFilePath);

  // Parse the inventory file based on its type
  if ($extension === 'xml') {
    parseXMLInventory($tempFilePath);
  } elseif ($extension === 'json') {
    parseJSONInventory($tempFilePath);
  }

  // Remove the temporary file
  unlink($tempFilePath);
}

function parseXMLInventory($filePath) {
    include("db_connection.php");
  
    $xmlContent = file_get_contents($filePath);
  
    if ($xmlContent === false) {
      header('HTTP/1.1 500 Internal Server Error');
      exit('Failed to read XML file.');
    }
  
    // Parse the XML content
    libxml_use_internal_errors(true);
    $xml = simplexml_load_string($xmlContent);
  
    if ($xml === false) {
      $errors = libxml_get_errors();
      header('HTTP/1.1 500 Internal Server Error');
      exit('Failed to parse XML: ' . print_r($errors, true));
    }
  
    // Prepare statements
    $insertStatement = $conn->prepare("INSERT INTO inventory (ItemNumber, Name, Category, SubCategory, UnitPrice, Quantity) VALUES (?, ?, ?, ?, ?, ?)");
    $updateStatement = $conn->prepare("UPDATE inventory SET Category = ?, SubCategory = ?, UnitPrice = ?, Quantity = ? WHERE ItemNumber = ? AND Name = ?");
  
    // Iterate over each product in the XML
    foreach ($xml->product as $xmlProduct) {
      $itemNumber = generateItemID();
      $name = (string)$xmlProduct->name;
      $category = (string)$xmlProduct->category;
      $subCategory = (string)$xmlProduct->subCategory;
      $price = (float)$xmlProduct->price;
      $quantity = (int)$xmlProduct->quantity;
  
      // Check if the product already exists
      $sql = "SELECT * FROM inventory WHERE ItemNumber = ? AND Name = ?";
      $result = $conn->prepare($sql);
      $result->bind_param("ss", $itemNumber, $name);
      $result->execute();
      $result->store_result();

      if ($result->num_rows > 0) {
        // Update the existing product
        $updateStatement->bind_param("ssdiss", $category, $subCategory, $price, $quantity, $itemNumber, $name);
        $updateStatement->execute();
  
        if ($updateStatement->errno) {
          echo json_encode(['success' => false, 'error' => mysqli_error($conn)]);
          continue;
        }
      } else {
        // Insert a new product
        $insertStatement->bind_param("ssssdi", $itemNumber, $name, $category, $subCategory, $price, $quantity);
        $insertStatement->execute();
  
        if ($insertStatement->errno) {
          echo json_encode(['success' => false, 'error' => mysqli_error($conn)]);
          continue;
        }
      }
      $result->free_result();
      $result->close();
      echo json_encode(['success' => true]);
    }
  
    mysqli_close($conn);
  }
  

  function parseJSONInventory($filePath) {
    include("db_connection.php");
  
    // Read and decode the JSON file
    $jsonData = json_decode(file_get_contents($filePath), true);
  
    if ($jsonData === null) {
      // Handle JSON decoding error
      header('HTTP/1.1 500 Internal Server Error');
      exit('Failed to decode JSON: ' . json_last_error_msg());
    }
  
    // Prepare prepared statements
    $insertStatement = $conn->prepare("INSERT INTO inventory (ItemNumber, Name, Category, SubCategory, UnitPrice, Quantity) VALUES (?, ?, ?, ?, ?, ?)");
    $updateStatement = $conn->prepare("UPDATE inventory SET Category = ?, SubCategory = ?, UnitPrice = ?, Quantity = ? WHERE ItemNumber = ? AND Name = ?");
    //var_dump($jsonData);
    // Loop through each product in the decoded JSON
    foreach ($jsonData["products"] as $index => $productData) {
    //var_dump($productData);

      $itemNumber = generateItemID();
      $name = $productData['name'];
      $category = $productData['category'];
      $subCategory = $productData['subCategory'];
      $price = $productData['price'];
      $quantity = $productData['quantity'];
  
      // Check if the product already exists
      $sql = "SELECT * FROM inventory WHERE ItemNumber = ? AND Name = ?";
      $checkStatement = $conn->prepare($sql);
      $checkStatement->bind_param("ss", $itemNumber, $name);
      $checkStatement->execute();
      $checkResult = $checkStatement->get_result();
  
      if ($checkResult->num_rows > 0) {
        // Update existing product
        $updateStatement->bind_param("ssdiss", $category, $subCategory, $price, $quantity, $itemNumber, $name);
        $updateStatement->execute();
  
        if ($updateStatement->errno) {
          echo json_encode(['success' => false, 'error' => mysqli_error($conn)]);
          continue;
        }
      } else {
        // Insert new product
        $insertStatement->bind_param("ssssdi", $itemNumber, $name, $category, $subCategory, $price, $quantity);
        $insertStatement->execute();
  
        if ($insertStatement->errno) {
          echo json_encode(['success' => false, 'error' => mysqli_error($conn)]);
          continue;
        }
      }
    }
  
    // Close database connection and return success message
    mysqli_close($conn);
    echo json_encode(['success' => true]);
  }
  
  function generateItemID(){
    include("db_connection.php");
    $itemIdBase = "IN";

    $result = $conn->query("SELECT item_count FROM counter");
    if ($result && $row = $result->fetch_assoc()) {
        $counterValue = $row['item_count'];
    } else {
        // Default counter value if not found in the database
        $counterValue = 1;
    }

    // Format the customer ID with leading zeros
    $itemId = $itemIdBase . str_pad($counterValue, 3, '0', STR_PAD_LEFT);

    // Increment the counter for the next customer
    $nextCounterValue = $counterValue + 1;

    // Update the counter value in the database for the next registration
    $conn->query("UPDATE counter SET item_count = $nextCounterValue");
    return $itemId;
}