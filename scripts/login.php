<?php
include("db_connection.php");
session_start();

$username = $_POST["username"];
$password = $_POST["password"];

$customerId = null;
$loginSuccessful = false;

$sql = "SELECT * FROM users WHERE UserName = '$username' AND Password = '$password'";

$result = $conn->query($sql);

if ($result && $row = $result->fetch_assoc()) {
    if($username === 'admin')
    {
        $_SESSION['isAdmin'] = true;
    }
    $customerId = $row['CustomerID'];
    $_SESSION['customerId'] = $customerId;
    
    
    $loginSuccessful = true;
}

if ($loginSuccessful) {
    // User login successful, redirect to the appropriate page
    $response = array(
        "status" => "success",
        "customerId" => $customerId
      );
} else {
    // Invalid credentials, display error message
    $response = "error";
}

echo json_encode($response);
$conn->close();
?>