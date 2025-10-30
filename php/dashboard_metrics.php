<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$conn = new mysqli("localhost", "root", "", "promark_enterprise");

if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

// 1. Total stock from products table
$totalStockQuery = $conn->query("SELECT SUM(quantity) AS total_stock FROM products");
$totalStock = $totalStockQuery->fetch_assoc()["total_stock"] ?? 0;

// 2. Total low-stock alerts (where current stock <= reorder_level)
$lowStockQuery = $conn->query("SELECT COUNT(*) AS low_stock_count FROM products WHERE quantity <= reorder_level");
$lowStockCount = $lowStockQuery->fetch_assoc()["low_stock_count"] ?? 0;

echo json_encode([
    "totalStock" => (int)$totalStock,
    "lowStock" => (int)$lowStockCount
]);
?>
