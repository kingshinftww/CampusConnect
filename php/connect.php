<?php
$host = "localhost";
$user = "root";     
$pass = "Theo@23235";         
$db   = "campusconnect";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
