<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/getAllDepartments.php


	$executionStartTime = microtime(true);

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

	// SQL statement accepts parameters and so is prepared to avoid SQL injection.
	$query = 'SELECT d.id, d.name, d.locationID, l.name as location
			FROM department d
			LEFT JOIN location l ON (l.id = d.locationID)
			ORDER BY d.name, d.id, d.locationID, l.name';

	$stmt = $conn->prepare($query);

	if (!$stmt) {
			$output['status']['code'] = "400";
			$output['status']['name'] = "executed";
			$output['status']['description'] = "query preparation failed";
			$output['data'] = [];

			mysqli_close($conn);

			echo json_encode($output);

			exit;
	}

	$result = $stmt->execute();

	if (!$result) {
			$output['status']['code'] = "400";
			$output['status']['name'] = "executed";
			$output['status']['description'] = "query execution failed";
			$output['data'] = [];

			mysqli_close($conn);

			echo json_encode($output);

			exit;
	}

	$data = [];

	$result = $stmt->get_result();

	while ($row = $result->fetch_assoc()) {
			array_push($data, $row);
	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;

	$stmt->close();
	mysqli_close($conn);

	echo json_encode($output);

?>
