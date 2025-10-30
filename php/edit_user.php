<?php
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data['user_id'];
$full_name = $data['full_name'];
$email = $data['email'];
$role = $data['role'];

if (empty($user_id) || empty($full_name) || empty($email) || empty($role)) {
    echo json_encode(["status" => "error", "message" => "All fields are required."]);
    exit;
}

$query = "UPDATE users SET full_name='$full_name', email='$email', role='$role' WHERE user_id='$user_id'";
if (mysqli_query($conn, $query)) {
    echo json_encode(["status" => "success", "message" => "User updated successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to update user."]);
}
?>
