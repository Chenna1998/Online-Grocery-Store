<?php
include("db_connection.php");
//header('Content-Type: application/json');
// Generate a unique identifier using uniqid()
$customerIdBase = "CI";
$username = $_POST["username"];
$password = $_POST["password"];
$firstName = $_POST["firstName"];
$lastName = $_POST["lastName"];
$dob = $_POST["dateOfBirth"];
$phone = $_POST["phoneNumber"];
$email = $_POST["email"];
$address = $_POST["address"];

// Calculate the age from the date of birth
$dateOfBirth = new DateTime($dob);
$today = new DateTime('today');
$age = $today->diff($dateOfBirth)->y;

// Retrieve the current customer ID counter value from the database
$result = $conn->query("SELECT count FROM counter");
if ($result && $row = $result->fetch_assoc()) {
    $counterValue = $row['count'];
} else {
    // Default counter value if not found in the database
    $counterValue = 1;
}

// Format the customer ID with leading zeros
$customerId = $customerIdBase . str_pad($counterValue, 3, '0', STR_PAD_LEFT);

// Increment the counter for the next customer
$nextCounterValue = $counterValue + 1;

// Update the counter value in the database for the next registration
$conn->query("UPDATE counter SET count = $nextCounterValue");

$sql1 = "INSERT INTO customer (CustomerID, FirstName, LastName, dob, Age, PhoneNumber, Email, Address) VALUES ('$customerId', '$firstName', '$lastName', '$dob', '$age', '$phone', '$email', '$address')";

if ($conn->query($sql1) === TRUE) {
    $sql2 = "INSERT INTO users (CustomerID, UserName, Password) VALUES ('$customerId', '$username', '$password')";

    if ($conn->query($sql2) === TRUE) {
        $response = "success";
    } else {
        $response = "error";
    }
} else {
    // Failed to insert customer, send error response
    $response = "error";
  }
  echo json_encode($response);
$conn->close();