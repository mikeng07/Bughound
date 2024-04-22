<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

// create result array
$interactRes = array();

// add error messages if relevant
if (!isset($_POST['usr'])) $interactRes['error'] = "no username inputted";
if (!isset($_POST['pwd'])) $interactRes['error'] = "no password inputted";

// if no errors thus far, attempt to log in
if (!isset($_POST['error'])) {

    // attempt connection
    define('server_name', getenv('SERVER'));
    define('server_user', getenv('USER'));
    define('server_pass', getenv('PASS'));
    define('server_db',   getenv('DB_NAME'));
    // define('server_port', getenv('PORT'));
    
    console_log("attempting connection to server: " . server_name);
    
    $conn = mysqli_connect(
        server_name
        , server_user
        , server_pass
        , server_db
        //, server_port
    );
    
    if (mysqli_connect_errno()) {
        die("Connection failed: " . mysqli_connect_error());

    } else {

        echo "connected successfully";
        
        // try logging in
        console_log("attempting submission...");
        
        console_log('username: ' . $_POST['usr']);
        
        // verify username and password (hash verification?)
        $usr  = mysqli_real_escape_string($conn, $_POST['usr']);
        $pass = hash('sha256', $_POST['pwd']);
        
        // Define the SQL query
        $query = "SELECT * FROM Users where 'user_name'=" . $usr;
        
        // Execute the query
        $users = mysqli_query($conn, $query);
        
        // Check if the query was UN-successful
        
        // no user found
        if (!$users) {
            $interactRes['error'] = 'No such user';
        }
        else {
            // check users, set the correct user
            $correct_user = "";
            while ($user = mysqli_fetch_array($users)) {
                if ($pass === $user['user_pass']) $correct_user = $user;
            }
            // incorrect password if there is no one that matches
            if (!$correct_user) {
                $interactRes['error'] = 'Your password was incorrect, try again';
            }
            else {
                // correct user set, set cookies
                // setcookie("empid",      $correct_user[0],time()+(60*60*24));
                // setcookie("usern",      $correct_user[1],time()+(60*60*24));
                // setcookie("userrn",     $correct_user[3],time()+(60*60*24));
                // setcookie("accessLevel",$correct_user[4],time()+(60*60*24));
                // setcookie("isLoggedIn", "true",          time()+(60*60*24));
                
                // jump
                // header("Location: index.html");
                
                // add correct user info to result
                $interactRes['result'] = json_encode($correct_user);
            }
        }
    }
}

// echo end-result
echo json_encode($interactRes);

// Close the connection
mysqli_close($conn);

?>