//var compression = require('compression');

var http = require('http');  
var https = require('https');
http.globalAgent.maxSockets = Infinity;  
https.globalAgent.maxSockets = Infinity;  

var express = require('express');
var app = express();

app.use(express.compress());

app.set('port', (process.env.PORT || 5000));

app.use(express.static('public', { maxAge: 31557600 }));


app.listen(app.get('port'), function() {
    console.log("Node is running at: " + app.get('port'));    
})