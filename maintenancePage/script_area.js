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
        $('select[id=program_entity]').remove();

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