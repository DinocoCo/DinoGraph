//Minify all js files and combine into one
var compressor = require('node-minify');
var jsFiles = ['src/js/excanvas.js', 'src/js/handler.js', 'src/js/helper.js', 'src/js/viz.js'];
for(var i=0;i<jsFiles.length;i++)
{
	// Using Google Closure 
	new compressor.minify(
	{
		type: 'gcc',
		fileIn: jsFiles,
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
}

//Minify style.css file with YUI-css
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
    console.log("Script generated and saved:", 'index.html');
  }      
});

var http = require('http');  
var https = require('https');
http.globalAgent.maxSockets = Infinity;  
https.globalAgent.maxSockets = Infinity;  

var compress = require('compression');

var express = require('express');
var app = express();

app.use(compress());

app.set('port', (process.env.PORT || 5000));

app.use(express.static('public', { maxAge: 31557600 }));


app.listen(app.get('port'), function() {
    console.log("Node is running at: " + app.get('port'));    
})