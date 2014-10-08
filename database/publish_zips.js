var MongoClient = require('mongodb').MongoClient;
var AdmZip = require('adm-zip');
var sys=require("sys");
var fs=require("fs");

exports.fetch_data= function()
{
	var content="[";
	MongoClient.connect("mongodb://localhost:27017/noderssreader", function(err, db) 
	{
		if(!err) {
			console.log("[info] generating json & zip files from database contents");
			var collection = db.collection('feeds');
			collection.find().sort({lastUpdate:-1}).toArray(function(err, items) {
				//console.log(1);
				var x=items;				
	//			var data=JSON.parse(x[0])
				//console.log(x.length);
				for(var i=0;i<x.length;i++)
				{
					//console.log(x[i]);
					//get the items
			 		var obj = JSON.stringify(x[i]);
					var json_object=JSON.parse(obj);
					for(var json_header in json_object){
						if(json_header=="items")			
						{
//							console.log(json_object[json_header]);
							//content+=JSON.stringify(json_object	[json_header]);
							var indiv_obj=JSON.parse(JSON.stringify	(json_object[json_header]));
							//console.log(indiv_obj.length);
							for(fields in indiv_obj)
							{
								//console.log("___________\n\n");
								//console.log(fields);
								//console.log(indiv_obj[fields]);
								content+=JSON.stringify(indiv_obj[fields]);
								if(fields==(indiv_obj.length-1) && i==(x.length-1))
								{
									content+=""
								}
								else
									content+=",";
								/*to be used only if further requirement
								if(fields=="title"||fields=="description")
								{
									console.log(indiv_obj[fields]);
								}*/
							}	
						}
					}
				}
				content+="]";
				var parsed = JSON.parse(content);
				var arr = [];
				for(var z in parsed){	
  					arr.push(parsed[z]);
				}
				//console.log(arr);
				sortByKey(arr, "feeddate", -1);
				var y=JSON.stringify(arr,null,2);
				//console.log(content);
				fs.writeFile(__dirname + '/files'+"/test.json", y, function(err) {
		   			 if(err) {
	      			  	console.log(err);
		    			} else {
						var date_stamp=getDateTime();
		    		    		//console.log("The file was saved!");
						var zip = new AdmZip();
						zip.addLocalFile(__dirname + '/files'+"/test.json");
						zip.writeZip(__dirname + '/files/'+date_stamp+".zip");
						fs.writeFile(__dirname + '/files'+"/info.json", '{"fileName":"'+date_stamp+'.zip"}', function(err1) {
							if(err1){console.log("error in writing to info.json");
								console.log(err1);
								}
							});
						
		   				}
						//delete old files
						fs.readdir(__dirname+'/files',function(err, files){
							if(err){console.log(err);}
							else{
								for(var k=0;k<files.length;k++)
								{
									if(files[k]!=date_stamp+".zip" && files[k]!="info.json" && files[k]!="test.json")
									{
										//delete files
										fs.unlink(__dirname+'/files/'+files[k], function (err) {
      if (err)console.log("Erorr : " + err);
      //console.log('successfully deleted : '+ newPath );
    });
									}
								}
							}
						});

				});
			});
		}
		else
		{	console.log("[error] Error establishing connection to db");
		}
	});
}

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year +  month +  day +  hour + min + sec;

}



function sortByKey(objArray, prop, direction){
	console.log("enter function");
    if (arguments.length<2) throw new Error("sortJsonArrayByProp requires 2 arguments");
    var direct = arguments.length>2 ? arguments[2] : 1; //Default to ascending

    if (objArray && objArray.constructor===Array){

        var propPath = (prop.constructor===Array) ? prop : prop.split(".");
        objArray.sort(function(a,b){
            for (var p in propPath){
                if (a[propPath[p]] && b[propPath[p]]){
                    a = new Date(a[propPath[p]]);
                    b = new Date(b[propPath[p]]);
                }
            }
            // convert numeric strings to integers
           // a = a.match(/^\d+$/) ? +a : a;
            //b = b.match(/^\d+$/) ? +b : b;
            return ( (a < b) ? -1*direct : ((a > b) ? 1*direct : 0) );
        });
    }
}
