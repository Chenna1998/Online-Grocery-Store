<?php
session_start();
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $customerId = $_SESSION['customerId'];
    
    // Fetch cart items for the current user
    $sql = "SELECT c.ItemNumber, c.Quantity, t.TransactionId
            FROM carts c
            JOIN transactions t ON c.TransactionId = t.TransactionId
            WHERE c.CustomerId = '$customerId' AND c.CartStatus = 'incart'";
    
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $conn->begin_transaction();

        // Update transaction status to 'shopped' and remove items from the cart
        while ($row = $result->fetch_assoc()) {
            $itemNumber = $row['ItemNumber'];
            $quantity = $row['Quantity'];
            $transactionId = $row['TransactionId'];

            // Update transaction status to 'shopped'
            $updateTransactionStatusQuery = "UPDATE transactions SET TransactionStatus = 'shopped' WHERE TransactionId = '$transactionId'";
            $conn->query($updateTransactionStatusQuery);

            $updateCartStatusQuery = "UPDATE carts SET CartStatus = 'shopped' WHERE TransactionId = '$transactionId' AND CartStatus = 'incart'";
            $conn->query($updateCartStatusQuery);

            // Remove items from the cart
            //$removeFromCartQuery = "DELETE FROM carts WHERE CustomerId = '$customerId' AND ItemNumber = '$itemNumber' AND CartStatus = 'incart'";
            //$conn->query($removeFromCartQuery);
        }

        // Commit the transaction
        $conn->commit();

        echo json_encode([
            'error' => false,
            'message' => 'Items removed from the cart and transaction status updated successfully.',
        ]);
    } else {
        echo json_encode([
            'error' => 'No products found in cart.',
        ]);
    }
} else {
    echo json_encode([
        'error' => 'Invalid request method.',
    ]);
}

$conn->close();
?>
