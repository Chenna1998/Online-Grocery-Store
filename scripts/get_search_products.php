<?php

require_once 'db_connection.php';

$pageCategory = $_GET['category'];
$searchName = $_GET['name'] ?? ""; // Allow for empty category

$sql = "SELECT ItemNumber, Name, UnitPrice
          FROM inventory
          WHERE Category = '$pageCategory'";

if ($searchName) {
  if ($searchName === "") {
    $stmt = $conn->prepare($sql);
    // Fetch all products when "All" is selected
  } else {
    // Handle subcategories
    $sql .= " AND Name = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $searchName);
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
