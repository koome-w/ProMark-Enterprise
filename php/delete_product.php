<?php
header("Content-Type: application/json");
include 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['product_id']) || empty($data['product_id'])) {
    echo json_encode(["status" => "error", "message" => "Missing product ID."]);
    exit;
}

$product_id = intval($data['product_id']);

$sql = "DELETE FROM products WHERE product_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $product_id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Product deleted successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
