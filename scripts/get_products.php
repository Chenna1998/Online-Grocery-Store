<?php

require_once 'db_connection.php';

$pageCategory = $_GET['category'];
$selectedCategory = $_GET['subCategory'] ?? null; // Allow for empty category

$sql = "SELECT ItemNumber, Name, UnitPrice
          FROM inventory
          WHERE Category = '$pageCategory'";

if ($selectedCategory) {
  if ($selectedCategory === 'all') {
    $stmt = $conn->prepare($sql);
    // Fetch all products when "All" is selected
  } else {
    // Handle subcategories
    $sql .= " AND subCategory = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $selectedCategory);
  }
} else {
  $stmt = $conn->prepare($sql);
}

$stmt->execute();
$result = $stmt->get_result();

$products = array();
while ($row = $result->fetch_assoc()) {
  $products[] = array(
    'itemNumber' => $row['ItemNumber'],
    'name' => $row['Name'],
    'price' => $row['UnitPrice'],
  );
}

$stmt->close();
$conn->close();

echo json_encode($products);
