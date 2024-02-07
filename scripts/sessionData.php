<?php
session_start();

$isLoggedIn = isset($_SESSION['customerId']);
$isAdmin = isset($_SESSION['isAdmin']);

echo json_encode([
  'isLoggedIn' => $isLoggedIn,
  'isAdmin' => $isAdmin,
]);
