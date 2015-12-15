var resultsObj = {
  results: []
};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10,
  "content-type": "text/plain"
};

var express = require('express');
var bodyParser = require('body-parser')
var app = express();

app.use(bodyParser.text());

app.route('/classes/messages')
  .get(function(req, res){
    res.set(defaultCorsHeaders);
    res.send(JSON.stringify(resultsObj));
    res.end();
  })
  .post(function(req, res){
    resultsObj.results.push(JSON.parse(req.body));
    res.set(defaultCorsHeaders);
    console.log(resultsObj);
    res.status(201).end();
  })
  .options(function(req, res){
    res.set(defaultCorsHeaders);
    res.end();
  })

var server = app.listen(3000, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listenning at http://%s:%s', host, port);
});