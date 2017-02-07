var username;
var freq;
var greeting_messages;

chrome.storage.local.get(['username', 'freq'], function(items) {
      
      username = items.username;
      freq = items.freq;
      
      app();
});

function app() {
        
    greeting_messages = [
        "Hello, " + username + ". How are you doing today?",
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
        
        //Send post request to the server
        $.post('http://127.0.0.1:3000/processSentiment', {input:input, username:username})
            .done(function(data) {
            
                var reply = data.message;
                
                createMessage("Bot", reply);
                
                console.log(reply);
            })
            .fail(function(xhr, textStatus, error) {
                console.log(xhr.statusText);
                console.log(textStatus);
                console.log(error);
                
                createMessage("Bot", "Sorry, seems we have a problem with our server. I'll come back later!");
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

    $("#test-btn").click(function() {
        createNotification();
    });
}

function createNotification() {

    //get a random index for the greeting messages
    var random_index = Math.floor(Math.random() * greeting_messages.length);
    var notification_message = "<b>Bot</b>: " + greeting_messages[random_index];
    
    var $button = $("<button id='send-btn' class='btn btn-default' type='button'>").html("Send");
    var $span = $("<span class='input-group-btn'>").append($button);
    var $input = $("<input id='sentiment-input' type='text' class='form-control' placeholder='I feel ...'>");
    var $input_group = $("<div class='input-group'>").append($input, $span);
    
    var $notif_msg = $("<div id='notification-msg'>").html(notification_message);
    var $messages = $("<div id='messages'>").append($notif_msg);
    var $chat_holder = $("<div id='chat-holder'>").append($messages, $input_group);
    
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
