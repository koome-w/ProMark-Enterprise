<?php
header("Content-Type: application/json");
$conn = new mysqli("localhost", "root", "", "promark_enterprise");

if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

/*
Fetch products where quantity <= reorder_level.
If alert already exists, show it; else create it automatically.
*/

$sql = "
SELECT 
    p.product_id,
    p.product_name,
    p.quantity AS current_stock,
    p.reorder_level,
    p.supplier,
    a.alert_status,
    a.date_triggered
FROM products p
LEFT JOIN reorder_alerts a ON p.product_id = a.product_id
WHERE p.quantity <= p.reorder_level;
";

$result = $conn->query($sql);
$alerts = [];

while ($row = $result->fetch_assoc()) {
    $priority = ($row['current_stock'] == 0) ? "Critical" : "Low";
    $row['priority'] = $priority;
    $alerts[] = $row;

    // Auto-create alert record if missing
    if ($row['alert_status'] == null) {
        $insert = $conn->prepare("
            INSERT INTO reorder_alerts (product_id, current_stock, reorder_level, alert_status)
            VALUES (?, ?, ?, 'Pending')
        ");
        $insert->bind_param("iii", $row['product_id'], $row['current_stock'], $row['reorder_level']);
        $insert->execute();
    }
}

echo json_encode($alerts);
$conn->close();
?>
