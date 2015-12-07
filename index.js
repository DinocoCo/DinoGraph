var compression = require('compression');
//var compression = require('minify');

/*var compressedFiles = ["excanvas.js"]; //["excanvas.js","handler.js","helper.js","index.html","style.css","viz.js"];

var errorFunction = function(error, name) {
    console.log(error || name);
};

for(var i=0;i<compressedFiles.length;i++) {

}
minify("public\"+compressedFiles[i], errorFunction);*/

var http = require('http');  
var https = require('https');
http.globalAgent.maxSockets = Infinity;  
https.globalAgent.maxSockets = Infinity;  

var express = require('express');
var app = express();

app.use(compression());

app.set('port', (process.env.PORT || 5000));

app.use(express.static('public', { maxAge: 31557600 }));


app.listen(app.get('port'), function() {
    console.log("Node is running at: " + app.get('port'));    
})