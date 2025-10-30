<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$conn = new mysqli("localhost", "root", "", "promark_enterprise");

if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

// ---- PIE CHART: STOCK BY CATEGORY ----
$categoryStock = [];
$stockQuery = "
    SELECT c.category_name, SUM(p.quantity) AS total_stock
    FROM products p
    JOIN categories c ON p.category_id = c.category_id
    GROUP BY c.category_name
";
$result = $conn->query($stockQuery);
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $categoryStock[] = [
            "category" => $row["category_name"],
            "stock" => (int)$row["total_stock"]
        ];
    }
}

// ---- BAR CHART: TOTAL SALES ----
$salesData = [];
$salesQuery = "
    SELECT DATE_FORMAT(s.sales_date, '%Y-%m-%d') AS date, SUM(s.total_amount) AS total_sales
    FROM sales s
    GROUP BY DATE_FORMAT(s.sales_date, '%Y-%m-%d')
    ORDER BY date ASC
";
$result = $conn->query($salesQuery);
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $salesData[] = [
            "date" => $row["date"],
            "sales" => (float)$row["total_sales"]
        ];
    }
}

echo json_encode([
    "stockByCategory" => $categoryStock,
    "salesData" => $salesData
]);

$conn->close();
?>
