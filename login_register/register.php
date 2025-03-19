<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "projekweb";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Registration logic
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'Email tidak valid.']);
        exit;
    }

    // Check if email already exists in the database
    $sql_check = "SELECT * FROM users WHERE email = ?";
    $stmt_check = $conn->prepare($sql_check);
    $stmt_check->bind_param("s", $email);
    $stmt_check->execute();
    $stmt_check->store_result();

    if ($stmt_check->num_rows > 0) {
        // Email already exists
        echo json_encode(['status' => 'error', 'message' => 'Email ini sudah terdaftar.']);
    } else {
        // Hash the password for security
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // Insert data into the database
        $sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sss", $name, $email, $hashed_password);

        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Pendaftaran berhasil! ']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Terjadi kesalahan: ' . addslashes($stmt->error)]);
        }

        $stmt->close();
    }

    $stmt_check->close();
}

$conn->close();
?>
