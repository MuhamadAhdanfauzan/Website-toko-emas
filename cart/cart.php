<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "projekweb";

// Membuat koneksi ke database
$conn = new mysqli($servername, $username, $password, $dbname);

// Memeriksa koneksi
if ($conn->connect_error) {
    die(json_encode(["error" => "Koneksi gagal: " . $conn->connect_error]));
}

// Query untuk mengambil data keranjang
$sql = "SELECT * FROM cart";
$result = $conn->query($sql);

$cartItems = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $cartItems[] = $row;
    }
}

// Mengembalikan data dalam format JSON
header('Content-Type: application/json');
echo json_encode($cartItems);

$conn->close();
?>
