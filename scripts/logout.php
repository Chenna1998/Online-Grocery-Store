<?php
session_start();

// Destroy session data
session_destroy();

$response = array(
  'success' => true,
  'message' => 'Successfully logged out!',
);

echo json_encode($response);
