var dbAccess = require("./AccessMongo");

var exec = require("child_process").exec;
var queryString = require("querystring");
var fs = require("fs");
var url = require("url");

//var util = require("util");
//var path = require("path");
//var formidable = require("formidable");
//var sys = require('sys');

var uploadDir = "files";

var mimeType = {
	"jpg" : "image/jpeg",
	"gif" : "image/gif",
	"png" : "image/png",
	"svg" : "image/svg",
	"zip" : "application/zip",
	"pdf" : "application/pdf",
	"xls" : "application/vnd.ms-excel",
	"ppt" : "application/vnd.ms-powerpoint",
	"doc" : "application/msword",
	"htm" : "text/html",
	"html" : "text/html"
};

function getMimeType(ext) {
	var type = mimeType[ext];
	if (!type)
		return "text/plain";
	else
		return type;
}

// function start(query,response){
//	console.log("arrive server index");
//	
//	var body = '<html>'+
//    '<head>'+
//    '<meta http-equiv="Content-Type" content="text/html; '+
//    'charset=UTF-8" />'+
//    '</head>'+
//    '<body>'+
//    '<form action="/upload" enctype="multipart/form-data" method="post">'+
//    '<text >Game ID : </text>' +
//    '<input type="text" name="gameId"><br>'+
//    '<text >Target Folder : </text>' +
//    '<input type="text" name="desPath"><br>'+
//    '<input type="file" name="upload">'+
//    '<input type="submit" value="Upload file" />'+
//    '</form>'+
//    '</body>'+
//    '</html>';
//	
//	response.writeHead(200, {"Content-Type": "text/html"});
//    response.write(body);
//    response.end();
//}

function list(subDir,response){
	console.log("list files at " + subDir);
	//var subDir = queryString.parse(query).dir;
	
	exec("ls " + subDir + " -lah",function(error,stdout,stderr){
		response.writeHead(200, {"Content-Type": "text/plain"});
	    response.write(stdout);
	    response.end();
	});
}

//function download(query,response){
//	var file = queryString.parse(query).file;
//	downloadFile(file,response,"");
//}
//
//function upload(query,request,response){
//	var form = new formidable.IncomingForm();
//	form.uploadDir = uploadDir;
//	form.parse(request, function(error, fields, files) {
//
//		var srcPath = files.upload.path;
//		var subDir = uploadDir + "/" + fields.desPath;
//		var desPath = subDir + "/" + files.upload.name;
//		console.log("try upload file from : " + srcPath + " to " + desPath);
//		
//		if(!fs.existsSync(subDir)){
//			console.log("make dir : " + subDir);
//			fs.mkdirSync(subDir);
//		}
//		
//	    fs.renameSync(srcPath,desPath);
//	    //fs.unlinkSync(srcPath);
//		response.writeHead(200, {"content-type": "text/plain"});
//		response.write("received upload:\n");
//		response.write(desPath + "\n");
//		response.end(sys.inspect({fields: fields, files: files}));
////	    response.writeHead(200, {"Content-Type": "text/html"});
////	    response.write("received image:<br/>");
////	    response.write("<img src='/show' />");
////	    response.end();
//	  });
//}
//
//function getPatchInfo(query,response){
//	var fileFullUrl = serverUrl + "/" + uploadDir + "/";
//	
//	var info = {};
//	info["gameId"] = "000";
//	info["version"] = "1.00";
//	info["updatePatch"] = fileFullUrl + "apk/PathChecker.apk";
//	var updateContents = [];
//	updateContents.push({"contentFile" : "apk/kim_0120.apk","contentUrl" : fileFullUrl + "apk/kim_0120.apk"});
//	updateContents.push({"contentFile" : "apk/kim_0121.apk","contentUrl" : fileFullUrl + "apk/kim_0121.apk"});
//	updateContents.push({"contentFile" : "apk/kim_0123.apk","contentUrl" : fileFullUrl + "apk/kim_0123.apk"});
//	info["updateContents"] = updateContents;
//	info["isPreUpdate"] = false;
//	info["needRestart"] = false;
//	info["isFullAPK"] = true;
//	
//	var jsonMsg = JSON.stringify(info);
//	response.writeHead(200, {'content-type': 'application/json', 'Content-Length' : jsonMsg.length});
//	response.end(jsonMsg);
//}
//
//function show(query,response){
//	downloadFile("./tmp/test.png",response,"image/png");
//}


function accessDB(request,response){
	var query = url.parse(request.url).query;
	if(!query || query === ""){
		handleError(500,"AccessDB Null Qurey",response);
		return;
	}
	
	var parsedQurey = queryString.parse(query);
	var action = parsedQurey.action;
	
	var accessDbCb = function(result,msg){
		if(!result){
			handleError(500,msg,response);
		}else{
			response.writeHead(200,{"Content-Type": "text/plain"});
			response.end(msg);
		}
	};
	
	switch(action){
		case "create":
			dbAccess.createData(parsedQurey,accessDbCb);
			break;
		case "find":
			dbAccess.findData(parsedQurey,accessDbCb);
			break;
		case "update":
			break;
		case "delete":
			break;
		default:
			handleError(500,"AccessDB Error : Unkwnown Action.",response);
			break;
	}
}

function defaultHandler(request,response){
	var localpath = "." + request.url;
	fs.stat(localpath, function(error, pathStat){
		if(error){
			handleError(404,"404 Not Found",response);
		}else if(pathStat.isFile()){
			downloadFile(localpath,response);
		}else if(pathStat.isDirectory()){
			list(localpath,response);
		}
	});
}

function downloadFile(path,response){
	console.log("try download file from : " + path);
	
	fs.readFile(path, "binary", function(error, file) {
	    if(error) {
	    	handleError(404,error,response);
	    } else {
	    	response.write(file, "binary");
	    	response.end();
	    }
	});
}

function handleError(errorCode,errorMsg,response){
	console.log("error occured : " + errorCode + "-" + errorMsg);
	
	response.writeHead(errorCode, {"Content-Type": "text/plain"});
    response.write(errorMsg + "\n");
    response.end();
}

//exports.start = start;
//exports.list = list;
//exports.upload = upload;
//exports.show = show;
//exports.download = download;
exports.accessDB = accessDB;
exports.defaultHandler = defaultHandler;
//exports.getPatchInfo = getPatchInfo;

