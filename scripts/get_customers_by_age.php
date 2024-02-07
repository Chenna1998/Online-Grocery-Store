
<?php
include("db_connection.php");

$sql = "SELECT c.CustomerID, c.FirstName, c.LastName, c.Age
          FROM customer c
          JOIN carts ct ON c.CustomerID = ct.CustomerID
          JOIN transactions t ON ct.TransactionID = t.TransactionID
          WHERE c.Age > 20
          GROUP BY c.CustomerID
          HAVING COUNT(c.CustomerID) > 3";

  $result = $conn->query($sql);

  if ($result->num_rows > 0) {
    $customers = array();
    while ($row = $result->fetch_assoc()) {
      $customer = array(
        "customerID" => $row["CustomerID"],
        "firstName" => $row["FirstName"],
        "lastName" => $row["LastName"],
        "age" => $row["Age"]
      );
      array_push($customers, $customer);
    }

    echo json_encode($customers);
  } else {
    echo json_encode([
      'error' => 'No customers found with more than 3 transactions and age greater than 20.',
    ]);
  }
