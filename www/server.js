var express = require('express');
var bodyParser = require('body-parser');
var indico = require('indico.io');
var fs = require('fs');

//Mongo Stuff
const MongoClient = require('mongodb').MongoClient;
var db;

indico.apiKey =  '1dea16c1023be04af4aaa6ce6baea0e2';

var app = express();

const STATE_SUCCESS = 0;
const STATE_FAILURE = 1;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/isalive', function (req, res) {
    res.send('Yep! Its alive');
});

app.get('/dbtest', function (req, res) {
    console.log("/dbtest called");
    db.collection("test").save({username:"google",password:"google123"});    
    var cursor = db.collection("test").find();
    console.log(cursor);
    res.send();
});

app.post('/processSentiment', function (req, res) {    
    
    var input = req.body.input;
    var reply = ""; //TODO: automate this

    console.log('[client] ' + input);
        
    if (!input) {
        res.send({
            state: STATE_FAILURE,
            message: ":-( Ok, we'lll talk later, then. Best of luck."});
        return;
    }

    //TODO: Uncomment later
    
    indico.emotion(input)
        .then(function(data) {

    	    console.log("------------------");
                console.log('Anger: ' + data.anger + "%\nJoy: " + data.joy + "%\nFear: " +
                            data.fear + "%\nSadness: " + data.sadness + "%\nSurprise: " + data.surprise);
    	    console.log("------------------");

    	    var emotion = getClientEmotion(data);
    	    
    	    var path = "www/data/";
    	    var filename = path + emotion + ".txt"
    	    
    	    fs.readFile(filename, 'utf8', function(err, contents) {
        		var replies_array = (contents.trim()).split('\n');
        		var len = replies_array.length;
        		var index = Math.floor(Math.random() * len); //Create a random index to return
        		//console.log(contents.trim());
        		var clientReply = replies_array[index];
        		console.log(clientReply);
        		
        		res.send({
        		    state: STATE_SUCCESS,
        		    message: clientReply
        		});
    	    });    
        })
        .catch(function(err) {
            res.send({
                state: STATE_FAILURE, 
                message:'There was an error processing the input.'
            });
        });
    

});

app.set('port', process.env.PORT || 3000);

MongoClient.connect('mongodb://admin:admin@ds141209.mlab.com:41209/qhacks2017', (err, database) => {
  if (err) return console.log(err)
  db = database
    app.listen(app.get('port'), function() {
	console.log('Listening on port ' + app.get('port'));
    });
})



function getClientEmotion(data){
    //Returns the highest ranked emotion based on the data given

    /*

    var data = {
	'anger': 0.507581704296171665,
	'joy': 0.07016665488481522,
	'fear': 0.6000516295433044,
	'sadness': 0.02512381225824356,
	'surprise': 0.86534374748375202
    }
    */
    
    var emotion = "";
    var max_val = 0.0;    

    for (var key in data) {
	if (data.hasOwnProperty(key)) {
	    if(data[key] > max_val){
		emotion = key.trim();
		max_val = data[key];
	    }
	    //console.log(key + " -> " + data[key]);
	}
    }
    console.log(emotion + " " + max_val);

    return emotion;
}
