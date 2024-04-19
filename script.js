

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
localStorage.setItem("userList", userList);

  
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


//LOCAL STORAGE FOR PROGRAM/AREA/EMPLOYEE

// var areaList = [
//   { program: "", area: "" },
  
// ];

// var programList = [
//   {program_name: "", program_version: "", program_release: ""},

// ];

// var employeeList = [
//   {user: "", login_id: "", level: ""},


// ];

//function to validate area
// function isProgramListEmpty(){
//   if(programList.length == 1){
//     return true;
//   }
//   return false;
// }

//add Area
// var addAreaButton = document.getElementById("addAreaButton");
// if (addAreaButton){
//   addAreaButton.addEventListener("click", function(){
//     if (isProgramListEmpty()){
//       alert("Please add a program first");
//     }
//     else{
//       var program = document.getElementById("program_name").value;
//       var area = document.getElementById("areaSummary").value;
//       areaList.push({program: program, area: area});
//       alert("Area added successfully");
//     }
//   });
// }

  //add Program
  // var addProgramButton = document.getElementById("addProgramButton");

  // if(addProgramButton){
  //   addProgramButton.addEventListener("click", function(){
  //     var program_name = document.getElementById("program_name").value;
  //     var program_version = document.getElementById("program_version").value;
  //     var program_release = document.getElementById("program_release").value;
  //     programList.push({program_name: program_name, program_version: program_version, program_release: program_release});
  //     updateAreaDropdown();
  //     alert("Program added successfully");
  //   });
  // }

  //add Employee
  // var addEmployeeButton = document.getElementById("addEmployeeButton");
  // if(addEmployeeButton){
  //   addEmployeeButton.addEventListener("click", function(){
  //     var user = document.getElementById("employee_user").value;
  //     var login_id = document.getElementById("login_id").value;
  //     var level = document.getElementById("employee_level").value;
  //     employeeList.push({user: user, login_id: login_id, level: level});
  //     alert("Employee added successfully");
  //   });
  // }

  //clear Button function 
  // var clearEmployeeButton = document.getElementById("clearEmployeeButton");
  // if(clearEmployeeButton){
  //   clearEmployeeButton.addEventListener("click", function(){
  //     document.getElementById("employee_user").value = "";
  //     document.getElementById("login_id").value = "";
  //     document.getElementById("employee_level").value = "";
  //   });
  // }

  // var clearProgramButton = document.getElementById("clearProgramButton");
  // if(clearProgramButton){
  //   clearProgramButton.addEventListener("click", function(){
  //     document.getElementById("program_name").value = "";
  //     document.getElementById("program_version").value = "";
  //     document.getElementById("program_release").value = "";
  //   });
  // }

  // var clearAreaButton = document.getElementById("clearAreaButton");
  // if(clearAreaButton){
  //   clearAreaButton.addEventListener("click", function(){
  //     document.getElementById("area").value = "";
  //     document.getElementById("areaSummary").value = "";
  //   });
  // }


//update area dropdown
// function updateAreaDropdown(){
//   var areaSelect = document.getElementById("area");

//   areaSelect.innerHTML = "";

//   var defaultOption = document.createElement("option");
//   defaultOption.value = "";
//   defaultOption.text = "Select Area";
//   areaSelect.appendChild(defaultOption);
//   if(areaSelect){
//     for (var i = 1; i < programList.length; i++){
//       var option = document.createElement("option");
//       option.value = programList[i].program_name; 
//       option.text = programList[i].program_name;
//       areaSelect.appendChild(option);
//     }
//   }
// }


// var areaSelect = document.getElementById("area");
// if(areaSelect){
//   for (var i = 1; i < programList.length; i++){
//     var option = document.createElement("option");
//     option.value = programList[i].program_name; 
//     option.text = programList[i].program_name;
//     areaSelect.appendChild(option);
//   }
// }
  