<?php
session_start();
include("db_connection.php");

if (isset($_POST['transactionYear'])) {
  $transactionYear = $_POST['transactionYear'];
  $customerId = $_SESSION['customerId'];
  $sql = "SELECT t.TransactionId, t.TransactionStatus, t.TransactionDate, t.TotalPrice
            FROM transactions t
            LEFT JOIN carts c ON t.TransactionId = c.TransactionId
            LEFT JOIN inventory i ON c.ItemNumber = i.ItemNumber
            WHERE c.CustomerId = '$customerId' AND
            YEAR(t.TransactionDate) = '$transactionYear'
            ORDER BY t.TransactionDate DESC
            ";

  $result = $conn->query($sql);

  if ($result->num_rows > 0) {
    $transactions = array();
    while ($row = $result->fetch_assoc()) {
      $transaction = array(
        "transactionId" => $row["TransactionId"],
        "transactionStatus" => $row["TransactionStatus"],
        "transactionDate" => $row["TransactionDate"],
        "totalPrice" => $row["TotalPrice"]
      );
      //var_dump($transaction);
      array_push($transactions, $transaction);
    }

    echo json_encode($transactions);
  } else {
    echo json_encode([
      'error' => 'No transactions found in the specfied year.',
    ]);
  }
}