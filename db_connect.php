<?php

// TODO: verify username and password (hash verification?)

// Establish connection to the database (TODO: deal with 'your_username' and 'your_password')
$serverName = "bughound_server";
$connectionOptions = array("Database" => "bughound_db", "Uid" => "your_username", "PWD" => "your_password");
$conn = sqlsrv_connect($serverName, $connectionOptions);

if ($conn === false) {
    die("Failed to connect to the database: " . sqlsrv_errors());
}

// Define the SQL query (note: case "read")
$sql = "SELECT * FROM bugs";

// TODO: look this over, change as needed in relation to access level and parameters (maybe create separate functions)
switch($function_being_used) {
    case "create_bug":
        $sql = "INSERT INTO bugs (bug_title, bug_description, reporter_id, bug_severity) VALUES (Some_bug_title, Some_bug_desc, A_reporter_id, Some_severity_lvl)";
        break;
    case "read_bugs": // this is the default sql string ^^
        break;
    case "update_resolution":
        $sql = "UPDATE resolutions SET resolution_status = resolve_state WHERE bug_id = Some_bug_id AND report_id = Some_report_id";
        break;
    case "delete_bug":
        $sql = "DELETE FROM bugs WHERE bug_id = Some_bug_id";
        break;
}

// Execute the query
$stmt = sqlsrv_query($conn, $sql);

// Check if the query was successful
if ($stmt === false) {
    die("Error executing the query: " . sqlsrv_errors());
}

// Fetch the results
while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
    
    // TODO: do different things based on which sql_call_string

    // Process each row of data
    echo "Column 1: " . $row['column1'] . ", Column 2: " . $row['column2'] . "<br>";
}

// Close the connection
sqlsrv_close($conn);

?>

<!-- insert sql functions/procedures here

-- insert a new bug report
-- INSERT INTO bugs (title, description, reported_by, severity) VALUES (Some_bug_title, Some_bug_desc, A_reporter_id, Some_severity_lvl);

-- fetch all bugs (TODO: a select for specific entries)
-- SELECT * FROM bugs;

-- update a bug report
-- UPDATE bugs SET status = 'Resolved' WHERE bug_id = Some_bug_id;

-- delete a bug report
-- DELETE FROM bugs WHERE bug_id = Some_bug_id;

-->