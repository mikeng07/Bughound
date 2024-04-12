document.getElementById("createButton").addEventListener("click", function(){
    window.location.href ="createPage.html"
})


document.getElementById("editButton").addEventListener("click", function(){
    window.location.href ="editPage.html"
})

document.getElementById("searchButton").addEventListener("click",function(){

    var number = document.getElementById("numberInput").value  ;

    consolg.log("you enter: " + number);

})

