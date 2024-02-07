<?php

require_once 'db_connection.php';
session_start();

$itemNumber = $_POST['itemNumber'];
$quantity = (int)$_POST['quantity'];
$existingTransactionId = $_POST['existingTransactionId'];
$newTransactionId = "";
// Start a new transaction
$conn->begin_transaction();

// Check if item is in stock
$sql = "SELECT Quantity FROM inventory WHERE ItemNumber = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $itemNumber);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$availableQuantity = $row['Quantity'];

if ($availableQuantity < $quantity) {
  $conn->rollback();
  echo json_encode(['error' => 'Not enough stock. Available quantity: ' . $availableQuantity]);
  exit;
}
// Update inventory
$sql = "UPDATE inventory SET Quantity = Quantity - ? WHERE ItemNumber = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('is', $quantity, $itemNumber);
$stmt->execute();

if ($stmt->error) {
  $conn->rollback();
  echo json_encode(['error' => 'Inventory update failed. Please try again later.']);
  exit;
}

// Update cart and transaction
if ($existingTransactionId) {
  // Check if item already exists in cart
  $sql = "SELECT Quantity, CartStatus FROM carts WHERE TransactionId = ? AND ItemNumber = ?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param('ss', $existingTransactionId, $itemNumber);
  $stmt->execute();
  $result = $stmt->get_result();
  $row = $result->fetch_assoc();

  if ($row) {
    // Update existing cart entry and check transaction status
    $newQuantity = $row['Quantity'] + $quantity;
    $currentStatus = $row['CartStatus'];

    if ($currentStatus === 'shopped' || $currentStatus === 'cancelled') {
      $conn->rollback();
      echo json_encode(['error' => 'This transaction is already completed.']);
      exit;
    }

    $sql = "UPDATE carts SET Quantity = ?, CartStatus = 'incart' WHERE TransactionId = ? AND ItemNumber = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('iss', $newQuantity, $existingTransactionId, $itemNumber);
  } else {
    // Add new item to existing cart
    $newQuantity = $quantity;
    $sql = "INSERT INTO carts (CustomerId, TransactionId, ItemNumber, Quantity, CartStatus) VALUES (?, ?, ?, ?, 'incart')";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('sssi', $_SESSION['customerId'], $existingTransactionId, $itemNumber, $newQuantity);
  }
} else {
  // Create new transaction and cart entry
  $sql = "INSERT INTO transactions (TransactionID, TransactionStatus, TransactionDate) VALUES (?, 'incart', NOW())";
    $stmt = $conn->prepare($sql);
    $newTransactionId = generateTransactionID(); // Generate or get the ID
    $stmt->bind_param('s', $newTransactionId);
    $stmt->execute();

    $sql = "INSERT INTO carts (CustomerId, TransactionId, ItemNumber, Quantity, CartStatus) VALUES (?, ?, ?, ?, 'incart')";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('sssi', $_SESSION['customerId'], $newTransactionId, $itemNumber, $quantity);
}

$stmt->execute();

if ($stmt->error) {
  $conn->rollback();
  echo json_encode(['error' => 'Cart/transaction update failed. Please try again later.']);
  exit;
}

// Update transaction total price
$sql = "SELECT SUM(i.UnitPrice * c.Quantity) AS totalPrice
FROM carts c
JOIN inventory i ON c.ItemNumber = i.ItemNumber
WHERE c.TransactionId = ?;
";
$stmt = $conn->prepare($sql);
$transactionID = $existingTransactionId ? $existingTransactionId : $newTransactionId;
$stmt->bind_param('s', $transactionID);
$stmt->execute();
$result = $stmt->get_result();

// Fetch the updated total price
$row = $result->fetch_assoc();
$totalPrice = $row['totalPrice'];

// Update transaction table with total price
$sql = "UPDATE transactions SET TotalPrice = ? WHERE TransactionId = ?";
$stmt = $conn->prepare($sql);

$stmt->bind_param('ds', $totalPrice, $transactionID);
$stmt->execute();

if ($stmt->error) {
  $conn->rollback();
  echo json_encode(['error' => 'Transaction price update failed. Please try again later.']);
  exit;
}

// Commit changes and send success response
$conn->commit();
try{
    $newTransaction = $newTransactionId ? true : false;
    $transactionIDValue = $existingTransactionId ? $existingTransactionId : $newTransactionId;
}
catch(Exception $e){
    $newTransaction = false;
    $transactionIDValue = $existingTransactionId;
}



echo json_encode([
  'error' => false,
  'newTransaction' => $newTransaction,
  'transactionId' => $transactionIDValue,
]);

function generateTransactionID(){
    include("db_connection.php");
    $transactionIdBase = "TI";

    $result = $conn->query("SELECT transaction_count FROM counter");
    if ($result && $row = $result->fetch_assoc()) {
        $counterValue = $row['transaction_count'];
    } else {
        // Default counter value if not found in the database
        $counterValue = 1;
    }

    // Format the customer ID with leading zeros
    $transactionId = $transactionIdBase . str_pad($counterValue, 3, '0', STR_PAD_LEFT);

    // Increment the counter for the next customer
    $nextCounterValue = $counterValue + 1;

    // Update the counter value in the database for the next registration
    $conn->query("UPDATE counter SET transaction_count = $nextCounterValue");
    return $transactionId;
}