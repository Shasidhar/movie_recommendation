function Login()
	{
		FB.login(function(response) {
		   if (response.authResponse)
		   {
            var movies = new Array(); 
		   	    var loginButton = document.getElementById('loginButton');
		   	    loginButton.parentNode.removeChild(loginButton);
		   	    var message_span = document.getElementById('topMessageSpan');
		   	    message_span.innerHTML="Movies liked by You and Your friends";
            console.log(response.authResponse.userID)
            getAllMoviesOfUser(response.authResponse.userID,movies)
            console.log(movies)
  			} else
  			{
  	    	 console.log('User cancelled login or did not fully authorize.');
   			}
		 },{scope: 'email,user_friends'});

 }
function getAllMoviesOfUser(id,movies) {
  FB.api('/'+id+'/friends', function(response) {
        console.log(response.data[227].id)
        FB.api('/'+response.data[227].id+'/movies',function(resp){
        for(i=0;i<resp.data.length;i++){
          movies.push(resp.data[i])
        }
        })
        })
}