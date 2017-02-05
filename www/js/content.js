var username = "Luisa"; //TODO: get name from the database 
var message = "<b>Bot</b>: Hello, " + username + ". How are you doing today?";

createNotification(message);

$("#send-btn").click(function() {
    //console.log("Go Button Clicked!");

    //Obtain the input from the user
    var $input = $("#sentiment_input");
    var input = $input.val();
    console.log("[client] " + input);

    //Send post request to the server
    $.post('http://127.0.0.1:3000/processSentiment', {input:input})
        .done(function(data) {
        
            var reply = data.message;
            
            //TODO: Use UI to display reply to user
        
            console.log(reply);
        })
        .fail(function(xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
    });

    //Clear the input field
    $input.val(''); 
});

$("#sentiment_input").keyup(function(event){
    
    if(event.keyCode == 13){
            $("#send-btn").click();
    }
});


function createNotification(notification_message) {
    
    var $button = $("<button id='send-btn' class='btn btn-default' type='button'>").html("Send");
    var $span = $("<span class='input-group-btn'>").append($button);
    var $input = $("<input id='sentiment-input' type='text' class='form-control' placeholder='I feel ...'>");
    var $input_group = $("<div class='input-group'>").append($input, $span);
    var $notif_msg = $("<div id='notification-msg'>").html(notification_message);
    var $chat_holder = $("<div id='chat-holder'>").append($notif_msg, $input_group);
    
    var $header_text = $("<p>").html("New message!");
    var $notif_header = $("<div id='notification-header'>").append($header_text);
    
    var $notification = $("<div class='well well-sm' id='notification'>").append($notif_header, $chat_holder);

    //Append the notification to the body
    $("body").append($notification);
}