var backButton = document.getElementById("backButton");
if (backButton) {
    backButton.addEventListener("click", function() {
        window.location.href = "../maintenancePage.html";
    });
}

// ADD EMPLOYEES
var newEmployeeButton = document.getElementById("newEmployeeButton");
var removeEmployeeButton = document.getElementById("removeEmployeeButton");
var clearEmployeeButton = document.getElementById("clearEmployeeButton");
var submitEmployeeButton = document.getElementById("submitEmployeeButton");

var employeeEntityCount = 0;

if (newEmployeeButton) {
    newEmployeeButton.addEventListener("click", function() {
        temp =  '<div id="employee_entity">'+
                    '<input id="employee_name" name="employee_name" size="10" placeholder="username"> '+
                    '<input id="login_id" name="login_id" size="7" placeholder="Login ID"> '+
                    '<input id="employee_level" name="employee_level" size="3" placeholder="level">'+
                    '<br><br>'+
                '</div>';
        $("div#employee_list_values").append(temp);

        employeeEntityCount += 1;
        // console.log('employee entity count:', employeeEntityCount);

        if (employeeEntityCount > 0) {
            removeEmployeeButton.hidden = false;
        }
    });
}

if (removeEmployeeButton) {
    removeEmployeeButton.addEventListener("click", function() {
        $("div#employee_list_values").children('div[id=employee_entity]:last').remove();
    
        employeeEntityCount -= 1;
        // console.log('employee entity count:', employeeEntityCount);
    
        if (employeeEntityCount == 0) removeEmployeeButton.hidden = true;
    });
}

if (clearEmployeeButton) {
    clearEmployeeButton.addEventListener("click", function() {
        $('div[id=employee_entity]').remove();
        $('#employee_name').val("");
        $('#login_id').val("");
        $('#employee_level').val("");
        removeEmployeeButton.hidden = true;
    });
}

if (submitEmployeeButton) {
    // submitEmployeeButton.addEventListener("click", function(e) {
    //     e.preventDefault();
    //     $.ajax({
    //         type: "POST",
    //         url:  "db_connect.php",
    //         data: {
    //             f: "add_employees",
    //             q: "",
    //         },
    //         success: function(obj) {
    //             console.log(obj);
    //         },
    //         dataType: "json",
    //     });
    // });
}