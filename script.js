// Get the button elements by ID
var createButton = document.getElementById("createButton");
var editButton = document.getElementById("editButton");

// Check if createButton exists before adding event listener
if (createButton) {
    createButton.addEventListener("click", function() {
        window.location.href = "createPage.html";
    });
}

// Check if editButton exists before adding event listener
if (editButton) {
    editButton.addEventListener("click", function() {
        window.location.href = "editPage.html";
    });
}

// Add event listener to the backButton
var backButton = document.getElementById("backButton");
if (backButton) {
    backButton.addEventListener("click", function() {
        window.location.href = "mainPage.html";
    });
}

// Add event listener to the searchButton (if needed)
var searchButton = document.getElementById("searchButton");
if (searchButton) {
    searchButton.addEventListener("click", function() {
        // Your search button functionality here
    });
}
