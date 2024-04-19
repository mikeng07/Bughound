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
}


//USER_LOGIN & LOGOUT
/*
make an array to keep all user name and password in one variable
Define userList with valid usernames and passwords*/
var userList = [
  { username: "admin", password: "admin", accessLevel: 3 },
  { username: "user", password: "user", accessLevel: 1},
];

  
// Function to validate username and password
function validateCredentials(username, password) {
  for (var i = 0; i < userList.length; i++) {
    if (userList[i].username === username && userList[i].password === password) {
      return true; // Valid credentials
    }
  }
  return false; // Invalid credentials
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
      
      // Set accessLevel in local storage   
      localStorage.setItem("accessLevel", userList.find(x => x.username === username).accessLevel); 
      
      // Redirect to index.html if credentials are valid
      window.location.href = "index.html"; 

    } else {
      // Show error message if credentials are invalid
      alert("Invalid username or password. Please try again."); 
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

    logout(); // Call logout function when logout button is clicked
  });
}

// Function to log out user
function logout() {

  // Remove flags from local storage
  localStorage.removeItem("isLoggedIn"); 
  localStorage.removeItem("accessLevel");

  window.location.href = "Login.html"; // Redirect to login page
}