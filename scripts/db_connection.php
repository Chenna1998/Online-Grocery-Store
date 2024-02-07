<?php
// Database connection details
$servername = "localhost";
$username = "root"; // Default XAMPP username
$password = ""; // Default XAMPP password is often empty
$dbname = "hw5"; // Your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
    //echo "Connected successfully!";
    // Query to get all tables in the database
    // $query = "SELECT table_name
    //           FROM information_schema.tables
    //           WHERE table_schema = '$dbname'";

    // $result = $conn->query($query);

    // if ($result->num_rows > 0) {
    //     echo "Tables in the database:<br>";
    //     while ($row = $result->fetch_assoc()) {
    //         echo $row['table_name'] . "<br>";
    //     }
    // } else {
    //     echo "No tables found in the database.";
    // }
}


//$conn->close();
?>
