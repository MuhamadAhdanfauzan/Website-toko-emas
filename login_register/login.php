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

// Login logic
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'Email tidak valid.']);
        exit;
    }

    // Check if email exists in the database
    $sql_check = "SELECT id, name, password FROM users WHERE email = ?";
    $stmt_check = $conn->prepare($sql_check);
    $stmt_check->bind_param("s", $email);
    $stmt_check->execute();
    $stmt_check->store_result();

    if ($stmt_check->num_rows === 1) {
        // Email exists, verify password
        $stmt_check->bind_result($id, $name, $hashed_password);
        $stmt_check->fetch();

        // Verify password
        if (password_verify($password, $hashed_password)) {
            // Send success response with user's name
            echo json_encode(['status' => 'success', 'message' => 'Login successful! Welcome, ' . $name]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid email or password.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid email or password.']);
    }

    $stmt_check->close();
}

$conn->close();
