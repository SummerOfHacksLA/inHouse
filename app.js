var express = require('express')
  , http = require('http')
  , stylus = require('stylus')
  , nib = require('nib')
  , routes = require('./routes')

var app = express();
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}
app.set('port', process.env.PORT || 1123);
app.configure(function(){
  app.use(express.bodyParser());
});

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(stylus.middleware(
  { src: __dirname + '/assets'
  , compile: compile
  }
));
app.use(express.static(__dirname + '/assets'))

// handles
app.get('/', routes.layout);

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express app listening on port ' + app.get('port'));
});