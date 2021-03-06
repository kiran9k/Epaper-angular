angular.module('backend', ['ngResource']).
    factory('User', function($resource) {
      var User = $resource('/api/user');
      return User;
    });

angular.module('Freader', ['backend'])
	.config(function ($routeProvider) {
		$routeProvider.
			when("/epaper", {controller: epaperCtrl, template: document.getElementById('epaper').text}).
            when("/", {controller: loginCtrl, template: document.getElementById('loginView').text}).
			otherwise({redirectTo:'/'});
	});

function epaperCtrl($scope,$resource,$location,$window)
{
    
    $scope.text="sndkjnsfdfjs";
    var list_editions;
    var list_dates=["30092014","28092014"];
    var edition_json;
    var date_json;
    $scope.dates=list_dates;
    $scope.mydate=$scope.dates[0];
    $scope.pages;// contains all pages of a section
    $scope.path_name;//the path name for finding files
    var original_path_name;
    $scope.page_image;
    $scope.current_page;
    $scope.text="connecting";
    var valid_flip;

    //load dates for corresponding edition
    function get_dates()
    {
        var load_dates_resource = $resource('/api/edition_dates');
        load_dates_resource.query({edition: $scope.myedition}, function (data) {
            // success handler
            edition_json=data;
            list_dates = [];
            for (var x in data) {
                list_dates.push(data[x]['date']);
            }
            $scope.dates = list_dates;
            $scope.mydate = $scope.dates[0];
            get_date_json();//load the main page upon login

        }, function (error) {
            alert("Error ");
            alert(error);
            // error handler
        });
    }

    //list all editions from the edition.json
    function load_edition()
    {
        var get_edition_resource = $resource('/api/get_edition');
        get_edition_resource.query(function(data) {
            // success handler
            list_editions=[];
            for(var x in data)
            {
                for (var y in data[x]['edition'])
                    list_editions.push(data[x]['edition'][y]);
            }
            $scope.editions=list_editions;
            $scope.myedition=$scope.editions[0];
            get_dates();
        }, function(error) {
            alert("Error ");
            alert(error);
            // error handler
        });

    }

    //get json file contents for a particular date
    function get_date_json()
    {
        var date_json_file_name;
        var date_json_path;
        for(var k=0;k<edition_json.length;k++)
        {
            if(edition_json[k]['date']==$scope.mydate)
            {
                date_json_file_name=edition_json[k]['file_name'];
                date_json_path=edition_json[k]['path'];
                break;
            }
        }
        //alert(date_json_file_name+" "+date_json_path);
        var get_date_json_resource = $resource('/api/date_json');
        //{'date':$scope.mydate,'file_name':date_json_file_name,'path_name':date_json_path}
        get_date_json_resource.query({'date':$scope.mydate,'file_name':date_json_file_name,'path_name':date_json_path},
            function(data) {
            // success handler
                //alert("success");
                date_json=data;
                load_sections();
                load_first_page();
                $scope.download_text="Download PDF ";


            }, function(error) {
            // error handler
            alert("Error ");
            alert(error);

        });
    }

    function load_sections()
    {
        $scope.sections;
        $scope.mysection;
        //load the sections for a particular date
        //alert("load_sections");
        $scope.sections=[];

        //alert(date_json["date"]);
        for(var k=0;k<date_json.length;k++)
        {
            //alert(date_json[k]["section_name"]);
            $scope.sections.push(date_json[k]["section_name"]);
        }
        if($scope.sections.length==0)
        {
            alert("error");
        }
        else{
            $scope.mysection=$scope.sections[0];
            $scope.section_text="Sections :";
            //load the sections in the left main tab
            load_thumbnails($scope.mysection);
        }
    }



    function load_thumbnails(section)
    {
        //alert("load_thumbnails");
        //alert(date_json.length);
        for(var k=0;k<date_json.length;k++)
        {
            if(date_json[k]["section_name"]==section)
            {
                $scope.path_name=date_json[k]["path"];
                original_path_name=date_json[k]["path"];
                //alert("section matched");
                $scope.pages=date_json[k]["pages"];

            }
        }

        //search the sections in date_json
        //get list_of pages & load thumbnails . Also load the first page

    }

    $scope.initialize=function(){
        $scope.text="connected1";
        load_edition();
    }

    $scope.load_orignal_page=function(a)
    {
        //loads the page content from given thumbnail
        //alert("load page");
        //alert(a);
        var page_flip=$scope.page_image;
        $("#loadImg").append('<img src="'+page_flip+'" id="flip_image" style="position: absolute;left: 0px;top: 0px"></img>')
        var image_width=$("#flip_image").width();
        var image_height=$("#flip_image").height();
        var myInterval = setInterval(function() {

            image_width=image_width-100;

            if(image_width>=0 )
                $('#flip_image').css({"width":image_width,"height":image_height});
            else
            {
                window.clearInterval(myInterval);
                $("#flip_image").remove();
            }
        }, 50);
        $scope.current_page=a;
        $scope.page_image=$scope.path_name+a.image;

    }

    $scope.load_page=function(){
        /*
        Action for GO () button
         */

        //alert("laoding the required page"+"\nedition : "+$scope.myedition+"\ndate: "+$scope.mydate+"\n "+date_json_file_name+" "+ date_json_path);
        get_date_json();
        //alert("loading json for reqested date");
    }

    $scope.section_change=function(){
        alert("section_chang");
        alert($scope.mysection);
        load_thumbnails($scope.mysection);

    }

    function load_first_page(section)
    {
        //$scope.current_page=$scope.pages[0];
        $scope.load_orignal_page($scope.pages[0])
    }

    function search_for_page_no(page_no)
    {
        //alert("search for page");
        //alert($scope.pages.length);
        var flag=false;
        //alert(page_no);
        for(var k=0;k<$scope.pages.length;k++)
        {
            if($scope.pages[k]['page_no']==page_no)
            {
                /*
                Page no found ! load the page
                 */
                $scope.current_page=$scope.pages[k];
                $scope.page_image=$scope.path_name+$scope.current_page['image'];
                flag=true;
                valid_flip=true;
                return;
               // alert($scope.path_name+$scope.current_page['image']);
            }
        }
        if(!flag)
        {
            valid_flip=false;
            if(page_no==0)
                alert("You are viewing the first page!")
            else
                alert("You are viewing the last page!")
        }
    }

    function flipaction()
    {
        image_width=image_width-100;
        alert(timer_var);
        if(image_width>=0)
            $('#main_image').css({"width":image_width,"height":image_height});
        else
        {

            //clear the interval
            // alert("clear");
            $('#main_image').css({"width":'',"height":''});
           /* var current_page=$scope.current_page.page_no;
            current_page++;
          //  alert(current_page);
            //alert(current_page);
            search_for_page_no(current_page);*/
            timer_var=clearInterval(timer_var);
            alert(timer_var);

            //load the next pge
        }

    }

    $scope.next_page=function()
    {
       // alert(JSON.stringify($scope.current_page));
        /*
        funciton handling next button clicks
         */

        //create  a temp image
       // alert($scope.page_image);
        var page_flip=$scope.page_image
        $("#loadImg").append('<img src="'+page_flip+'" id="flip_image" style="position: absolute;left: 0px;top: 0px"></img>')
        var image_width=$("#flip_image").width();
        var image_height=$("#flip_image").height();
        var myInterval = setInterval(function() {

            image_width=image_width-100;

            if(image_width>=0 && valid_flip)
                $('#flip_image').css({"width":image_width,"height":image_height});
            else
            {
                window.clearInterval(myInterval);
                $("#flip_image").remove();
            }
        }, 50);
        var current_page=$scope.current_page.page_no;
        current_page++;
        search_for_page_no(current_page);
    }

    $window.highlight=function(a)
    {
        var elements=document.getElementsByClassName(a);//.style.background = "Black";
        for(var i=0;i<elements.length;i++)
        {
            elements[i].style.border="2px solid blue";
        }
    }
    $window.unhighlight=function(a)
    {
        var elements=document.getElementsByClassName(a);//.style.background = "Black";
        for(var i=0;i<elements.length;i++)
        {
            elements[i].style.border="none";
        }
    }

    $scope.prev_page=function()
    {
        /*
         funciton handling previos page button clicks
         */
        //create a atemp element
        var page_flip=$scope.page_image;
        $("#loadImg").append('<img src="'+page_flip+'" id="flip_image" style="position: absolute;left: 0px;top: 0px"></img>')
        var image_width=$("#flip_image").width();
        var image_height=$("#flip_image").height();
        var hspace_prop=0;//$("#flip_image").hspace();
        var myInterval = setInterval(function() {

            image_width=image_width-100;
            hspace_prop=hspace_prop+100;

            if(image_width>=0 && valid_flip)
                $('#flip_image').css({"width":image_width,"height":image_height,"left":hspace_prop});
            else
            {
                window.clearInterval(myInterval);
                $("#flip_image").remove();
            }
        }, 50);
        var current_page=$scope.current_page.page_no;
        current_page--;
        search_for_page_no(current_page);
    }
    $scope.load_article=function(article)
    {
       if(article.path_name)
        {
            $scope.path_name=article.path_name;
        }
        else
        {
            $scope.path_name=original_path_name;
        }
        var image_file=$scope.path_name+article["jpeg"];
        var pdf_file=$scope.path_name+article["pdf"];
        var myWindow = window.open('','', 'width=500,height=500,scrollbars=1');
        var html='<script src="jquery-1.6.2.min.js"></script><table width="100%" height="10%" border="0"><tr width="100%" height="100%"><td width="33%"><button width="200px" onclick="load('+"'text'"+')" >text</button></td><td width="33%"><button onclick="load('+"'img'"+')" width="100%" >image</button></td><td width="33%"><button onclick="load('+"'pdf'"+')" width="100%" >pdf</button></td></tr></table><div id="article_container" width="100%" height="90%"></div>';
        myWindow.document.write(html);
        var script='<script type="text/javascript">';
        script+='function load(a){$("#article_container").empty();';
        script+='if(a=="text"){$("#article_container").append("'+article["article_txt"]+'")}';
        script+='else if(a=="img"){$("#article_container").append('+"'"+'<img src="'+image_file+'" width="400px">'+"'"+');}';
        script+='else{$("#article_container").append('+"'"+'<embed src="'+pdf_file+'" width="100%" height="100%">'+"'"+');}';
        script+="}load('img')</script>";
        myWindow.document.write(script);

        //myWindow.document.write('<div id="download_pdf" width="100%" height="30px"><a href= "'+pdf_file+'" >Download as PDF</a></div>');
        //myWindow.document.write("<p><img src="+image_file+" width='400' /></p>");
        //myWindow.document.write('<embed src="'+pdf_file+'" width="100%" height="100%">');
        myWindow.document.close();
        myWindow.focus();
        //myWindow.close();

        // load article id to db
        $resource('/api/article').save({article_id: article["article_no"]}, function () {

        },function(err)
        {
            console.log("Error in writing user clickstream to db ");
        });


    }

    $scope.edition_change=function(){
        //load dates
        get_dates();

    }
    $scope.date_change=function(){
        //alert("date changed");
        //alert("new date:"+$scope.mydate);
    }

    $scope.logout=function()
    {
        $resource('/api/login').delete({}, function () {
            connected = false;
           /* if(logged_in=="google")
            {
                new Image().src = "https://accounts.google.com/logout";

            }
            else if(logged_in="facebook")
            {
                alert("facebook");
                alert(FB);
                var x=Object.keys(FB);

                FB.logout(function(resp)
                {
                    alert("logged out");
                });


            }*/
            //window.location="/";
            //$location.path("/");

        });

        window.location="/";


    }
    if(connected==false) {
        alert("Please login to continue");
        window.location="/";
    }


    function list_keys(a)
    {
        var x=Object.keys(a);
        for (var y in x)
        {
            alert(x[y]);
        }
    }
    //hide the search container initially
    $('.search-container').hide();
    $('.search-result-container').hide();
    $('.advanced-search-container').hide();

    $scope.show_search_container=function()
    {
        //$('.search-result-container').hide();
        $('.advanced-search-container').hide();
        $('.search-container').toggle();
        $('.search-result-container').hide();
        $('.advanced-search-container').hide();
    };

    function get_dates_for_edition(edition_name)
    {
        var load_dates_resource = $resource('/api/edition_dates');
        load_dates_resource.query({edition:edition_name}, function (data) {
            // success handler
            edition_json=data;
            list_dates = [];
            list_dates.push("All");
            for (var x in data) {
                list_dates.push(data[x]['date']);
            }
            $scope.search_dates=list_dates;
            $scope.advanced_search_date=$scope.search_dates[0];
        }, function (error) {
            alert("Error ");
            alert(error);
            // error handler
        });
    }

    $scope.advanced_search_edition_change=function()
    {
        if($scope.advanced_search_edition=="All")
            get_dates_for_edition($scope.search_editions[0]);
        else
            get_dates_for_edition($scope.advanced_search_edition);
    }
    $window.advanced_search_enable=function()
    {
        $('.advanced-search-container').toggle();
        $('.search-container').hide();
        var search_editions=$scope.editions.slice(0);
        search_editions.push("All");
        $scope.search_editions=search_editions;
        $scope.advanced_search_edition=$scope.search_editions[$scope.search_editions.length-1];
        get_dates_for_edition($scope.search_editions[0]);

    }

    $window.reset_advanced_search=function()
    {
        $scope.advanced_search_edition=$scope.search_editions[$scope.search_editions.length-1];
        $scope.advanced_search_date=$scope.search_dates[0];
        $(".advanced_search_form")[0].reset();
    }

    $scope.search=function()
    {
        var key=$scope.search_key;

        //hide the search element after

        $('.search-container').hide();
        $('.search-result-container').show();

        $scope.search_articles=json_search(key);

    };

    json_search=function(search)
    {
        /*
        Search method for searching in current date &  current edition
         */

        //var search="sdfsdfs img";
        var result=[];
        var search_keys=search.split(/\s+/);
        //get sections
        for (var i=0;i<$scope.pages.length;i++)
        {
            //got the page
            var current_page=$scope.pages[i];
            //list_keys(current_page);
            for(var j=0;j<current_page.articles.length;j++)
            {
                //got the article
                var current_article=current_page.articles[j];
                //list_keys(current_article);
                //alert(current_article.article_txt);
                for(var k=0;k<search_keys.length;k++)
                {
                    //alert(search_keys[k]);
                    //alert(current_article.article_txt.toLowerCase().search(search_keys[k]));
                    if(current_article.article_txt.toLowerCase().search(search_keys[k])>=0)
                    {
                       // alert("key found "+search_keys[k]);

                        if(result.indexOf(current_article)==-1) {
                            result.push(current_article);
                        }
                    }
                }
            }
        }
        return result;

    }

    $scope.advanced_search=function()
    {

        var key=$scope.advanced_search_key;
        var search_edition=$scope.advanced_search_edition;
        var search_date=$scope.advanced_search_date;
        //alert(key+search_edition+search_date);
        //handle the search with nodjs
        var search=
        {
            key:key,
            edition:search_edition,
            date:search_date
        };

        $resource('/api/advanced_search').get(search, function(data1){
            console.log("success");

            if(data1['result']) {
                if(data1['result'].length>0)
                {
                    alert("keyword found");
                    $scope.search_articles=data1['result'];

                }
                else
                {
                    // given keyword not present
                    $scope.search_articles=[];
                    alert("keyword not found");
                }
                $('.search-result-container').show();
                $('.advanced-search-container').hide();


            }
            else
            {
                alert("Search is unable to complete .Please try again later");

            }



        }, function(e){
            //error
            alert("errro");
            alert(e);
        });
    };
    advanced_search_success=function(data)
    {
        alert("succes");
        //alert(data.length);
    }

    advanced_search_fail=function()
    {
           alert("fail");

    }

    close_search_results=function(){
        $('.search-result-container').hide();
    }

}

function loginCtrl($scope, $resource, $location,$window) {



	if (connected)
		return $location.path("/epaper");

	var action = "login";
	var loginText = {
		action: "Login",
		changeAction: "No account ? Register here"
	};
	var registerText = {
		action: "Register",
		changeAction: "Already have an account ? Login here"
	};

	$scope.text = (action == "login") ? loginText : registerText;

	$scope.changeAction = function() {
		action = (action == "login") ? "register" : "login";
		$scope.text = (action == "login") ? loginText : registerText;
	};

	$scope.action = function() {
		delete $scope.errorMsg;
		var infos = {
			email: $scope.email,
			password: $scope.password,
            name:''
		};
		if (action == "login")
			$resource('/api/login').get(infos, actionSuccess, actionFail);
		else
			$resource('/api/user').save(infos, actionSuccess, actionFail);
	};
    actionSuccess = function() {
        logged_in="email";
		connected = true;
		$location.path("/epaper");
	};
    load_error_msg=function(a)
    {
        alert("loade rror ms");
        $scope.errorMsg=a;
    };
	actionFail = function(response) {
        var a;
		if (response.status==401) {
            $scope.errorMsg = "Wrong email or password";
            a="Wrong email or password";
        }
		else if (response.status==409){
			$scope.errorMsg = "Email already registered";
            a="Email already registered";
        }
		else{
			$scope.errorMsg = "Can't connect to server";
            a="Can't connect to server";
        }
        alert(a);
        //load_error_msg(a);

	}


    /*
    google login begins
    Info stored : NAme, email & password = password
     */
    $scope.google_login=function(){

        var myParams = {
            'clientid' :'1056095437568-mlf4257ad2agjqpf4f79ssfbv21iv2vk.apps.googleusercontent.com',
            'cookiepolicy' : 'single_host_origin',
            'callback' : 'loginCallback',
            'approvalprompt':'force',
            'scope' : 'email'
        };
        //first_time_google=false;


            gapi.auth.signIn(myParams);



    }

    var google_infos;
    $window.loginCallback= function(result) {

        gapi.client.setApiKey('AIzaSyAZFMGH_WIKH8vKyS_DSgGX9K_2ZmvjFro');
        gapi.client.load('plus', 'v1').then(function () {

                var request = gapi.client.plus.people.get({
                    'userId': 'me'
                });

                request.execute(function (resp) {

                    var email = '';
                    if (resp['emails']) {
                        for (i = 0; i < resp['emails'].length; i++) {

                            if (resp['emails'][i]['type'] == 'account') {
                                email = resp['emails'][i]['value'];

                                break;
                            }
                        }
                        var name=resp['displayName'];

                        if(name=='')
                        {
                            name="none";
                        }

                        google_infos = {
                            email:email,
                            password: 'password',
                            name:name
                        }
                        $resource('/api/user').save(google_infos, glogin_success, glogin_fail);
                    }
                    else
                    {
                        alert("The email is not Authenticated . Please try again ")
                    }
                });
            },
            function (reason) {
                console.log('Error: ' + reason.result.error.message);
            });
    }
    function glogin_success()
    {
        connected = true;
        alert("login success");
        logged_in="google";
        $location.path("/epaper");
    }
    glogin_fail = function (response) {
        if (response.status == 401)
            $scope.errorMsg = "Wrong email or password";
        else if (response.status == 409) {
            $resource('/api/login').get(google_infos, glogin_success, glogin_fail);
        }
        else
            $scope.errorMsg = "Can't connect to server";
        console.log('Failed to login !');
    }

    /*
    Google login ends here
     */


    /*
    fb login begins

     */


    var fb_infos;

    $window.fb_login =function(){
        FB.login(function(response) {
            if (response.status === 'connected') {
                if (response.authResponse) {
                    FB.api('/me', function(response) {
                        user_email = response.email; //get user email
                        var name=response.name;
                        if(!user_email)
                        {
                            alert("The email is not Authenticated . Please try again ");
                        }
                        else
                        {
                            fb_infos = {
                                email:user_email,
                                password: 'password',
                                name:name
                            };
                            $resource('/api/user').save(fb_infos, fblogin_success, fblogin_fail);
                        }
                    });

                } else {
                    //user hit cancel button
                    console.log('User cancelled login or did not fully authorize.');

                }
            }
            else
            {
                FB.login();
            }
        }, {
            scope: 'publish_stream,email'
        });
    }

    function fblogin_success()
    {
        alert("login success");
        connected = true;
        logged_in="facebook";
        $location.path("/epaper");
    }
    fblogin_fail = function (response) {


        if (response.status == 401) {
            $scope.errorMsg = "Wrong email or password";

        }
        else if (response.status == 409) {
            $resource('/api/login').get(fb_infos, fblogin_success,fblogin_fail);
        }
        else
        {
            $scope.errorMsg="cannot connect to server";
        }

    }


    window.fbAsyncInit = function() {
        FB.init({
            appId      : '570258479768451',
            cookie     : true,  // enable cookies to allow the server to access
            // the session
            channelUrl : 'http://localhost:3000/', // Channel File
            xfbml      : true,  // parse social plugins on this page
            version    : 'v2.1' // use version 2.1
        });

    };
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";

        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    /*
    fb login ends
     */
}
/*
function feedsCtrl($scope, $resource, $location) {
	if (!connected)
		return $location.path("/");


	$scope.disconnect = function() {
		$resource('/api/login').delete({}, function () {
			connected = false;
			$location.path("/");
		});
	}

	$scope.feeds = $resource('/api/feeds').query();

	$scope.addFeed = function() {
		$scope.addFeedLoading = true;
		var newFeed = $resource('/api/feed').save({url: $scope.newFeedUrl}, function () {
			console.log("Feed added !");
			delete $scope.addErrorText;
			$scope.feeds.push(newFeed);
			$scope.showNewFeed = false;
			$scope.newFeedUrl = "";
			$scope.addFeedLoading = false;
		}, function (response) {
			if (response.status == 400)
				$scope.addErrorText = response.data;
			else
				$scope.addErrorText = "Cannot connect to server";
			$scope.addFeedLoading = false;
		});
		return true;
	}

	$scope.deleteFeed = function(feed) {
		$resource('/api/feed/' + feed._id).delete({}, function() {
			var indexof = $scope.feeds.indexOf(feed);
			$scope.feeds.splice(indexof, 1);
		});
	}

}*/
