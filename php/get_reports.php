<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");

$conn = new mysqli("localhost", "root", "", "promark_enterprise");

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed."]));
}

// Get query parameters safely
$type = isset($_GET['type']) ? $_GET['type'] : 'all';
$range = isset($_GET['range']) ? $_GET['range'] : 'all';

// Helper function with error handling
function fetchData($conn, $sql) {
    $result = $conn->query($sql);

    if (!$result) {
        // Show SQL errors for debugging
        error_log("SQL Error: " . $conn->error . " | Query: " . $sql);
        return [];
    }

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    return $data;
}
// Date range filtering
function getDateCondition($range, $column = 'date') {
    switch ($range) {
        case 'today':
            return "DATE($column) = CURDATE()";
        case 'week':
            return "YEARWEEK($column, 1) = YEARWEEK(CURDATE(), 1)";
        case 'month':
            return "MONTH($column) = MONTH(CURDATE()) AND YEAR($column) = YEAR(CURDATE())";
        case 'year':
            return "YEAR($column) = YEAR(CURDATE())";
        default:
            return "1"; // no filter
    }
}


$response = [];

// -------------------- SALES REPORT --------------------
if ($type == 'sales' || $type == 'all') {
    $condition = getDateCondition($range, 's.sales_date');
    $sql = "
        SELECT 
            s.sales_id,
            s.sales_date,
            s.quantity_sold,
            s.total_amount,
            i.product_name,
            c.category_name,
            u.full_name AS recorded_by
        FROM sales s
        JOIN products i ON s.product_id = i.product_id
        JOIN categories c ON i.category_id = c.category_id
        LEFT JOIN users u ON s.user_id = u.user_id
        WHERE $condition
        ORDER BY s.sales_date DESC
    ";
    $response['sales'] = fetchData($conn, $sql);
}

// -------------------- INVENTORY REPORT --------------------
if ($type == 'inventory' || $type == 'all') {
    $sql = "
        SELECT 
            p.product_id,
            p.product_name,
            c.category_name,
            p.quantity,
            p.reorder_level,
            CASE 
                WHEN p.quantity <= p.reorder_level THEN 'Low Stock' 
                ELSE 'Sufficient' 
            END AS status
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        ORDER BY p.category_id ASC
    ";
    $response['inventory'] = fetchData($conn, $sql);
}

// -------------------- LOW STOCK REPORT --------------------
if ($type == 'lowstock' || $type == 'all') {
    $sql = "
        SELECT 
            r.alert_id,
            p.product_name,
            c.category_name,
            p.quantity,
            p.reorder_level
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        JOIN reorder_alerts r ON p.product_id = r.product_id
        WHERE p.quantity <= p.reorder_level
        ORDER BY p.quantity ASC
    ";
    $response['lowstock'] = fetchData($conn, $sql);
}

// -------------------- USERS REPORT --------------------
if ($type == 'users' || $type == 'all') {
    $sql = "
        SELECT 
            user_id,
            full_name,
            role,
            email,
            created_at
        FROM users
        ORDER BY created_at DESC
    ";
    $response['users'] = fetchData($conn, $sql);
}

// -------------------- REORDER LOGS REPORT --------------------
if ($type == 'restock_logs' || $type == 'all') {
    $sql = "
        SELECT 
            rl.id,
            rl.product_id,
            p.product_name,
            c.category_name,
            r.current_stock,
            rl.quantity_added,
            rl.date_restocked
        FROM restock_logs rl
        JOIN products p ON rl.product_id = p.product_id
        JOIN reorder_alerts r ON p.product_id = r.product_id
        LEFT JOIN categories c ON p.category_id = c.category_id
        ORDER BY rl.date_restocked DESC
    ";
    $response['restock_logs'] = fetchData($conn, $sql);
}

// -------------------- ACTIVITY LOGS REPORT --------------------
if ($type == 'activity_logs' || $type == 'all') {
    $sql = "
        SELECT 
            a.activity_id,
            u.full_name,
            a.activity,
            a.activity_date
        FROM activity_logs a
        LEFT JOIN users u ON a.user_id = u.user_id
        ORDER BY a.activity_date DESC
    ";
    $response['activity_logs'] = fetchData($conn, $sql);
}

echo json_encode($response, JSON_PRETTY_PRINT);
$conn->close();
?>
