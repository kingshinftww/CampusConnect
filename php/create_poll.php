<?php
header('Content-Type: application/json');

// Database configuration
$host = 'localhost';
$db   = 'campusconnect'; 
$user = 'root';        
$pass = 'Theo@23235';           
$charset = 'utf8mb4';

// Connect to MySQL
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    echo json_encode(['error' => 'Database connection failed: '.$e->getMessage()]);
    exit;
}

// Get POST data
$question = isset($_POST['question']) ? trim($_POST['question']) : '';
$option_yes = isset($_POST['option_yes']) ? trim($_POST['option_yes']) : '';
$option_no = isset($_POST['option_no']) ? trim($_POST['option_no']) : '';

// Validate input
if(empty($question) || empty($option_yes) || empty($option_no)){
    echo json_encode(['error' => 'All fields are required!']);
    exit;
}

try {
    // Insert poll into database
    $stmt = $pdo->prepare("INSERT INTO polls (question, option_yes, option_no, yes_votes, no_votes, created_at) 
                           VALUES (:question, :option_yes, :option_no, 0, 0, NOW())");
    $stmt->execute([
        ':question' => $question,
        ':option_yes' => $option_yes,
        ':option_no' => $option_no
    ]);

    echo json_encode(['success' => true]);

} catch (\PDOException $e) {
    echo json_encode(['error' => 'Failed to create poll: '.$e->getMessage()]);
}
?>
