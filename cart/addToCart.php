<?php
// Koneksi ke database
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "projekweb";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $productId = $data['id'];
    $productName = $data['name'];
    $productPrice = $data['price'];
    $productQuantity = $data['quantity'];

    // Periksa apakah produk sudah ada di keranjang
    $checkSql = "SELECT quantity FROM cart WHERE product_id = ?";
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bind_param("i", $productId);
    $checkStmt->execute();
    $checkStmt->store_result();

    if ($checkStmt->num_rows > 0) {
        // Jika produk sudah ada, tambahkan ke jumlahnya
        $checkStmt->bind_result($existingQuantity);
        $checkStmt->fetch();
        $newQuantity = $existingQuantity + $productQuantity;

        $updateSql = "UPDATE cart SET quantity = ? WHERE product_id = ?";
        $updateStmt = $conn->prepare($updateSql);
        $updateStmt->bind_param("ii", $newQuantity, $productId);

        if ($updateStmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "error" => $updateStmt->error]);
        }

        $updateStmt->close();
    } else {
        // Jika produk belum ada, masukkan sebagai produk baru
        $insertSql = "INSERT INTO cart (product_id, name, price, quantity) VALUES (?, ?, ?, ?)";
        $insertStmt = $conn->prepare($insertSql);
        $insertStmt->bind_param("isdi", $productId, $productName, $productPrice, $productQuantity);

        if ($insertStmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "error" => $insertStmt->error]);
        }

        $insertStmt->close();
    }

    $checkStmt->close();
}
$conn->close();
?>
