
var programList = [];

// Function to add an employee to the employeeList array
function addProgramToList(program) {
    programList.push(program);
}



//function to validate area
function isProgramListEmpty(){
    if(programList.length == 0){
      return true;
    }
    return false;
  }
  
  
var backButton = document.getElementById("backButton");
if (backButton) {
    backButton.addEventListener("click", function() {
        window.location.href = "../maintenancePage.html";
    });
}

// ADD PROGRAMS
var newProgramButton = document.getElementById("newProgramButton");
var removeProgramButton = document.getElementById("removeProgramButton");
var clearProgramButton = document.getElementById("clearProgramButton");
var submitProgramButton = document.getElementById("submitProgramButton");

var programEntityCount = 0;

// Event listener for adding a new program
var newProgramButton = document.getElementById("newProgramButton");
if (newProgramButton) {
    newProgramButton.addEventListener("click", function() {
        // Generate unique IDs for the new program entity
        var entityId = "program_entity_" + programEntityCount;
        var nameId = "program_name_" + programEntityCount;
        var releaseId = "program_release_" + programEntityCount;
        var versionId = "release_version_" + programEntityCount;

        // Construct the HTML for the new program entity
        var temp =  '<div id="' + entityId + '" class="program_entity">'+
                        '<input id="' + nameId + '" name="program_name" size="12" placeholder="program name"> '+
                        '<input id="' + releaseId + '" name="program_release" size="6" placeholder="release"> '+
                        '<input id="' + versionId + '" name="release_version" size="6" placeholder="version">'+
                        '<br><br>'+
                    '</div>';

        // Append the new program entity to the container
        document.getElementById("program_list_values").insertAdjacentHTML('beforeend', temp);

        // Increment the counter
        programEntityCount++;

        // Show the remove program button
        removeProgramButton.hidden = false;
    });
}


if (removeProgramButton) {
    removeProgramButton.addEventListener("click", function() {
        // Remove the last program entity
        var programEntities = document.querySelectorAll(".program_entity");
        if (programEntities.length > 0) {
            programEntities[programEntities.length - 1].remove();
            programEntityCount--;

            // Hide the removeProgramButton if there are no more program entities
            if (programEntityCount === 0) {
                removeProgramButton.hidden = true;
            }
        }
    });
}
if (clearProgramButton) {
    clearProgramButton.addEventListener("click", function() {
        // Remove all program entities
        var programListValues = document.getElementById("program_list_values");
        programListValues.innerHTML = ""; // Remove all HTML inside the container
        programEntityCount = 0;
        removeProgramButton.hidden = true; // Hide the removeProgramButton
    });
}
if (submitProgramButton) {
    submitProgramButton.addEventListener("click", function() {
        // e.preventDefault();
        // $.ajax({
        //     type: "POST",
        //     url:  "db_connect.php",
        //     data: {
        //         f: "add_programs",
        //         q: "",
        //     },
        //     success: function(obj) {
        //         console.log(obj);
        //     },
        //     dataType: "json",
        // });

       // Select all program entities
       var programEntities = document.querySelectorAll(".program_entity");

       // Flag to track if any program is submitted without a name
       var hasEmptyName = false;

       // Iterate over each program entity
       programEntities.forEach(function(entity) {
           // Retrieve data for each program
           var programName = entity.querySelector("input[name='program_name']").value;
           var programRelease = entity.querySelector("input[name='program_release']").value;
           var releaseVersion = entity.querySelector("input[name='release_version']").value;

           // Check if program name is empty
           if (programName.trim() === "") {
               hasEmptyName = true;
               return; // Exit the loop early
           }

           // Add the program to the list
           addProgramToList({ program_name: programName, program_release: programRelease, release_version: releaseVersion });
           localStorage.setItem('programList', JSON.stringify(programList));
       });

       // Check if any program was submitted without a name
       if (hasEmptyName) {
           alert("Please provide a program name for all programs.");
           return; // Exit the function early
       }

       // Display the updated programList (optional)
       console.log(programList);
    });
}

// EDIT PROGRAM INFO

var clearProgramChangeButton = document.getElementById("clearProgramChangeButton");
var submitProgramChangeButton = document.getElementById("submitProgramChangeButton");

if (clearProgramChangeButton) {
    clearProgramChangeButton.addEventListener("click", function() {
        $('#program_entity_before #program_name').val("");
        $('#program_entity_before #program_release').val("");
        $('#program_entity_before #release_version').val("");
        $('#program_entity_after #program_name').val("");
        $('#program_entity_after #program_release').val("");
        $('#program_entity_after #release_version').val("");
        $('#program_change_res').html("");
    });
}

if (submitProgramChangeButton) {
    submitProgramChangeButton.addEventListener("click", function() {

        let name_before    = $('#program_entity_before #program_name').val();
        let release_before = $('#program_entity_before #program_release').val();
        let version_before = $('#program_entity_before #release_version').val();
        let name_after     = $('#program_entity_after #program_name').val();
        let release_after  = $('#program_entity_after #program_release').val();
        let version_after  = $('#program_entity_after #release_version').val();
        

        var res = "";
        let incompleteFlag = false;

        if (name_before === '' && release_before === "" && version_before === "") {
            res = res + "<span>warning -- no program specified. what are you changing from?<span><br>";
            incompleteFlag = true;
        }
        if (name_after === '' && release_after === "" && version_after === "") {
            res = res + "<span>warning -- no program specified. what are you changing to?<span><br>";
            incompleteFlag = true;
        }
        console.log(res);
        $('#program_change_res').html(res);
        
        if (incompleteFlag) {
            console.log("not completely filled out."); 
            return;

        } else {
    
            // POST new change

            // put out the results, regardless of success or failure

            // result = "<span>"+ "" +"</span>";    // place results here
            // $('#program_change_res').append(result);

        }
    });
}