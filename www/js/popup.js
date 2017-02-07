//resetLocalStorage(); //Uncomment to reset username and freq - simulates first time use
//var username = localStorage.qhacks_username; //get username from local storage
//var freq = localStorage.qhacks_freq; //get the frequency from local storage
var user_exists;
//var username = "nousername";
//var freq = "somefreq";
var username;
var freq;
var gender;
var user_entries;
var name;

chrome.storage.local.get(['username', 'name', 'freq', 'gender'], function(items) {
      username = items.username;
      name = items.name;
      freq = items.freq
      gender = items.gender;
      
      console.log('[popup] loaded up variables: username: '+username+ 'name: ' + name + ' freq: ' + freq+' gender: ' + gender);
      
      app();
});

function app() {
    
    if (!username) {
        //$("#greeting").html("Hello, there!");
        $("#username_input").attr("placeholder", "New username here!");
        $("#name_input").attr("placeholder", "Your name here!");
        user_exists = false;
    } else {
        $("#username_input").val(username);
        $("#name_input").val(name);
        $('#dropdown-btn').html(freq);
        //$("#greeting").html("Hello, " + username + "!");
        $('#gender-dropdown-btn').html(gender);

        //$("#username_input").attr("placeholder", "New username?");
        user_exists = true;
    }

    $("#username_input").keyup(function(event){
        if(event.keyCode == 13){
            $("#save-btn").click();
        }
    });
    
    $("#name_input").keyup(function(event){
        if(event.keyCode == 13){
            $("#save-btn").click();
        }
    });

    $("#unordered-list li a").click(function() {
        $("#dropdown-btn").html($(this).html());
    });
    
    $("#g-unordered-list li a").click(function() {
        $("#gender-dropdown-btn").html($(this).html());
    });

    $('#save-btn').click(function() {
        
        $("#username_error").html("");
        $("#name_error").html("");
        $("#gender_error").html("");
        $("#freq_error").html("");
        $("#submission_msg").html("");
        
        var username = $("#username_input").val();
        console.log("Username entered: " + username);
        var name = $("#name_input").val();
        console.log("Name entered: " + name);
        var freq = $('#dropdown-btn').html();
        console.log("Freq chosen: " + freq);  
        var gender = $('#gender-dropdown-btn').html();
        console.log("Gender chosen: " + gender);  

        if (!name) {
            $("#name_error").html("Please enter your name or nickname.");
            return;
        }
        
        if (!username) {
            $("#username_error").html("Please pick a username.");
            return;
        }
        
        if (username.length > 9 || username.length < 3) {
            $("#username_error").html("Your username should be 3-9 characters.");
            return;
        }
        
        if (gender == "Please select one") {
            $("#gender_error").html("Please pick one.");
            return;
        }
        
        if (freq == "Please select one") {
            $("#freq_error").html("Please pick one.");
            return;
        }
        
        
        //Save stuff locally!
        //Check if local storage is supported
        /*
        if (typeof(Storage) == "undefined") {
    	       console.log("localStorage not supported");
    	          return;
        }
        */
        
        $("#submission_msg").html("Your changes have been saved successfully.");
        //$("#greeting").html("Hello, " + username + "!");
        //$("#username_input").attr("placeholder", "New username?");
        
        //Save the username
        //localStorage.setItem("qhacks_username", username);
        //localStorage.setItem("qhacks_freq", freq);
        chrome.storage.local.set({'username': username, 'name': name, 'freq':freq, 'gender': gender}, function() {
            console.log('saved username: '+username+', name: '+name+' freq: '+freq+' and gender: ' + gender);
        });
        
        //send message to content; make sure they save this informationt too
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    
            chrome.tabs.sendMessage(tabs[0].id, {subject: "saveall", username:username, name:name, freq:freq, gender:gender});
        });
        
        window.close();
    });
}

//For debuggin purposes to simulate first time users
function resetLocalStorage(){
    StorageArea.remove(['username', 'freq', 'name', 'gender'], function () {
        console.log('Removed username, name, gender and freq from storage.');
    });
}
