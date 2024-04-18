// MAINTENANCE_PAGE
var newProgramButton = document.getElementById("newProgramButton");
var removeProgramButton = document.getElementById("removeProgramButton");
var clearProgramButton = document.getElementById("clearProgramButton");

var programEntityCount = 0;

if (newProgramButton) {
    newProgramButton.addEventListener("click", function() {
        temp =  '<div id="program_entity">'+
                    '<input id="program_name" name="program_name" size="10" placeholder="program name"> '+
                    '<input id="program_release" name="program_release" size="6" placeholder="release"> '+
                    '<input id="release_version" name="release_version" size="3" placeholder="version"><br><br>'+
                '</div>';
        $("div#list_values").append(temp);

        programEntityCount += 1;
        // console.log('program entity count:', programEntityCount);

        if (programEntityCount > 0) {
            removeProgramButton.hidden = false;
        }
    });
}

if (removeProgramButton) {
    removeProgramButton.addEventListener("click", function() {
        $("div#list_values").children('div[id=program_entity]:last').remove();

        programEntityCount -= 1;
        // console.log('program entity count:', programEntityCount);

        if (programEntityCount == 0) removeProgramButton.hidden = true;
    });
}

if (clearProgramButton) {
    clearProgramButton.addEventListener("click", function() {

        $('div[id=program_entity]').remove();
        $('#program_name').val("");
        $('#program_release').val("");
        $('#release_version').val("");
        removeProgramButton.hidden = true;
    });
}

// MAINTENANCE LOOKUP

var lookupButton = document.getElementById("lookupButton");
if (lookupButton) {
    lookupButton.addEventListener("click", function() {

        // query and post results
        // $('#searchResults').html("No results found");
    });
}