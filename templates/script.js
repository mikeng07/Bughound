
var logoutButton = $('#logoutButton');

if (logoutButton) {
    logoutButton.onclick(function(e) {
        e.preventDefault();

        $.ajax({
            type: "POST",
            url: "/logout",
        })
    });
}