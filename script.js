// Get the button elements by ID
var createButton = document.getElementById("createButton");
var editButton = document.getElementById("editButton");
var backButton = document.getElementById("backButton");

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
if (backButton) {
    backButton.addEventListener("click", function() {
        window.location.href = "mainPage.html";
    });
}

// reset all values in createPage.html
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

// Add event listener to the searchButton (if needed)
var searchButton = document.getElementById("searchButton");
if (searchButton) {
    searchButton.addEventListener("click", function() {
        // Your search button functionality here

        // post and await reply

        // default / if reply turns up with nothing
        $('#searchResults').html("No results found");
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