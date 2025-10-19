<?php
include "connect.php";

$result = $conn->query("SELECT * FROM memes ORDER BY uploaded_at DESC");
$memes = [];

while ($row = $result->fetch_assoc()) {
    $memes[] = $row;
}

echo json_encode($memes);
?>
