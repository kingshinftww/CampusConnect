<?php
header('Content-Type: application/json');

$mysqli = new mysqli("localhost", "root", "", "campusconnect");
if ($mysqli->connect_errno) {
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

if (!isset($_FILES['meme'])) {
    echo json_encode(["error" => "No file uploaded"]);
    exit();
}

$file = $_FILES['meme'];
$filename = time() . "_" . basename($file['name']);
$target_dir = "../uploads/";
$target_file = $target_dir . $filename;

// Basic file validation
$allowed = ['jpg','jpeg','png','gif'];
$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
if (!in_array($ext, $allowed)) {
    echo json_encode(["error" => "Invalid file type"]);
    exit();
}

// Move uploaded file
if (move_uploaded_file($file['tmp_name'], $target_file)) {
    // Insert into database
    $stmt = $mysqli->prepare("INSERT INTO memes (filename) VALUES (?)");
    $stmt->bind_param("s", $filename);
    $stmt->execute();
    $stmt->close();

    echo json_encode(["success" => true, "filename" => $filename]);
} else {
    echo json_encode(["error" => "Failed to upload meme"]);
}

$mysqli->close();
?>
