<?php
session_start();

$authorized = isset($_SESSION['isAdmin']) && $_SESSION['isAdmin'];

echo json_encode([
  'authorized' => $authorized,
]);
