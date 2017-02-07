const STATE_SUCCESS = 0;
const STATE_FAILURE = 1;

var username;
var name;
var freq;
var greeting_messages;
var gender;
var all_entries;

chrome.storage.local.get(['username', 'name', 'freq', 'gender'], function(items) {
      
      username = items.username;
      name = items.name;
      freq = items.freq;
      gender = items.gender;
      
      console.log("[content.js] Retrieved name " + name);
      
      app();
});

chrome.runtime.onMessage.addListener(
                        
    function(req, sender, sendResponse) {
        
        chrome.storage.local.get(['username', 'name', 'freq', 'gender'], function(items) {
              
              username = items.username;
              name = items.name;
              freq = items.freq;
              gender = items.gender;
              
              app();
        });
        
        console.log(sender.tab ?
                    "received message from a content script:" + sender.tab.url :
                    "received message from the extension");
        
        if (req.subject && (req.subject == "request")) {
            
            $.post('http://127.0.0.1:3000/getEntries', {username: username})
                .done(function(result) {
                    
                    console.log("state: " + result.state);
                    console.log(result.data);
                                        
                    if (result.state == STATE_FAILURE) {
                        $("#entries-cont").append(data.message);
                        console.log("state: STATE_FAILURE");
                    } else {
                        sendResponse({data: result.data});
                        //sendResponse({data: "some data"});
                    }
                })
                .fail(function(xhr, textStatus, error) {
                    
                    //console.log(xhr.statusText);
                    //console.log(textStatus);
                    //console.log(error);
                    
                    console.log("[getEntries] Could not get entries from user " + username + ".");
                    sendResponse({state: STATE_FAILURE, message: "Server is down. Please try again later."});
                });
                return true;
        } else if (req.subject && (req.subject == "saveall")) {
            chrome.storage.local.set({'username': req.username, 'name':req.name, 'freq':req.freq, 'gender': req.gender});
        }
        
        //console.log("Sent to popup from content: ");
        //console.log(all_entries);
});

function app() {
    
    console.log('start of content');
        
    greeting_messages = [
        "Hello, " + name + ". How are you doing today?",
        "Hey, anything interesting happen today?",
        "Hi, just checking up on ya, how is the world treating you today?",
        "Greetings, how can I help you today?"
    ]

    createNotification();

    $("#send-btn").click(function() {
        console.log("Send Button Clicked!!");

        //Obtain the input from the user
        var $input = $("#sentiment-input");
        var input = $input.val();
        console.log("[client] " + input);
        
        createMessage("You", input);
        console.log("sending post to server with name = " + name);
        
        //Send post request to the server
        $.post('http://127.0.0.1:3000/processSentiment', {input:input, username:username, name:name})
            .done(function(data) {
            
                var reply = data.message;
                
                createMessage("Bot", reply);
                
                console.log(reply);
            })
            .fail(function(xhr, textStatus, error) {
                console.log(xhr.statusText);
                console.log(textStatus);
                console.log(error);
                
                createMessage("Bot", "[processSentiment] Sorry, seems we have a problem with our server. I'll come back later!");
        });

        $("#sentiment-input").prop('disabled', true);
        $("#send-btn").prop('disabled', true);
        
        //Clear the input field
        $input.val(''); 
    });

    $("#sentiment-input").keyup(function(event){
        
        if(event.keyCode == 13){
            $("#send-btn").click();
        }
    });

    $("#close-notification").click(function() {
        $("#notification").remove();
    });
}

function createNotification() {
    
    console.log('changed!');
    
    var notification_message;
    
    if (!username) {
        notification_message = "Please enter your information in the top right Animo menu."
        
    } else {
        //get a random index for the greeting messages
        var random_index = Math.floor(Math.random() * greeting_messages.length);
        notification_message = "<b>Bot</b>: " + greeting_messages[random_index];
        
        var $button = $("<button id='send-btn' class='btn btn-default' type='button'>").html("Send");
        var $span = $("<span class='input-group-btn'>").append($button);
        var $input = $("<input id='sentiment-input' type='text' class='form-control' placeholder='I feel ...'>");
        var $input_group = $("<div class='input-group'>").append($input, $span);
    }
    
    var $notif_msg = $("<div id='notification-msg'>").html(notification_message);
    var $messages = $("<div id='messages'>").append($notif_msg);
    
    if (!username) var $chat_holder = $("<div id='chat-holder'>").append($messages);
    else $chat_holder = $("<div id='chat-holder'>").append($messages, $input_group);
    
    var $header_text = $("<p>").html("New message!");
    var $not_now = $("<a id='close-notification'>").html("[ x ]");
    var $notif_header = $("<div id='notification-header' class='in-line'>").append($header_text, $not_now);
    
    var $notification = $("<div class='well well-sm' id='notification'>").append($notif_header, $chat_holder);

    //var $test_btn = $("<button id='test-btn' class='btn btn-danger btn-xs'>").html("TEST");

    //Append the notification to the body
    //$("body").append($notification, $test_btn);

    $("body").append($notification);
};

function createMessage(sender, message) {
    //console.log("createMessage called() " + "[sender:" + sender + "] [message:" + message + "]");
    var $newMessage = $("<div id='notification-msg'>").html("<b>" + sender + "</b>: " + message);
    //console.log($newMessage[0]);
    $("#messages").append($newMessage);
    
    //$("#messages").append("<div id='notification_msg'><b>" + sender + "</b>: " + message + "</div>");
};
