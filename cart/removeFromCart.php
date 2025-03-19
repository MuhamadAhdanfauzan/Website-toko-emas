<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "projekweb";

// Membuat koneksi ke database
$conn = new mysqli($servername, $username, $password, $dbname);

// Memeriksa koneksi
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}

// Memeriksa apakah data `cart_id` diterima
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['cart_id'])) {
    $cartId = intval($_POST['cart_id']); // Pastikan data aman dengan casting ke integer
    
    // Query untuk menghapus data berdasarkan `id`
    $sql = "DELETE FROM cart WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $cartId);

    if ($stmt->execute()) {
        // Berhasil menghapus, kembali ke halaman keranjang
        header("Location: cart.php");
        exit();
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
} else {
    echo "Invalid request.";
}

// Menutup koneksi
$conn->close();
?>
    