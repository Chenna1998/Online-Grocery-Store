<?php
session_start();
include("db_connection.php");
header('Content-Type: application/json');
$customerId = $_SESSION['customerId'];

$fetchSuccessful = true;
$firstName = "";
$lastName = "";
$dob = "";
$age = null;
$phone = "";
$email = "";
$address = "";

$sql = "SELECT * FROM customer WHERE CustomerID = '$customerId'";

$result = $conn->query($sql);

if ($result && $row = $result->fetch_assoc()) {
    $firstName = $row['FirstName'];
    $lastName = $row['LastName'];
    $dob = $row['dob'];
    $age = intval($row['Age']);
    $phone = $row['PhoneNumber'];
    $email = $row['Email'];
    $address = $row['Address'];
    $fetchSuccessful = true;
}

if ($fetchSuccessful) {
    // User login successful, redirect to the appropriate page
    $response = array(
        "status" => "success",
        "customerId" => $customerId,
        "firstName" => $firstName,
        "lastName" => $lastName,
        "dob" => $dob,
        "age" => $age,
        "phone" => $phone,
        "email" => $email,
        "address" => $address
      );
} else {
    // Invalid credentials, display error message
    $response = "error";
}

echo json_encode($response);
$conn->close();
?>