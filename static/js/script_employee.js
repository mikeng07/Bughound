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

// EDIT EMPLOYEE INFO (ACCESS LEVEL ONLY)

var clearAccessChangeButton = document.getElementById("clearAccessChangeButton");
var submitAccessChangeButton = document.getElementById("submitAccessChangeButton");

if (clearAccessChangeButton) {
    clearAccessChangeButton.addEventListener("click", function() {
        $('#employee_realname').val("");
        $('#level_change').val("");
        $('#employee_change_res').html("");
    });
}

if (submitAccessChangeButton) {
    submitAccessChangeButton.addEventListener("click", function() {
        let employee_name = $('#employee_realname').val();
        let new_access_level = $('#level_change').val();

        var res = "";
        let incompleteFlag = false;

        if (employee_name === '') {
            res = res + "<span>warning -- no employee specified. whose access level are you changing?<span><br>";
            incompleteFlag = true;
        }
        if (new_access_level === '') {
            res = res + "<span>warning -- no access level specified. what are you changing this to?<span><br>";
            incompleteFlag = true;
        }
        // TODO: match this to that user's accessLevel
        // if (new_access_level === access_level_of_the_user) {
        //     res = res + "<span>warning -- the user has this access level currently<span><br>";
        //     incompleteFlag = true;
        // }
        console.log(res);
        $('#employee_change_res').html(res);
        
        if (incompleteFlag) {
            console.log("not completely filled out."); 
            return;

        } else {
    
            // POST new change

            // put out the results, regardless of success or failure

            // result = "<span>"+ "" +"</span>";    // place results here
            // $('#employee_change_res').append(result);

        }
    });
}