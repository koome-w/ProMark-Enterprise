<?php
header("Content-Type: application/json");
include 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

$product_id = $data['product_id'];
$adjustment_type = $data['adjustment_type'];
$adjustment_quantity = $data['adjustment_quantity'];

if ($adjustment_type == 'add') {
    $sql = "UPDATE products SET quantity = quantity + ?, last_updated=NOW() WHERE product_id=?";
} elseif ($adjustment_type == 'remove') {
    $sql = "UPDATE products SET quantity = GREATEST(quantity - ?, 0), last_updated=NOW() WHERE product_id=?";
} elseif ($adjustment_type == 'set') {
    $sql = "UPDATE products SET quantity = ?, last_updated=NOW() WHERE product_id=?";
} else {
    echo json_encode(["status" => "error", "message" => "Invalid adjustment type."]);
    exit;
}

$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $adjustment_quantity, $product_id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Stock adjusted successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
