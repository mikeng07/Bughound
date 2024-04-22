

// GENERAL
var createButton = document.getElementById("createButton");
var editButton = document.getElementById("editButton");
var backButton = document.getElementById("backButton");

if (createButton) {
    createButton.addEventListener("click", function() {
        window.location.href = "createPage.html";
    });
}

if (editButton) {
    editButton.addEventListener("click", function() {
        window.location.href = "editPage.html";
    });
}

if (backButton) {
    backButton.addEventListener("click", function() {
        window.location.href = "index.html";
    });
}

// CREATE_PAGE

var resetButton = document.getElementById("resetButton");
if (resetButton) {
    resetButton.addEventListener("click", function() {
        console.log('resetting...');
        $("#program").val("default");
        $("#reportType").val("default");
        $("#severity").val("default");
        document.getElementById("reproducible").checked = false;
        document.getElementById("problemSummary").value = "";
        document.getElementById("problem").value = "";
        document.getElementById("suggestedFix").value = "";
        $("#reportedBy").val("default");
        document.getElementById('dateInput').value = "";
        document.getElementByName('attachments').value = "";
        
        $("#functionalArea").val("default");
        $("#assignTo").val("default");
        document.getElementById("comments").value = "";
        $("#status").val("default");
        document.getElementById('priority').selected = "0";
        $("#resolution").val("default");
        $("#resolutionVersion").val("default");
        $("#resolvedBy").val("default");
        document.getElementById('dateResolved').value = "";
        $("#testedBy").val("default");
        document.getElementById('dateTested').value = "";
        document.getElementById("treatAsDeferred").checked = false;
    });
}

var submitButton = document.getElementById("submitButton");
if (submitButton) {
    submitButton.addEventListener("click", function() {
        // Your search button functionality here

        $('#spinning').toggle();

        // insert post and await reply from server

        // reply complete, stop spinning
        // $('#spinning').toggle();

        // insert reply results
    });
}

// EDIT_PAGE
var searchButton = document.getElementById("searchButton");
if (searchButton) {
    searchButton.addEventListener("click", function() {
        // Your search button functionality here

        // post and await reply

        // default / if reply turns up with nothing
        $('#searchResults').html("No results found");
    });

    document.addEventListener("keypress", function(e) {
      if (e.key === "Enter") {
          searchButton.click();
      }
  });
}


//USER_LOGIN & LOGOUT
/*
make an array to keep all user name and password in one variable
Define userList with valid usernames and passwords*/
var userList = [
  { username: "admin", password: "admin", accessLevel: 3 },
  { username: "user", password: "user", accessLevel: 1},
];
localStorage.setItem("userList", userList);

  
// Function to validate username and password
function validateCredentials(username, password) {

  console.log('Validating...');

  $.ajax({
    type: "POST",
    url: 'login.php',
    crossDomain: true,
    dataType: "json",
    data: {usr: username, pwd: password},
    success: function(response) {

      if (response["error"]) {
        console.error('An error occurred: ' + response['error']);
        return false; // Invalid credentials
      }

      console.log("validation successful!");
      
      // Set accessLevel in local storage   
      localStorage.setItem("accessLevel", response["result"]["accessLevel"]); 

      // TODO: are there others? pwd hash?

      return true; // valid credentials
    },
    error: function(response) {
      console.error("something else happened: " + response);
      return false;
    }
  });
}

// Event listener for login button
var loginButton = document.getElementById("loginButton")

if(loginButton) {
  loginButton.addEventListener("click", function() {
  
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    
    if (validateCredentials(username, password)) {
      // Set isLoggedIn flag in local storage
      localStorage.setItem("isLoggedIn", true); 
            
      // Redirect to index.html if credentials are valid
      window.location.href = "index.html"; 

    } else {
      // Show error message if credentials are invalid
      alert("Invalid username or password. Please try again."); 
    }
  });

  // tied to the document
  document.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      // console.log('enter key being pressed')
      loginButton.click();
    }
  });
}

// Event listener for forgot password button (placeholder)
var forgotPasswordButton = document.getElementById("forgotPasswordButton")
if(forgotPasswordButton) {
  forgotPasswordButton.addEventListener("click", function() {

    // Placeholder for forgot password functionality
    alert("Forgot Password functionality is not implemented yet."); 
  });
}

//Add event listener to logout button
var logoutButton =  document.getElementById("logoutButton")
if(logoutButton) {
  logoutButton.addEventListener("click", function() {
    //localStorage.clear();
    logout(); // Call logout function when logout button is clicked
  });
}

// Function to log out user
function logout() {
  localStorage.removeItem("isLoggedIn"); // Remove isLoggedIn flag from local storage
  localStorage.removeItem("accessLevel");
  window.location.href = "Login.html"; // Redirect to login page
}
  

//CHECK ACCESS LEVEL
var accessLevel = localStorage.getItem("accessLevel");

if(accessLevel ==1){
  document.getElementById("maintenanceButton").style.display = "none";
}


//Function to parse userList from local storage
function parseUserList() {
  // Retrieve the userList from local storage
  var storedUserList = localStorage.getItem('userList');
  
  // Parse the stored userList string into a JavaScript object
  var userList = JSON.parse(storedUserList);

  // Return the parsed userList
  return userList;
}

// // Other common script functions...

// // Call the parseUserList function when needed in your login page
var userList = parseUserList(); 
console.log(userList); // Check if the userList is correctly parsed
// console.log(employeeList)
