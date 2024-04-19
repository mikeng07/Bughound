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
        temp =  '<div id="area_entity">'+
                    '<input id="area_title" name="area_title" size="30" placeholder="functional area">'+
                    '<br><br>'+
                '</div>';
        $("div#area_list_values").append(temp);

        areaEntityCount += 1;
        // console.log('program entity count:', areaEntityCount);

        if (areaEntityCount > 0) {
            removeAreaButton.hidden = false;
        }
    });
}

if (removeAreaButton) {
    removeAreaButton.addEventListener("click", function() {
        $("div#area_list_values").children('div[id=area_entity]:last').remove();

        areaEntityCount -= 1;
        // console.log('program entity count:', areaEntityCount);

        if (areaEntityCount == 0) removeAreaButton.hidden = true;
    });
}

if (clearAreaButton) {
    clearAreaButton.addEventListener("click", function() {

        $('div[id=area_entity]').remove();
        $('#area_title').val("");
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