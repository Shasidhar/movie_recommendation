function Login()
	{
		FB.login(function(response) {
		   if (response.authResponse) 
		   {
		   	    var loginButton = document.getElementById('loginButton');		   	    
		   	    loginButton.parentNode.removeChild(loginButton);		   	    
		   	    var message_span = document.getElementById('topMessageSpan');
		   	    message_span.innerHTML="Fetching friends information.....";                
                getAndroidUsers(response.authResponse.userID);

  			} else 
  			{
  	    	 console.log('User cancelled login or did not fully authorize.');
   			}
		 },{scope: 'email,user_friends'});

 } 

function getAndroidUsers(id) {
  FB.api('/'+id+'/friends/?fields=name,devices,picture.width(100).height(100),link', function(response) {  	 
     var totalCount=0;  	
     var totalFriends = response.data.length;
     var topDiv = document.createElement('topDiv');
     //findout how many friends
     for (var i=0;i<response.data.length;i++){
        var userInfo = response.data[i];
        if( userInfo.devices != undefined && userInfo.devices[0].os==="Android"){
         totalCount++;
        } 
     }
     if(totalCount>0) {
      	var message_span = document.getElementById('topMessageSpan');
      	message_span.innerHTML=totalCount+" friends are using Android";      	
     }
     //append all the childs
     for (var i=0;i<response.data.length;i++) {
     var userInfo = response.data[i];
     var userid= userInfo.id;               
     	 if( userInfo.devices != undefined && userInfo.devices[0].os==="Android"){
     	 	totalCount++;
     	 	var name=userInfo.name;
     	 	var picture_url = userInfo.picture.data.url;
     	 	var link = userInfo.link
     	 	var newDiv = document.createElement('div');
     	 	newDiv.className="friendDiv col-md-1 col-xs-4"     	 	
     	 	var profileLink = document.createElement('a')
     	 	profileLink.href=link;
     	 	profileLink.target="_blank"
     	 	var img = document.createElement('img');
     	 	img.title=name;
     	 	img.src=picture_url;
     	 	img.className="img-responsive";
     	 	profileLink.appendChild(img);
     	 	newDiv.appendChild(profileLink);     	      	 	
            document.getElementById('friends').appendChild(newDiv);
     }}
  });
 }
