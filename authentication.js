//A FLAG TO CHECK IF USER IS LOGGED IN
var isLoggedIn = localStorage.getItem("isLoggedIn");

// If user is not logged in, redirect to login page
if (!isLoggedIn) {
    alert("You are not logged in. Redirecting to login page...");
  window.location.href = "Login.html";
}

// TODO: add accessLevel to localStorage

//CHECK ACCESS LEVEL
var accessLevel = localStorage.getItem("accessLevel");

// If user has high enough access level, show the maintenance button
if (accessLevel > 1) {
  var maintButton = '<br><br><button id="maintenanceButton"> DB Maintenance </button>';

  $('#buttonMenu').append(maintButton);

  document.getElementById("maintenanceButton").addEventListener("click", function() {
    window.location.href = "maintenancePage.html";
  });

}