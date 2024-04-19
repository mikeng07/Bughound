    //A FLAG TO CHECK IF USER IS LOGGED IN
    var isLoggedIn = localStorage.getItem("isLoggedIn");
    
    // If user is not logged in, redirect to login page
    if (!isLoggedIn) {
        alert("You are not logged in. Redirecting to login page...");
      window.location.href = "Login.html";
    }