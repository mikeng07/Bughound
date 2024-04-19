
var areaList = [
    { },
    
  ];

  var programList = JSON.parse(localStorage.getItem('programList')) || [];

  updateAreaDropdown()



var backButton = document.getElementById("backButton");
if (backButton) {
    backButton.addEventListener("click", function() {
        window.location.href = "../maintenancePage.html";
    });
}

// ADD AREAS

var programRefreshButton = document.getElementById("program_list_refresh");

if (programRefreshButton) {
    programRefreshButton.addEventListener("click", function() {
        console.log("refreshing...");
        $('#program_list #program_entity').remove();

        // GET from database, repopulate with it

        // e.preventDefault();
        // $.ajax({
        //     type: "GET",
        //     url:  "../db_connect.php",
        //     data: { 
        //         f: "get_programs",
        //         q: "",
        //     },
        //     success: function(obj) {
        //         console.log(obj);
        //         entries = "";
        //         entries.append("<option id='program_entity'>"+val+"</option>");
        //         $('#program_list').append(entries);
        //     },
        //     dataType: "json",
        // });
    });
}

var newAreaButton = document.getElementById("newAreaButton");
var removeAreaButton = document.getElementById("removeAreaButton");
var clearAreaButton = document.getElementById("clearAreaButton");
var submitAreaButton = document.getElementById("submitAreaButton");

var areaEntityCount = 0;

if (newAreaButton) {
    newAreaButton.addEventListener("click", function() {
        // Generate unique IDs for the new area entity
        var entityId = "area_entity_" + areaEntityCount;
        var inputId = "area_title_" + areaEntityCount;

        // Construct the HTML for the new area entity
        var temp =  '<div id="' + entityId + '" class="area_entity">'+
                        '<input id="' + inputId + '" name="area_title" size="30" placeholder="functional area">'+
                        '<br><br>'+
                    '</div>';

        // Append the new area entity to the container
        document.getElementById("area_list_values").insertAdjacentHTML('beforeend', temp);

        // Increment the counter
        areaEntityCount++;

        // Show the remove area button
        removeAreaButton.hidden = false;
    });
}


// Remove button
if (removeAreaButton) {
    removeAreaButton.addEventListener("click", function() {
        // Remove the last area entity
        var areaEntities = document.querySelectorAll("#area_list_values .area_entity");
        if (areaEntities.length > 0) {
            areaEntities[areaEntities.length - 1].remove();
            areaEntityCount -= 1;
            // Hide the remove button if there are no more area entities
            if (areaEntityCount === 0) {
                removeAreaButton.hidden = true;
            }
        }
    });
}
// Clear button
if (clearAreaButton) {
    clearAreaButton.addEventListener("click", function() {
        // Remove all area entities
        document.querySelectorAll("#area_list_values .area_entity").forEach(function(entity) {
            entity.remove();
        });
        // Clear the area title input
        document.getElementById("area_title").value = "";
        // Hide the remove button
        removeAreaButton.hidden = true;
    });
}
if (submitAreaButton) {
    // submitAreaButton.addEventListener("click", function(e) {
    //     e.preventDefault();
    //     $.ajax({
    //         type: "POST",
    //         url:  "db_connect.php",
    //         data: {
    //             f: "add_programs",
    //             q: "",
    //         },
    //         success: function(obj) {
    //             console.log(obj);
    //         },
    //         dataType: "json",
    //     });
    // });
    submitAreaButton.addEventListener("click", function(){
        if (isProgramListEmpty()){
          alert("Please add a program first");
        }
        else{

            var programDropdown = document.getElementById("program_list");

            // Retrieve the selected program name

            var selectedProgram = programDropdown.value;
            // Select all area entities
            var areaEntities = document.querySelectorAll("#area_list_values .area_entity");
    
            // Initialize an array to store the area titles
            var functionalAreas = [];
    
            // Iterate over each area entity
            areaEntities.forEach(function(entity) {
                // Retrieve the area title for each entity
                var areaTitle = entity.querySelector("input[name='area_title']").value;
    
                // Add the area title to the functionalAreas array
                functionalAreas.push(areaTitle);
            });
            
            // Combine the selected program with the functional areas
        var areaEntry = {
            program: selectedProgram,
            functionalAreas: functionalAreas
        };

        // Add the combined entry to the areaList array
        areaList.push(areaEntry);

        // Log the updated areaList array (optional)
        console.log("Updated areaList:", areaList); 
        }
      });
}

// EDIT AREAS

var programRefreshCButton = document.getElementById("program_list_refresh_c");

if (programRefreshCButton) {
    programRefreshCButton.addEventListener("click", function() {
        console.log("refreshing(c)...");
        $('#program_list_c #program_entity').remove();

        // GET from database, repopulate with it

        // e.preventDefault();
        // $.ajax({
        //     type: "GET",
        //     url:  "../db_connect.php",
        //     data: {
        //         f: "get_programs",
        //         q: "",
        //     },
        //     success: function(obj) {
        //         console.log(obj);
        //         entries = "";
        //         entries.append("<option id='program_entity'>"+val+"</option>");
        //         $('#program_list_c').append(entries);
        //     },
        //     dataType: "json",
        // });
    });
}

var clearAreaChangeButton = document.getElementById("clearAreaChangeButton");
var submitAreaChangeButton = document.getElementById("submitAreaChangeButton");

if (clearAreaChangeButton) {
    clearAreaChangeButton.addEventListener("click", function() {
        $('#area_entity_before #area_title').val("");
        $('#area_entity_after #area_title').val("");
        $('#area_change_res').html("");
    });
}

if (submitAreaChangeButton) {
    submitAreaChangeButton.addEventListener("click", function() {

        let program_name = $('#program_list_c').val();
        let area_title_before = $('#area_entity_before #area_title').val();
        let area_title_after = $('#area_entity_after #area_title').val();

        var res = "";
        let incompleteFlag = false;

        if (program_name === 'default') {
            res = res + "<span>warning -- no program specified. where's the area from?<span><br>";
            incompleteFlag = true;
        }
        if (area_title_before === '') {
            res = res + "<span>warning -- no area specified to change from<span><br>";
            incompleteFlag = true;
        } 
        if (area_title_after === '') {
            res = res + "<span>warning -- no area specified to change to<span><br>";
            incompleteFlag = true;
        }
        console.log(res);
        $('#area_change_res').html(res);
        
        if (incompleteFlag) {
            console.log("not completely filled out."); 
            return;

        } else {
    
            // POST new change

            // put out the results, regardless of success or failure

            // result = "<span>"+ "" +"</span>";    // place results here
            // $('#area_change_res').append(result);

        }

    });
}

//update area dropdown
function updateAreaDropdown() {
    var programSelect = document.getElementById("program_list");
  
    // Clear existing options
    programSelect.innerHTML = "";
  
    // Create a default option
    var defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "Select Program";
    programSelect.appendChild(defaultOption);
  
    // Check if programList is available and not empty
    if (programList && programList.length > 0) {
      // Iterate through programList and add options to the dropdown
      for (var i = 0; i < programList.length; i++) {
        var option = document.createElement("option");
        option.value = programList[i].program_name;
        option.text = programList[i].program_name;
        programSelect.appendChild(option);
      }
    }
  }
  

console.log(programList)