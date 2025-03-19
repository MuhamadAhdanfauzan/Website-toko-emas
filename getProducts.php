<?php
// Database connection
$host = "localhost";
$user = "root";
$password = "";
$dbname = "projekweb";

$conn = new mysqli($host, $user, $password, $dbname);

// Check database connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get category filter from query string (if exists)
$filterCategory = isset($_GET['category']) ? $_GET['category'] : '';

// SQL query to fetch products
$sql = "SELECT id, name, weight, type, quantity, price, rating, image, category FROM products";
if ($filterCategory && $filterCategory !== "semua") {
    $sql .= " WHERE category = ?";
}

$stmt = $conn->prepare($sql);
if ($filterCategory && $filterCategory !== "semua") {
    $stmt->bind_param("s", $filterCategory);
}

$stmt->execute();
$result = $stmt->get_result();

$data = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

// Set header to JSON
header('Content-Type: application/json');
echo json_encode($data);

// Close connection
$conn->close();
?>
