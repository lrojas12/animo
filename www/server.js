var express = require('express');
var bodyParser = require('body-parser');
var indico = require('indico.io');
var fs = require('fs');
var mongoose = require('mongoose');

indico.apiKey =  '1dea16c1023be04af4aaa6ce6baea0e2';

var app = express();

//mongoose set-up
var db; //assigned in the MongoClient.connect() function

var Schema = mongoose.Schema;
var entrySchema = new Schema({user: String,
                              //date: String,
                              date: Date,
                              //sentimentanalysis: {emotions: {Number}} },
                              sentimentanalysis: {} },
                            {collection:'entries'});

var Entry = mongoose.model('entry', entrySchema);

const STATE_SUCCESS = 0;
const STATE_FAILURE = 1;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/isalive', function (req, res) {
    res.send('Yep! Its alive');
});

/*
app.get('/dbtest', function (req, res) {
    console.log("/dbtest called");
    db.collection("test").save({username:"google",password:"google123"});    
    var cursor = db.collection("test").find();
    console.log(cursor);
    res.send();
});
*/

app.post('/processSentiment', function (req, res) {    
    
    var input = req.body.input;

    console.log('[client] ' + input);
        
    if (!input) {
        res.send({
            state: STATE_FAILURE,
            message: ":-( Ok, we'lll talk later, then. Best of luck."});
        return;
    }
    
    var clientReply = "No reply received from server.";
    
    indico.emotion(input)
        .then(function(data) {
                                    
    	    console.log("------------------");
                console.log('Anger: ' + data.anger + "%\nJoy: " + data.joy + "%\nFear: " +
                            data.fear + "%\nSadness: " + data.sadness + "%\nSurprise: " + data.surprise);
    	    console.log("------------------");

    	    var emotion = getClientEmotion(data);
    	    
    	    var path = "www/data/";
    	    var filename = path + emotion + ".txt";
    	    
    	    fs.readFile(filename, 'utf8', function(err, contents) {
                
        		var replies_array = (contents.trim()).split('\n');
        		var len = replies_array.length;
        		var index = Math.floor(Math.random() * len); //Create a random index to return
        		//console.log(contents.trim());
        		clientReply = replies_array[index];
        		console.log('[inside] ' + clientReply);
                
                res.send({
                    state: STATE_SUCCESS,
                    message: clientReply
                });
    	    });
            
            //console.log('[outside] ' + clientReply);

            // save in database
            var today = new Date();
            var sentimentData = data;
            //var log = input;
            var username = req.body.username;
            
            /*
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0
            var yyyy = today.getFullYear();
            if (dd < 10) dd = '0' + dd;
            
            if (mm < 10) {
                mm = '0' + mm;
            } 
            var today = dd + '/' + mm + '/' + yyyy;
            */
            
            console.log('date: ' + today);
            
            var newEntry = new Entry({user:username, date:today, sentimentanalysis:sentimentData});
            newEntry.save(function(err) {
                if (err) console.log(err);
            });
            
            
        })
        .catch(function(err) {
            console.log(err);
            res.send({
                state: STATE_FAILURE, 
                message: '[catch]' + clientReply
            });
        });
});


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

app.set('port', process.env.PORT || 3000);
// app.listen() is done here, since we only want the server set up when/if the database is also up and running
//note: for admin, add "admin" in URL: mongodb://<adminuser>:<password>@ds012345-a0.mlab.com:56789,ds012345-a1.mlab.com:56790/admin?replicaSet=rs-ds012345
mongoose.connect('mongodb://admin:pass123@ds145019.mlab.com:45019/entriesdb', function(err, database) {
    if (err) return console.log(err);
    
    db = database
    app.listen(app.get('port'), function() {
      console.log('Listening on port ' + app.get('port'));
    });
});