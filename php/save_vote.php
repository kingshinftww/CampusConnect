<?php
header('Content-Type: application/json');

// Database connection
$mysqli = new mysqli("localhost", "root", "", "campusconnect");
if ($mysqli->connect_errno) {
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

// Get POST data
$poll_id = intval($_POST['poll_id'] ?? 0);
$vote = $_POST['vote'] ?? '';

if (!$poll_id || !in_array($vote, ['yes','no'])) {
    echo json_encode(["error" => "Invalid request"]);
    exit();
}

// Update vote
$col = $vote === 'yes' ? 'yes_votes' : 'no_votes';
$mysqli->query("UPDATE polls SET $col = $col + 1 WHERE id = $poll_id");

// Fetch updated counts
$result = $mysqli->query("SELECT yes_votes, no_votes FROM polls WHERE id = $poll_id");
$data = $result->fetch_assoc();
echo json_encode($data);

$mysqli->close();
?>
