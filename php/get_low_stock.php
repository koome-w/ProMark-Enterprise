<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$conn = new mysqli("localhost", "root", "", "promark_enterprise");

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed."]));
}

$sql = "SELECT product_name, quantity, reorder_level FROM products WHERE quantity <= reorder_level";
$result = $conn->query($sql);

$alerts = [];
while ($row = $result->fetch_assoc()) {
    $alerts[] = $row;
}

echo json_encode(["status" => "success", "data" => $alerts]);
$conn->close();
?>
