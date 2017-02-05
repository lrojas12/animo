var express = require('express');
var bodyParser = require('body-parser');
var indico = require('indico.io');

indico.apiKey =  '1dea16c1023be04af4aaa6ce6baea0e2';

var app = express();

const STATE_SUCCESS = 0;
const STATE_FAILURE = 1;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/isalive', function (req, res) {
    res.send('Yep! Its alive');
});

app.post('/processSentiment', function (req, res) {    
    
    var input = req.body.input;
    var reply = ""; //TODO: automate this

    console.log('[client] ' + input);
        
    if (!input) {
        res.send({
            state: STATE_FAILURE,
            message:'Empty input.'});
        return;
    }


    //TEMP
    clientReturnData = "[server] " + input; //TODO: a proper reply

    res.send({
	state: STATE_SUCCESS,
	message: clientReturnData
    });
    /* Sample data
       Anger: 0.21936692300000002%
       Joy: 0.0597357154%
       Fear: 0.19920347630000002%
       Sadness: 0.4449304342%
       Surprise: 0.0767634511
    */

    /* TODO: Uncomment later
    indico.emotion(input)
        .then(function(data) {
            
            console.log('Anger: ' + data.anger + "%\nJoy: " + data.joy + "%\nFear: " +
                        data.fear + "%\nSadness: " + data.sadness + "%\nSurprise: " + data.surprise);
            
            res.send({
                state: STATE_SUCCESS,
                //data:data,
                message:reply});
        })
        .catch(function(err) {
            res.send({
                state: STATE_FAILURE, 
                message:'There was an error processing the input.'
            });
        });
    */
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
    console.log('Listening on port ' + app.get('port'));
});
