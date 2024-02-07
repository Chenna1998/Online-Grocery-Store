<?php
include("db_connection.php");

$item_number = $_POST["itemId"];
$item_price = $_POST["itemPrice"];
$item_quantity = $_POST["itemQuantity"];

$sql = "UPDATE inventory SET UnitPrice = '$item_price', Quantity = '$item_quantity' WHERE ItemNumber = '$item_number'";
$result = $conn->query($sql);

if ($result) {
  $response = "success";
} else {
  $response =  "error";
}
echo json_encode($response);
?>