<?php
// Establish connection to the database (TODO: deal with 'your_username' and 'your_password')
$serverName = "bughound_server";
$connectionOptions = array("Database" => "bughound_db", "Uid" => "your_username", "PWD" => "your_password");
$conn = sqlsrv_connect($serverName, $connectionOptions);

if ($conn === false) {
    die("Failed to connect to the database: " . sqlsrv_errors());
}

// Define the SQL query (TODO: $sql = sql_call_string)
$sql = "SELECT * FROM bugs";

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