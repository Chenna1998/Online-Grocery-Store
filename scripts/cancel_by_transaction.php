<?php
session_start();
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $customerId = $_SESSION['customerId'];
    $transactionId = $_POST['transactionId']; // Added transactionId parameter

    if ($transactionId) {
        $conn->begin_transaction();

        // Update cart status for all items under the specified transactionId
        $updateCartStatusQuery = $conn->query("UPDATE carts
                                                SET CartStatus = 'cancelled'
                                              WHERE CustomerId = '$customerId' AND TransactionId = '$transactionId' AND CartStatus != 'shopped'");

        // Check if any rows were affected by the cart status update
        if ($conn->affected_rows > 0) {
            // Update inventory for all canceled items
            $updateInventoryQuery = $conn->query("UPDATE inventory i
                                                    INNER JOIN carts c ON i.ItemNumber = c.ItemNumber
                                                    SET i.Quantity = i.Quantity + c.Quantity
                                                  WHERE c.CustomerId = '$customerId' AND c.TransactionId = '$transactionId' AND c.CartStatus = 'cancelled'");

            // Check if any rows were affected by the inventory update
            if ($conn->affected_rows > 0) {
                // Check if the transaction status should be updated to 'cancelled'
                $updateTransactionStatusQuery = $conn->query("UPDATE transactions
                                                                SET TransactionStatus = 'cancelled'
                                                              WHERE TransactionId = '$transactionId' AND TransactionStatus != 'shopped'");

                // Check if any rows were affected by the transaction status update
                if ($conn->affected_rows > 0) {
                    echo json_encode([
                        'success' => true,
                        'message' => 'Transaction canceled successfully.',
                        'removeTransactionId' => true,
                    ]);
                } else {
                    echo json_encode([
                        'success' => true,
                        'message' => 'Items canceled and inventory updated successfully.',
                        'removeTransactionId' => false,
                    ]);
                }
            } else {
                echo json_encode([
                    'success' => false,
                    'error' => 'Error updating inventory.',
                ]);
            }
        } else {
            echo json_encode([
                'success' => false,
                'error' => 'Error updating cart status.',
            ]);
        }

        $conn->commit();
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Invalid transaction ID.',
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Invalid request method.',
    ]);
}

$conn->close();
?>
