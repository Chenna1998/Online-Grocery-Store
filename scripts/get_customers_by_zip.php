<?php
include("db_connection.php");

if (isset($_POST['transactionMonth']) && isset($_POST['zipCode'])) {
  $transactionMonth = $_POST['transactionMonth'];
  $zipCode = $_POST['zipCode'];

  $sql = "SELECT c.CustomerID, c.FirstName, c.LastName
  FROM customer c
  JOIN carts ct ON c.CustomerID = ct.CustomerID
  JOIN transactions t ON ct.TransactionID = t.TransactionID
  WHERE c.Address LIKE '%$zipCode%'
    AND t.TransactionDate LIKE '%-$transactionMonth-%'
    GROUP BY c.CustomerID
    HAVING COUNT(c.CustomerID) > 2";

  $result = $conn->query($sql);

  if ($result->num_rows > 0) {
    $customers = array();
    while ($row = $result->fetch_assoc()) {
      $customer = array(
        "customerID" => $row["CustomerID"],
        "firstName" => $row["FirstName"],
        "lastName" => $row["LastName"]
      );
      array_push($customers, $customer);
    }

    echo json_encode($customers);
  } else {
    echo json_encode([
      'error' => 'No customers found with more than 2 transactions in the given month living in the given zipcode. ',
    ]);
  }
}