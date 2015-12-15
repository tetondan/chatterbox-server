/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var resultsObj = {
    results: []
  };
var requestHandler = function(request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);
  var pathObj = {'/classes/messages': '/classes/messages', '/classes/room1': '/classes/room1','/classes/room': '/classes/room'}
  if(pathObj[request.url]){
    console.log(request.url);
    if(request.method === 'GET'){
      var headers = defaultCorsHeaders;
      var statusCode = 200;
      headers['Content-Type'] = "text/plain";
      response.writeHead(statusCode, headers);
      response.write(JSON.stringify(resultsObj));
      response.end();
    }
    if(request.method === "POST"){
      var body = [];
      var statusCode = 201;
      var headers = defaultCorsHeaders;
      request.on('data', function(chunk) {
        body.push(chunk);
      }).on('end', function() {
        body = Buffer.concat(body).toString()
        body = JSON.parse(body);
          // at this point, `body` has the entire request body stored in it as a string
        resultsObj.results.push(body)
        headers['Content-Type'] = "text/plain";
        response.writeHead(statusCode, headers);
        response.end();
      });
    }
    if(request.method === 'OPTIONS'){
      var headers = defaultCorsHeaders;
      var statusCode = 200;
      headers['Content-Type'] = "text/plain";
      response.writeHead(statusCode, headers);
      response.end();
    }
  } else {
    var headers = defaultCorsHeaders;
    var statusCode = 404;
    headers['Content-Type'] = "text/plain";
    response.writeHead(statusCode, headers);
    response.end();
  }
};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

exports.requestHandler = requestHandler
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.

  // The outgoing status.

  // See the note below about CORS headers.

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.


  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.


  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

