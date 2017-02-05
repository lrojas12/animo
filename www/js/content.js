main();

function main(){
    console.log("Hello world");

    var name = "Luisa"; //TODO: get name from the database
    var message = "Hey " + name + ", hru?";
    insertNotification(message);
    initGoBtn();
    initInput();
    
}


//---------HELPER FUNCTIONS---------
function insertNotification(notification_message){
    //Build the notification
    var $button = $("<button class='btn btn-default' type='button'>").html("Go!");
    var $span = $("<span id='goBtn' class='input-group-btn'>").append($button);
    var $input = $("<input id='sentiment_input' type='text' class='form-control' placeholder='I feel...'>");
    var $input_group = $("<div class='input-group'>").append($input, $span);
    var $col = $("<div class='col-sm-12'>").append($input_group);
    var $row = $("<div class='row'>").append($col);
    var $notif_msg = $("<div id='notification_msg'>").html(notification_message);
    var $notification = $("<div class='well well-sm' id='notification'>").append($notif_msg);

    //Append the notification to the body
    $notification.append($row);
    $("body").append($notification);
}

function initGoBtn(){
    $("#goBtn").click(function(){
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
}

function initInput(){
    $("#sentiment_input").keyup(function(event){
	if(event.keyCode == 13){
            $("#goBtn").click();
	}
    });
}
