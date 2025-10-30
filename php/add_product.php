<?php
header("Content-Type: application/json");
include 'db_connect.php';

// Read JSON input from fetch()
$data = json_decode(file_get_contents("php://input"), true);

// Validate data
if (!$data || empty($data['product_name']) || empty($data['category_id'])) {
    echo json_encode(["status" => "error", "message" => "Missing required fields."]);
    exit;
}

// Extract variables
$product_name   = trim($data['product_name']);
$category_id    = (int)$data['category_id'];
$quantity       = (int)$data['quantity'];
$reorder_level  = (int)$data['reorder_level'];
$price          = (float)$data['price'];
$supplier       = trim($data['supplier']);

// Prepare SQL
$sql = "INSERT INTO products 
        (product_name, category_id, quantity, reorder_level, price, supplier, date_added, last_updated)
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())";

$stmt = $conn->prepare($sql);
$stmt->bind_param("siiids", $product_name, $category_id, $quantity, $reorder_level, $price, $supplier);

// Execute query
if ($stmt->execute()) {
    $new_id = $stmt->insert_id;

    //Get category name to return back
    $catRes = $conn->query("SELECT category_name FROM categories WHERE category_id = $category_id");
    $catRow = $catRes->fetch_assoc();
    $category_name = $catRow ? $catRow['category_name'] : '';

    echo json_encode([
        "status" => "success",
        "message" => "Product added successfully.",
        "product" => [
            "product_id" => $new_id,
            "product_name" => $product_name,
            "category_id" => $category_id,
            "category_name" => $category_name,
            "quantity" => $quantity,
            "reorder_level" => $reorder_level,
            "price" => $price,
            "supplier" => $supplier
        ]
    ]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
