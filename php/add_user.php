<?php
header("Content-Type: application/json");
include 'db_connect.php';
include 'auth_check.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['full_name']) || empty($data['email']) || empty($data['role'])) {
    echo json_encode(["status" => "error", "message" => "Missing user details."]);
    exit;
}

$name = $data['full_name'];
$email = $data['email'];
$role = $data['role'];
$password = md5("123456"); // default password for new users

try {
    $stmt = $conn->prepare("INSERT INTO users (full_name, email, role, password) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $name, $email, $role, $password);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "User added successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to add user"]);
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
