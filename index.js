//Minify all js files and combine into one
var compressor = require('node-minify');

// Minify all js files using Google Closure 
new compressor.minify(
{
	type: 'gcc',
	fileIn: ['src/js/handler.js', 'src/js/helper.js', 'src/js/viz.js'],
	fileOut: 'public/concat.min.js',
	callback: function(err, min) {
		if(err)
		{
			console.log(err);
		}
		else
		{
			console.log('Successfully compiled concat.min.js');
		}
	}
});

//Minify style.css file with YUI
new compressor.minify(
{
	type: 'yui-css',
	fileIn: 'src/css/style.css',
	fileOut: 'public/style.css',
	callback: function(err, min){
		if(err)
		{
			console.log(err);
		}
		else
		{
			console.log('Successfully compiled style.css');
		}
	}
});

//Need to read from src html file
var fs = require('fs');
var fullHTML = fs.readFileSync('src/html/index.html','utf8');
//console.log(fullHTML);

//Input html file src to html-minifier
var htmlminifier = require('html-minifier');
var minifiedHTML = htmlminifier.minify(fullHTML, {
 removeComments: true,
 removeCommentsFromCDATA: true,
 collapseWhitespace: true,
 collapseBooleanAttributes: true,
 removeAttributeQuotes: true,
 removeEmptyAttributes: true,
});

//Write minified file to disk
fs.writeFile('public/index.html', minifiedHTML, function (err){
  if(err) {
    console.log(err);
  } else {
    console.log('Successfully compiled index.html');
  }      
});

//Increase number of available sockets in case of heavy traffic
var http = require('http');  
var https = require('https');
http.globalAgent.maxSockets = Infinity;  
https.globalAgent.maxSockets = Infinity;  



var express = require('express');
var app = express();

//Compress the webpage with gzip
var compress = require('compression');
app.use(compress());

//Set port to 5000 or whatever port the process is already on
app.set('port', (process.env.PORT || 5000));

//Redirect www to the base http page
app.all(/.*/, function(req, res, next) {
	var host = req.header("host");
	if (host.match(/^www\..*/i))
	{
		res.redirect(301, "http://." + host);
	}
	else
	{
		next();
	}
});

app.use(express.static('public', { maxAge: 31557600 }));



app.listen(app.get('port'), '::',function() {
    console.log("Node is running at: " + app.get('port'));    
});