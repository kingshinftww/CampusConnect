<?php
header('Content-Type: application/json');

$mysqli = new mysqli("localhost", "root", "", "campusconnect");
if ($mysqli->connect_errno) {
    echo json_encode([]);
    exit();
}

$result = $mysqli->query("SELECT filename FROM memes ORDER BY uploaded_at DESC");
$memes = [];
while ($row = $result->fetch_assoc()) {
    $memes[] = $row;
}

echo json_encode($memes);
$mysqli->close();
?>
