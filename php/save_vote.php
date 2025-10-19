<?php
include "connect.php";

if (isset($_POST['poll_id'], $_POST['vote'])) {
    $poll_id = intval($_POST['poll_id']);
    $vote = $_POST['vote'];

    if ($vote === 'yes') {
        $sql = "UPDATE polls SET yes_votes = yes_votes + 1 WHERE id = $poll_id";
    } else {
        $sql = "UPDATE polls SET no_votes = no_votes + 1 WHERE id = $poll_id";
    }

    if ($conn->query($sql)) {
        // Fetch updated results
        $result = $conn->query("SELECT yes_votes, no_votes FROM polls WHERE id = $poll_id");
        $row = $result->fetch_assoc();
        echo json_encode($row);
    } else {
        echo json_encode(['error' => 'Failed to save vote']);
    }
} else {
    echo json_encode(['error' => 'Invalid request']);
}
?>
