$('#send-btn').click(function() {
    
    var input = $('#sentiment_input').val();
    console.log("Sending '" + input + "' to server");
    
    if (!input) {
        $('#sentiment_feedback').html('Please input some text.');
        return;
    }
    
    $.post('http://127.0.0.1:3000/processSentiment', {input:input})
        .done(function(result) {
            
            var reply = result.message;
            //TODO: Use UI to display reply to user
        })
        .fail(function(xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        });
});
