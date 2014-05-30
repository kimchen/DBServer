var HOST_NAME = "localhost";
var MONGO_DB_PORT = 27017;
var DB_NAME = "kim_database";

var mongojs = require("mongojs");
var dbURL = "mongodb://" + HOST_NAME + ":" + MONGO_DB_PORT + "/" + DB_NAME;
var collections = ["customers","employees","purchase"];
var db = mongojs.connect(dbURL,collections);

var customerStruct = ["_id","name","gender","tel","birth","address"];
var employeeStruct = ["_id","name","gender","eid","tel","birth","address"];

//var mongodb = require("mongodb");
//var mongoServer = new mongodb.Server(HOST_NAME,MONGO_DB_PORT,{auto_reconnect:true,poolsize:10});
//var db = new mongodb.Db(DB_NAME,mongoServer,{safe:false});

var createData = function(parsedQurey, callback) {
	var target = parsedQurey.target;
	switch (target) {
	case "customers":
		var customer = newCustomer(parsedQurey);
		createDataToDB(db.customers, customer, callback);
		break;
	default:
		callback(false, "AccessMongo CreateData Error : Unknown Target.");
		break;
	}

};

var createDataToDB = function(target,data,callback){
	var jsonString = JSON.stringify(data);
	target.save(data,function(error,saved){
		console.log("AccessMongo CreateData target : " + target + "\njsonString : " + jsonString);
		if(error || !saved){
			callback(false,"AccessMongo CreateData Error : insert data failed.");
		}else{
			callback(true,"AccessDB CreateData Successed.");
		}
	});
};

var findData = function(parsedQurey, callback){
	var target = parsedQurey.target;
	switch (target) {
	case "customers":
		db.customers.find({},function(error,datas){
			if(error || !datas){
				callback(false,"AccessMongo FindData Error : cannot find data.");
			}else{
				callback(true,JSON.stringify(datas));
			}
		});
		break;
	default:
		callback(false, "AccessMongo FindData Error : Unknown Target.");
		break;
	}
};

var updateData = function(parsedQurey, callback) {
	var target = parsedQurey.target;
	switch (target) {
	case "customers":
		break;
	default:
		callback(false, "AccessMongo UpdateData Error : Unknown Target.");
		break;
	}
};

var newCustomer = function(parsedQurey){
	var data = {};
	for(var i = 0;i<customerStruct.length;i++){
		var subData = parsedQurey[customerStruct[i]];
		if(subData){
			data[customerStruct[i]] = subData;
		}
	}
	return data;
};

var newEmployee = function(name,gender,eid,tel,birth,address){
	var data = {};
	for(var i = 0;i<employeeStruct.length;i++){
		var subData = parsedQurey[employeeStruct[i]];
		if(subData){
			data[employeeStruct[i]] = subData;
		}
	}
	return data;
};

exports.findData = findData;
exports.createData = createData;
exports.updateData = updateData;