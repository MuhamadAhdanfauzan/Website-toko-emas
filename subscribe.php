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

// Handle form submission
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = $_POST['email'];

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'Email tidak valid.']);
        exit;
    }

    // Check if email already exists in the database
    $sql_check = "SELECT * FROM subscribers WHERE email = ?";
    $stmt_check = $conn->prepare($sql_check);
    $stmt_check->bind_param("s", $email);
    $stmt_check->execute();
    $stmt_check->store_result();

    if ($stmt_check->num_rows > 0) {
        // Email already exists
        echo json_encode(['status' => 'error', 'message' => 'Email ini sudah terdaftar.']);
    } else {
        // Insert email into database
        $sql = "INSERT INTO subscribers (email) VALUES (?)";
        $stmt = $conn->prepare($sql);

        if ($stmt) {
            $stmt->bind_param("s", $email);

            if ($stmt->execute()) {
                echo json_encode(['status' => 'success', 'message' => 'Terima kasih telah berlangganan!']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Terjadi kesalahan: ' . addslashes($stmt->error)]);
            }

            $stmt->close();
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Terjadi kesalahan saat memproses data.']);
        }
    }

    $stmt_check->close();
}

$conn->close();
?>
