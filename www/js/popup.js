//console.log("Hello from popup.js");
$('#send-btn').click(function() {
    
    var input = $('#sentiment_input').val();
    
    if (!input) {
        $('#sentiment_feedback').html('Please input some text.');
        return;
    }
    
    $.post('/processSentiment', {input:input})
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