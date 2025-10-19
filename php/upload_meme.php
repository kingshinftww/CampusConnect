<?php
include "connect.php";

if (isset($_FILES['meme'])) {
    $file = $_FILES['meme'];
    $targetDir = "../uploads/";
    $filename = basename($file['name']);
    $targetFile = $targetDir . $filename;

    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    $allowed = ['jpg','jpeg','png','gif'];

    if (!in_array($ext, $allowed)) {
        echo json_encode(['error' => 'Invalid file type']);
        exit;
    }

    if (move_uploaded_file($file['tmp_name'], $targetFile)) {
        $stmt = $conn->prepare("INSERT INTO memes (filename) VALUES (?)");
        $stmt->bind_param("s", $filename);
        $stmt->execute();
        echo json_encode(['success' => true, 'filename' => $filename]);
    } else {
        echo json_encode(['error' => 'Upload failed']);
    }
}
?>
