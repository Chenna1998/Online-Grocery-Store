<?php
session_start();
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $customerId = $_SESSION['customerId'];
    $itemNumber = $_POST['itemNumber'];
    $transactionId = $_POST['transactionId']; // Added transactionId parameter

    if ($itemNumber && $transactionId) {
        $conn->begin_transaction();

        // Check if the item is the last one in the cart for the transaction
        $checkLastCartItemQuery = "SELECT COUNT(*) AS itemCount
                                    FROM carts
                                    WHERE CustomerId = '$customerId' AND TransactionId = '$transactionId' AND CartStatus = 'incart'";
        $checkLastCartItemResult = $conn->query($checkLastCartItemQuery);
        $itemCount = $checkLastCartItemResult->fetch_assoc()['itemCount'];

        // Update cart status for the specified item and transaction
        $updateCartStatusQuery = "UPDATE carts
                                  SET CartStatus = 'cancelled'
                                  WHERE CustomerId = '$customerId' AND ItemNumber = '$itemNumber' AND TransactionId = '$transactionId' AND CartStatus = 'incart'";
        $conn->query($updateCartStatusQuery);

        // Check the canceled item quantity
        $checkItemQuantityQuery = "SELECT Quantity
                                  FROM carts
                                  WHERE CustomerId = '$customerId' AND ItemNumber = '$itemNumber' AND TransactionId = '$transactionId' AND CartStatus = 'cancelled'";
        $checkItemQuantityResult = $conn->query($checkItemQuantityQuery);
        $canceledQuantity = $checkItemQuantityResult->fetch_assoc()['Quantity'];

        // Update inventory for the canceled item
        $updateInventoryQuery = "UPDATE inventory
                                SET Quantity = Quantity + $canceledQuantity
                                WHERE ItemNumber = '$itemNumber'";
        $conn->query($updateInventoryQuery);

        // Delete the canceled item from the carts table
        //$deleteCartItemQuery = "DELETE FROM carts
        //                        WHERE CustomerId = '$customerId' AND ItemNumber = '$itemNumber' AND TransactionId = '$transactionId' AND CartStatus = 'cancelled'";
        //$conn->query($deleteCartItemQuery);

        // If the item was the last one in the cart for the transaction, update transaction status to 'cancelled'
        if ($itemCount == 1) {
            $updateTransactionStatusQuery = "UPDATE transactions
                                              SET TransactionStatus = 'cancelled'
                                              WHERE TransactionId = '$transactionId' AND TransactionStatus = 'incart'";
            $conn->query($updateTransactionStatusQuery);

            // Delete the canceled item from the carts table
            //$deleteCartItemQuery = "DELETE FROM carts
            //                        WHERE CustomerId = '$customerId' AND TransactionId = '$transactionId' AND CartStatus = 'cancelled'";
            //$conn->query($deleteCartItemQuery);
        }

        $conn->commit();

        // Check if the item was the last one in the cart for the transaction
        if ($itemCount == 1) {
            // Remove transactionId from localStorage
            echo json_encode([
                'success' => true,
                'message' => 'Item canceled, inventory updated, and transaction status updated successfully.',
                'removeTransactionId' => true,
            ]);
        } else {
            echo json_encode([
                'success' => true,
                'message' => 'Item canceled and inventory updated successfully.',
                'removeTransactionId' => false,
            ]);
        }
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Invalid item number or transaction ID.',
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
