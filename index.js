var express = require('express');
var app = express();
var minify = require('express-minify');

app.set('port', (process.env.PORT || 5000));

app.use(express.static('public'));
app.use(compression());
app.use(minify());


app.listen(app.get('port'), function() {
    console.log("Node is running at: " + app.get('port'));    
})