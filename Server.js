//var SERVER_IP = "127.0.0.1";
var SERVER_PORT = 8080;

var http = require("http");
var express = require("express");
var requestHandler = require("./RequestHandler");


var app = express();
//var requestHandler = function(request, response){
//	response.end("get Info");
//
//}
//var defaultHandler = function(request, response){
//	response.end("Welcome to Kim's Web Server(Express).");
//
//}
app.get("/accessDB",requestHandler.accessDB);
app.get("*",requestHandler.defaultHandler);

app.listen(SERVER_PORT);
//var server = http.createServer(requestHandler);
//var server = http.createServer(app);
//
//var serverStartedCb = function(){
//	console.log("Http Server Started at " + SERVER_IP);
//}
//server.listen(SERVER_PORT,SERVER_IP,serverStartedCb);
