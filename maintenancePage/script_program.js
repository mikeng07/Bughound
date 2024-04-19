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

if (newProgramButton) {
    newProgramButton.addEventListener("click", function() {
        temp =  '<div id="program_entity">'+
                    '<input id="program_name" name="program_name" size="10" placeholder="program name"> '+
                    '<input id="program_release" name="program_release" size="6" placeholder="release"> '+
                    '<input id="release_version" name="release_version" size="3" placeholder="version">'+
                    '<br><br>'+
                '</div>';
        $("div#program_list_values").append(temp);

        programEntityCount += 1;
        // console.log('program entity count:', programEntityCount);

        if (programEntityCount > 0) {
            removeProgramButton.hidden = false;
        }
    });
}

if (removeProgramButton) {
    removeProgramButton.addEventListener("click", function() {
        $("div#program_list_values").children('div[id=program_entity]:last').remove();

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

if (submitProgramButton) {
    submitProgramButton.addEventListener("click", function(e) {
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