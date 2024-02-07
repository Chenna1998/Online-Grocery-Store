<?php
include("db_connection.php");

$sql = "SELECT * FROM inventory WHERE Quantity < 3";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  $inventoryData = array();
  while ($row = $result->fetch_assoc()) {
    $item = array(
      "itemNumber" => $row["ItemNumber"],
      "name" => $row["Name"],
      "category" => $row["Category"],
      "subCategory" => $row["SubCategory"],
      "unitPrice" => $row["UnitPrice"],
      "quantity" => $row["Quantity"]
    );
    array_push($inventoryData, $item);
  }

  echo json_encode($inventoryData);
} else {
  $item = [];
  echo json_encode($item);
}
