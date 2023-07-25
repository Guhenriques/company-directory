<?php

    $executionStartTime = microtime(true);

    include("config.php");

    header('Content-Type: application/json; charset=UTF-8');

    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

    if (mysqli_connect_errno()) {
        $output['status']['code'] = "300";
        $output['status']['name'] = "failure";
        $output['status']['description'] = "Database connection failed";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];
        mysqli_close($conn);
        echo json_encode($output);
        exit;
    }

    // SQL statement accepts parameters and so is prepared to avoid SQL injection.
    $query = 'UPDATE personnel SET firstName = ?, lastName = ?, email = ?, jobTitle = ?, departmentID = ? WHERE id = ?';
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ssssii", $_POST['firstName'], $_POST['lastName'], $_POST['email'], $_POST['jobTitle'], $_POST['departmentID'], $_POST['id']);

    $result = $stmt->execute();

    if (!$result) {
        $output['status']['code'] = "400";
        $output['status']['name'] = "executed";
        $output['status']['description'] = "Query execution failed";
        $output['data'] = [];
        mysqli_close($conn);
        echo json_encode($output);
        exit;
    }

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "Success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    mysqli_close($conn);
    echo json_encode($output);

?>