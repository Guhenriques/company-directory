<?php
// checkLocationUse.php

$executionStartTime = microtime(true);

// this includes the login details
include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    mysqli_close($conn);
    echo json_encode($output);
    exit;
}

if (!isset($_POST['id'])) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "error";
    $output['status']['description'] = "Invalid request. Location ID not provided.";
    $output['data'] = [];
    mysqli_close($conn);
    echo json_encode($output);
    exit;
}

$id = $_POST['id'];

// Check if the location is associated with any department
// SQL statement accepts parameters and so is prepared to avoid SQL injection.
$query = $conn->prepare('SELECT COUNT(*) as departmentCount FROM department WHERE locationID = ?');
$query->bind_param("i", $id);
$query->execute();
$result = $query->get_result();

if ($result) {
    $data = $result->fetch_assoc();
    $output['status']['code'] = "200";
    $output['status']['name'] = "success";
    $output['status']['description'] = "Location data retrieved";
    $output['data'] = $data;
} else {
    $output['status']['code'] = "500";
    $output['status']['name'] = "error";
    $output['status']['description'] = "Failed to retrieve location data";
    $output['data'] = [];
}

mysqli_close($conn);
echo json_encode($output);
?>
