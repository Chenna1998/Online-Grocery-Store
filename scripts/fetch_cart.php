<?php
session_start();
include 'db_connection.php';

// Fetch cart items for the current user
$customerId = $_SESSION['customerId']; // Replace with actual customer ID
$sql = "SELECT c.ItemNumber, c.Quantity, i.Category, i.SubCategory, i.Name, i.UnitPrice, (c.Quantity * i.UnitPrice) AS amount, t.TransactionId, t.TotalPrice
        FROM carts c
        JOIN inventory i ON c.ItemNumber = i.ItemNumber
        JOIN transactions t ON c.TransactionId = t.TransactionId
        WHERE c.CustomerId = '$customerId' AND c.CartStatus = 'incart'";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = [
            'itemNumber' => $row['ItemNumber'],
            'category' => $row['Category'],
            'subCategory' => $row['SubCategory'],
            'name' => $row['Name'],
            'quantity' => $row['Quantity'],
            'price' => $row['UnitPrice'],
            'amount' => $row['amount'],
            'transactionId' => $row['TransactionId'],
            'totalPrice' => $row['TotalPrice'],
        ];
    }

    echo json_encode([
        'error' => false,
        'products' => $products,
        'totalPrice' => $products[0]['totalPrice'],
    ]);
} else {
    echo json_encode([
        'error' => 'No products found in cart.',
    ]);
}

$conn->close();
