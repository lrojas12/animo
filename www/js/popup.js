var username; //TODO: get username from local storage
var user_exists;

if (!username) {
    $("#greeting").html("Hello, there!");
    $("#username_input").attr("placeholder", "New username here!");
    user_exists = false;
} else {
    $("#greeting").html("Hello, " + username + "!");
    $("#username_input").attr("placeholder", "New username?");
    user_exists = true;
}

$("#unordered-list li a").click(function() {
    $("#dropdown-btn").html($(this).html());
});

$('#send-btn').click(function() {
    
    $("#username_error").html("");
    $("#freq_error").html("");
    $("#submission_msg").html("");
    
    var username = $("#username_input").val();
    console.log("Username entered: " + username);
    var freq = $('#dropdown-btn').html();
    console.log("Freq chosen: " + freq);    
    
    //TODO: check if there is a notification spawn frequency saved in local storage.
    //otherwise, show error and remind user to pick an option.
    
    //TODO: check username field is not empty if new user
    //TODO: check max chars for username is 9
    if (!user_exists) { //new user
        if (!username) {
            $("#username_error").html("You're a new user; please pick a username.");
            return;
        }
        
        if (username.length > 9) {
            $("#username_error").html("Max 9 characters, please!");
            return;
        }
        
        if (freq == "Please select one") {
            $("#freq_error").html("You're a new user; please select one.");
            return;
        }
    }
    
    //TODO: save stuff locally!
    $("#submission_msg").html("Your changes have been saved successfully.");

    

});