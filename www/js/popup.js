//resetLocalStorage(); //Uncomment to reset username and freq - simulates first time use

var username = localStorage.qhacks_username//get username from local storage
var freq = localStorage.qhacks_freq; //get the frequency from local storage
var user_exists;

if (!username) {
    $("#greeting").html("Hello, there!");
    $("#username_input").attr("placeholder", "New username here!");
    user_exists = false;
} else {
    $("#username_input").val(username);
    $('#dropdown-btn').html(freq);
    $("#greeting").html("Hello, " + username + "!");
    $("#username_input").attr("placeholder", "New username?");
    user_exists = true;
}

$("#unordered-list li a").click(function() {
    $("#dropdown-btn").html($(this).html());
});

$("#analyze-btn").click(function() {
    
    var $newdiv = $("<div class='alert'>").html("<b>Coming up soon</b>: You will be able to see a detailed analysis of your moods and experiences depending on the spawn frequency you have chosen. This would be done using the database where all user data is store, as well as Sentiment Analysis NLP.");
    $("#analyze-div").append($newdiv);
    
    setTimeout(function(){$('.alert').remove()}, 20000);
    
});

$('#save-btn').click(function() {
    
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
    
    //Save stuff locally!
    //Check if local storage is supported
    if (typeof(Storage) == "undefined") {
	       console.log("localStorage not supported");
	          return;
    }
    
    $("#submission_msg").html("Your changes have been saved successfully.");
    $("#greeting").html("Hello, " + username + "!");
    $("#username_input").attr("placeholder", "New username?");
    
    //Save the username
    localStorage.setItem("qhacks_username", username);
    localStorage.setItem("qhacks_freq", freq);

});

//For debuggin purposes to simulate first time users
function resetLocalStorage(){
    localStorage.removeItem("qhacks_username");
    localStorage.removeItem("qhacks_freq");
}
