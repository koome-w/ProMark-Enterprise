<?php
session_start(); 

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true"); 

// Database connection
$host = "localhost";
$user = "root"; 
$password = ""; 
$dbname = "promark_enterprise";

$conn = new mysqli($host, $user, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed."]));
}

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

$email = $conn->real_escape_string($data['email']);
$passwordInput = $data['password'];
$role = $conn->real_escape_string($data['role']);

// Validate fields
if (empty($email) || empty($passwordInput) || empty($role)) {
    echo json_encode(["status" => "error", "message" => "All fields are required."]);
    exit;
}

// Check user
$query = "SELECT * FROM users WHERE email='$email' AND role='$role' AND status='active' LIMIT 1";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();

    // Verify password
    if (md5($passwordInput) === $user['password']) {

        // Store user session info
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['full_name'] = $user['full_name'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['created_at'] = $user['created_at'];

        // Record login activity
        $activity = "User logged in";
        $userId = $user['user_id'];

        $stmt = $conn->prepare("INSERT INTO activity_logs (user_id, activity) VALUES (?, ?)");
        $stmt->bind_param("is", $userId, $activity);
        $stmt->execute();

        echo json_encode([
            "status" => "success",
            "message" => "Login successful",
            "user" => [
                "id" => $user['user_id'],
                "fullname" => $user['full_name'],
                "email" => $user['email'],
                "role" => $user['role'],
                "created_at" => $user['created_at']
            ]
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid password."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "User not found or inactive."]);
}

$conn->close();
?>
