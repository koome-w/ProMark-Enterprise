<?php
header("Content-Type: application/json");
include 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

// Validation
if (
    empty($data['product_id']) || 
    empty($data['product_name']) || 
    empty($data['category_id']) || 
    !isset($data['quantity'])
) {
    echo json_encode(["status" => "error", "message" => "Missing required fields."]);
    exit;
}

$product_id = $data['product_id'];
$product_name = $data['product_name'];
$category_id = $data['category_id'];
$quantity = $data['quantity'];
$reorder_level = $data['reorder_level'] ?? 5;
$price = $data['price'] ?? 0;
$supplier = $data['supplier'] ?? "";

// MySQL automatically updates last_updated because of ON UPDATE CURRENT_TIMESTAMP
$sql = "UPDATE products 
        SET product_name=?, category_id=?, quantity=?, reorder_level=?, price=?, supplier=? 
        WHERE product_id=?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("siidssi", $product_name, $category_id, $quantity, $reorder_level, $price, $supplier, $product_id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Product updated successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
