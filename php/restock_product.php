<?php
header("Content-Type: application/json");
$conn = new mysqli("localhost", "root", "", "promark_enterprise");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed."]);
    exit;
}

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data || !isset($data["product_id"]) || !isset($data["restock_qty"])) {
    echo json_encode(["success" => false, "message" => "Invalid or missing input data.", "received" => $data, "raw" => $raw]);
    exit;
}

$product_id = intval($data["product_id"]);
$restock_qty = intval($data["restock_qty"]);


//Fetch product’s current stock from products table
$getProduct = $conn->prepare("SELECT quantity, product_name FROM products WHERE product_id = ?");
$getProduct->bind_param("i", $product_id);
$getProduct->execute();
$productResult = $getProduct->get_result();

if ($productResult->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Product not found in inventory."]);
    exit;
}

$product = $productResult->fetch_assoc();
$new_stock = $product["quantity"] + $restock_qty;

//Update products with new stock
$updateInventory = $conn->prepare("UPDATE products SET quantity = ? WHERE product_id = ?");
$updateInventory->bind_param("ii", $new_stock, $product_id);
$updateInventory->execute();

//Update reorder_alerts table (mark as resolved)
$updateAlert = $conn->prepare("
    UPDATE reorder_alerts 
    SET current_stock = ?, alert_status = 'Resolved', date_triggered = NOW() 
    WHERE product_id = ?
");
$updateAlert->bind_param("ii", $new_stock, $product_id);
$updateAlert->execute();

//log the restock in a new table (e.g., restock_logs)
$logRestock = $conn->prepare("
    INSERT INTO restock_logs (product_id, quantity_added, date_restocked) 
    VALUES (?, ?, NOW())
");
$logRestock->bind_param("ii", $product_id, $restock_qty);
$logRestock->execute();

echo json_encode([
    "success" => true,
    "message" => "{$product['product_name']} restocked successfully.",
    "new_stock" => $new_stock
]);
?>
