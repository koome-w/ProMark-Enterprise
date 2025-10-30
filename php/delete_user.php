<?php
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data['user_id'];

if (!$user_id) {
    echo json_encode(["status" => "error", "message" => "User ID missing."]);
    exit;
}

$query = "DELETE FROM users WHERE user_id = '$user_id'";
if (mysqli_query($conn, $query)) {
    echo json_encode(["status" => "success", "message" => "User deleted successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to delete user."]);
}
?>
