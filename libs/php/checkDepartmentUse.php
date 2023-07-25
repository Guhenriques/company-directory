<?php
  // checkDepartmentUse.php

  $executionStartTime = microtime(true);

  // this includes the login details
  include("config.php");

  header('Content-Type: application/json; charset=UTF-8');

  $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

  if (mysqli_connect_errno()) {
      $output['status']['code'] = "300";
      $output['status']['name'] = "failure";
      $output['status']['description'] = "database unavailable";
      $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
      $output['data'] = [];
      mysqli_close($conn);
      echo json_encode($output);
      exit;
  }

  if (!isset($_POST['id'])) {
      $output['status']['code'] = "400";
      $output['status']['name'] = "error";
      $output['status']['description'] = "Invalid request. Department ID not provided.";
      $output['data'] = [];
      mysqli_close($conn);
      echo json_encode($output);
      exit;
  }

  $departmentID = $_POST['id'];

  // Check if the department is associated with any employee
  // SQL statement accepts parameters and so is prepared to avoid SQL injection.
  $query = $conn->prepare('SELECT count(p.id) as departmentCount, d.name as departmentName FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) WHERE d.id = ?');
  $query->bind_param("i", $departmentID);
  $query->execute();
  $result = $query->get_result();

  if ($result) {
    $data = $result->fetch_assoc();
    $output['status']['code'] = "200";
    $output['status']['name'] = "success";
    $output['status']['description'] = "Department data retrieved";
    $output['data'] = $data;
} else {
    $output['status']['code'] = "500";
    $output['status']['name'] = "error";
    $output['status']['description'] = "Failed to retrieve department data";
    $output['data'] = [];
}
  mysqli_close($conn);
  echo json_encode($output);
?>
