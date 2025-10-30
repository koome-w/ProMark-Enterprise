<?php
header("Content-Type: application/json");
include 'db_connect.php';

try {
    $query = "
        SELECT a.activity_id, a.user_id, u.full_name, u.email, u.role, a.activity, a.activity_date
        FROM activity_logs a
        JOIN users u ON a.user_id = u.user_id
        ORDER BY a.activity_date DESC
    ";

    $result = $conn->query($query);
    $logs = [];

    while ($row = $result->fetch_assoc()) {
        $logs[] = $row;
    }

    echo json_encode(["status" => "success", "data" => $logs]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
