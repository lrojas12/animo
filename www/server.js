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
    
    console.log('Received something from client!');
    
    var input = req.body.input;
    var reply = ""; //TODO: automate this
        
    if (!input) {
        res.send({
            state: STATE_FAILURE,
            message:'Empty input.'});
        return;
    }
    
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
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
    console.log('Listening on port ' + app.get('port'));
});