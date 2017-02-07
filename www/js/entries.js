const STATE_SUCCESS = 0;
const STATE_FAILURE = 1;

//resetLocalStorage(); //Uncomment to reset username and freq - simulates first time use
//var username = localStorage.qhacks_username; //get username from local storage
//var freq = localStorage.qhacks_freq; //get the frequency from local storage
var user_exists;
//var username = "nousername";
//var freq = "somefreq";
var username;
var name;
var freq;
var gender;
var all_entries;

chrome.storage.local.get(['username', 'name', 'freq', 'gender'], function(items) {
    
      username = items.username;
      name = items.name;
      freq = items.freq;
      gender = items.gender;
      console.log('[entries] loaded up variables: username: '+username+ 'name: ' + name + ' freq: ' + freq+' gender: ' + gender);
      
      app();
});
      
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  
    console.log("sending message request to content...");
  
    chrome.tabs.sendMessage(tabs[0].id, {subject: "request"}, function(response) {
      
        //console.log(response);
      
        $("#entries-cont").html();
        
        if (response.state == STATE_FAILURE) {
            $("#entries-cont").append(response.message);
            
        } else {
            $.each(response.data, function(index, entry) {
                var date = entry.date;
                var text = entry.text;
                
                createEntry(date, text);
                //createEntry("a date", "a text");
                
            });
        } 
     });
});

function app() {
    
    if (!username) {
        $("#greeting").html("Hello, there!");
        user_exists = false;
    } else {
        $("#greeting").html("Hello, " + username + "!");
        user_exists = true;
    }

    $("#analyze-btn").click(function() {
        console.log('Analyze button was clicked.');
    });
}

//For debuggin purposes to simulate first time users
function resetLocalStorage(){
    StorageArea.remove(['username', 'freq'], function () {
        console.log('Removed username and freq from storage.');
    });
}

function createEntry(date, message) {
    
    var $pDate = $("<p id='entry-date'>").html(date);
    var $pText = $("<p id='entry-Text'>").html(message);
    var $entry = $("<div class='entry'>").append($pDate, $pText);
    
    $("#entries-cont").append($entry);
}
