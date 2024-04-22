// MAINTENANCE_PAGE

var isLoggedIn = localStorage.getItem("isLoggedIn");

// If user is not logged in, redirect to login page
if (!isLoggedIn) {
    alert("You are not logged in. Redirecting to login page...");
  window.location.href = "Login.html";
}

var isAccessLevel = localStorage.getItem("accessLevel");
if (isAccessLevel === 3) {
    alert("You are not cleared to be here. Redirecting to initial menu...");
  window.location.href = "index.html";
}

var deepLookupButton = document.getElementById("deepLookupButton");
var redirect_employees = document.getElementById("toEmployees");
var redirect_programs = document.getElementById("toPrograms");
var redirect_areas = document.getElementById("toAreas");
var backButton = document.getElementById("backButton");

if (deepLookupButton) {
    deepLookupButton.addEventListener("click", function() {
        window.location.href = "maintenanceLookup.html";
    });
}

if (redirect_employees) {
    redirect_employees.addEventListener("click", function() {
        window.location.href = "maintenancePage/employees.html";
    });
}

if (redirect_programs) {
    redirect_programs.addEventListener("click", function() {
        window.location.href = "maintenancePage/programs.html";
    });
}

if (redirect_areas) {
    redirect_areas.addEventListener("click", function() {
        window.location.href = "maintenancePage/areas.html";
    });
}

if (backButton) {
    backButton.addEventListener("click", function() {
        window.location.href = "index.html";
    });
}

// EXPORT DB DATA
var exportEmployeeListButton = document.getElementById("exportEmployeeListButton");
var exportProgramAreasButton = document.getElementById("exportProgramAreasButton");

if (exportEmployeeListButton) {
    exportEmployeeListButton.addEventListener("click", function() {
        // get file type
        let file_type = $('#file_type_e').val();
        console.log("beginning export of employee_list as file type:", file_type);

        // get list of employees
        const file_content = ""; // TODO: insert file content

        downloadFile(file_type, file_content, "employee_list");
    });
}

if (exportProgramAreasButton) {
    exportProgramAreasButton.addEventListener("click", function() {
        // get file type
        let file_type = $('#file_type_a').val();
        console.log("beginning export of program_areas as file type:", file_type);

        // get list of program areas
        const file_content = ""; // TODO: insert file content

        downloadFile(file_type, file_content, "program_areas");
    });
}

function downloadFile(file_type, content, src) {

    if (file_type === "TXT") {
        const link = document.createElement("a");
        const file = new Blob([content], {type: "text/plain"});
        
        link.href = URL.createObjectURL(file);
        link.download = src+".txt";
        link.click();
        URL.revokeObjectURL(link.href);

        console.log("download of "+src+" complete");
        return;
    }

    if (file_type === "XML") {

        let parsedContent = (content) => {
            // add parsed content, merging content where relevant
            let xml_str = "<span></span>";

            const parser = new DOMParser();
            const doc = parser.parseFromString(xml_str, "application/xml");

            // parse failed
            if (doc.querySelector("parseerror")) {
                console.log("xml parse failed. no download was made.");
                return -1;
            }

            // serialize
            const serializer = new XMLSerializer();
            return serializer.serializeToString(doc);
        };
        
        // if parseerror happens, parsedContent will return -1 
        if (parsedContent === -1) {return;}

        const link = document.createElement("a");
        const file = new Blob([parsedContent], {type: "text/xml"});
        link.href = URL.createObjectURL(file);
        link.download = src+".xml";
        link.click();
        URL.revokeObjectURL(link.href);

        console.log("download of "+src+" complete");
        return;
    }

    if (file_type === "JSON") {
        console.log("not yet ready; no download has occurred");
        return;
    }
}
// MAINTENANCE LOOKUP

var backButtonM = document.getElementById("backButtonM");
if (backButtonM) {
    backButtonM.addEventListener("click", function() {
        window.location.href = "maintenancePage.html";
    });
}

var lookupButton = document.getElementById("lookupButton");
if (lookupButton) {
    lookupButton.addEventListener("click", function() {

        let searchInput = document.getElementById("lookupType").value;
        // $.ajax({
        //     type: "GET",
        //     url:  "db_connect.php",
        //     data: {
        //         f: "read_maint",
        //         q: searchInput,
        //     },
        //     success: function(obj) {
        //         console.log(obj);
        //         // for (var i = 0; i < obj.length; i++) {
        //         //     let row = "";
        //         //     // format row
        //         //     $('#searchResults').append(row);
        //         // }
        //     },
        // });
        // query and post results
        $('#searchResults').html("No results found");
    });
}

