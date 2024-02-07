<?php
session_start();
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_SESSION['customerId'])) {
    $customerId = $_SESSION['customerId'];

    // Fetch all transactions for the current customer
    $sql = "SELECT t.TransactionId, t.TransactionStatus, t.TransactionDate, t.TotalPrice, c.ItemNumber, c.Quantity, c.CartStatus, i.Name
            FROM transactions t
            LEFT JOIN carts c ON t.TransactionId = c.TransactionId
            LEFT JOIN inventory i ON c.ItemNumber = i.ItemNumber
            WHERE c.CustomerId = '$customerId'
            ORDER BY t.TransactionDate DESC";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $transactions = [];
        while ($row = $result->fetch_assoc()) {
            $transactions[$row['TransactionId']][] = [
                'transactionStatus' => $row['TransactionStatus'],
                'transactionDate' => $row['TransactionDate'],
                'itemNumber' => $row['ItemNumber'],
                'name' => $row['Name'],
                'quantity' => $row['Quantity'],
                'cartStatus' => $row['CartStatus'],
            ];

            // Store other transaction details like TransactionStatus, TransactionDate, TotalPrice, etc.
            // in the $transactions array
        }

        echo json_encode([
            'error' => false,
            'transactions' => $transactions,
        ]);
    } else {
        echo json_encode([
            'error' => 'No transactions found for the current user. ',
        ]);
    }
} else {
    echo json_encode([
        'error' => 'Invalid request method or user not logged in.',
    ]);
}

$conn->close();
?>
