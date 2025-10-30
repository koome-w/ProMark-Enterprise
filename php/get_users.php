<?php
session_start();
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Not logged in"]);
    exit;
}

echo json_encode([
    "status" => "success",
    "data" => [
        "id" => $_SESSION['user_id'],
        "full_name" => $_SESSION['full_name'],
        "email" => $_SESSION['email'],
        "role" => $_SESSION['role'],
        "created_at" => $_SESSION['created_at']
    ]
]);
?>
