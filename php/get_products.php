<?php
header("Content-Type: application/json");
include 'db_connect.php';

$category_id = isset($_GET['category_id']) ? $_GET['category_id'] : '';

if ($category_id !== '') {
    $sql = "SELECT p.*, c.category_name 
            FROM products p
            JOIN categories c ON p.category_id = c.category_id
            WHERE p.category_id = '$category_id'
            ORDER BY p.product_id DESC";
} else {
    $sql = "SELECT p.*, c.category_name 
            FROM products p
            JOIN categories c ON p.category_id = c.category_id
            ORDER BY p.product_id DESC";
}

$result = mysqli_query($conn, $sql);
$products = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $products[] = $row;
    }
}

echo json_encode($products);
$conn->close();
?>
