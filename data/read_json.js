  function load_data()
   {
		alert("sdfsdfS");
	  // $("ul").empty();  
	   var my_date=new Date();
	   $.getJSON('sa/12/edition.json', function(data) 
		{
  			alert(data);
		});
	}
	   		/*$.each(data, function(key, val) 
	   		{
	   			//alert(typeof val);
	   			//var x=jQuery.parseJSON(val);
	   			$('ul').append("<hr><br><br>");
	   			$('ul').append('<li id="'+key+'">');
	   			var id=0;
	   			var title="";
	   			$.each(val, function(key1, val1) 
	   			{
	   				//alert(val1);
	   				id++;
	   				if(key1=="urm_source"|| key1=="_id")
	   				{
	   					
	   					return true;
	   				}
	   				if(id==1)
	   				{
	   					title=val1;	   					
	   					//$('ul').append('<h4 style="color:red"><div id="' + val1 + '">' + val1 + '</div><br>');
	   				}
	   				else if(id==2)
	   				{
	   					$('ul').append('<h4 style="color:red"><div id="'+val1+'" onClick="loadInAppPage('+"'"+val1+"'"+')">'+ title+ '</div></h4><br>');
	   					//$('ul').append('<button id="'+val1+'">'+ 'Link to NEWS' + '</button><br>');
	   				}
	   				else if(id==4)//pubdate
	   				{
	   					var date=new Date(val1);
	   					var diffMs;
	   					if(my_date>date)
	   						diffMs = (my_date - date)/1000; // milliseconds between now & Christmas
	   					else
	   						diffMs = 0;// -(my_date - date)/1000;
	   					var diffDays = Math.floor(diffMs / 86400); // days
	   					var diffHrs = Math.floor((diffMs / 3600)%24); // hours
	   					var diffMins = Math.round(((diffMs / 60)%60)); // minutes
	   					if(diffMins<10)
	   						{
	   							diffMins='0'+diffMins;
	   						}
	   					if(diffDays!=0)
	   						{
	   							diffHrs+=(diffDays*24);
	   						}
	   					if(diffHrs==0)
	   					{
	   						$('ul').append('<p><div id="Timestamp" style="font-size:15">Updated  '+diffMins+' minutes ago</div></p>');
	   					}
	   					else
	   					{
	   						$('ul').append('<p><div id="Timestamp" style="font-size:15">Updated  '+diffHrs+" hours and "+diffMins+' minutes ago</div></p>');	
	   					}
	   					
	   				}
	   				else
	   					$('ul').append('<p><div id="' + key1 + '">'+  val1 + '</div></p><br>');  				
	   			});
	   			$('ul').append('</li><br><br>');	                                                            
	   		});
	   	}
	   );
   }*/
