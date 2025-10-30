<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

$conn = new mysqli("localhost", "root", "", "promark_enterprise");
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed."]));
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case "GET":
        // Build base query
        $query = "SELECT s.sales_id, p.product_name, s.product_id, s.quantity_sold, p.price,
                         s.total_amount, s.sales_date, s.recorded_by
                  FROM sales s
                  JOIN products p ON s.product_id = p.product_id
                  WHERE 1=1";

        // Optional filters
        if (isset($_GET['product_id']) && $_GET['product_id'] !== '') {
            $product_id = intval($_GET['product_id']);
            $query .= " AND s.product_id = $product_id";
        }

        if (isset($_GET['from']) && $_GET['from'] !== '') {
            $from = $conn->real_escape_string($_GET['from']);
            $query .= " AND DATE(s.sales_date) >= '$from'";
        }

        if (isset($_GET['to']) && $_GET['to'] !== '') {
            $to = $conn->real_escape_string($_GET['to']);
            $query .= " AND DATE(s.sales_date) <= '$to'";
        }

        $query .= " ORDER BY s.sales_date DESC";

        $result = $conn->query($query);

        if (!$result) {
            echo json_encode(["error" => $conn->error]);
            exit;
        }

        $sales = [];
        while ($row = $result->fetch_assoc()) {
            $sales[] = $row;
        }

        echo json_encode($sales);
        break;

    case "POST":
        $data = json_decode(file_get_contents("php://input"), true);
        $productId = $data['productId'];
        $quantity = $data['quantity'];
        $totalAmount = $data['totalAmount'];
        $recordedBy = $data['recordedBy'];

        // Check product stock
        $checkStock = $conn->query("SELECT quantity FROM products WHERE product_id = $productId");
        $product = $checkStock->fetch_assoc();

        if (!$product) {
            echo json_encode(["error" => "Product not found."]);
            exit;
        }

        if ($product['quantity'] < $quantity) {
            echo json_encode(["error" => "Insufficient stock for this product."]);
            exit;
        }

        // Record sale
        $insertSale = $conn->prepare("INSERT INTO sales (product_id, quantity_sold, total_amount, recorded_by) VALUES (?, ?, ?, ?)");
        $insertSale->bind_param("iids", $productId, $quantity, $totalAmount, $recordedBy);

        if ($insertSale->execute()) {
            // Deduct stock
            $newStock = $product['quantity'] - $quantity;
            $conn->query("UPDATE products SET quantity = $newStock WHERE product_id = $productId");
            echo json_encode(["success" => true, "message" => "Sale recorded successfully."]);
        } else {
            echo json_encode(["error" => "Failed to record sale."]);
        }
        break;
}

$conn->close();
?>
