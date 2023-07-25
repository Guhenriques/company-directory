<?php
  // updateLocation.php

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

  if (!isset($_POST['id']) || !isset($_POST['name'])) {
      $output['status']['code'] = "400";
      $output['status']['name'] = "error";
      $output['status']['description'] = "Invalid request. Location ID or Name not provided.";
      $output['data'] = [];
      mysqli_close($conn);
      echo json_encode($output);
      exit;
  }


	// SQL statement accepts parameters and so is prepared to avoid SQL injection.
  $query = $conn->prepare('UPDATE location SET name = ? WHERE id = ?');
  $query->bind_param("si", $_POST['name'], $_POST['id']);
  $query->execute();

  if ($query->affected_rows > 0) {
      $output['status']['code'] = "200";
      $output['status']['name'] = "success";
      $output['status']['description'] = "Location updated successfully";
      $output['data'] = [];
  } else {
      $output['status']['code'] = "500";
      $output['status']['name'] = "error";
      $output['status']['description'] = "Failed to update location";
      $output['data'] = [];
  }

  mysqli_close($conn);
  echo json_encode($output);


?>
