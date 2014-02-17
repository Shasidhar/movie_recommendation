function Login()
	{
		FB.login(function(response) {
		   if (response.authResponse)
		   {
		   	    var loginButton = document.getElementById('loginButton');
		   	    loginButton.parentNode.removeChild(loginButton);
		   	    var message_span = document.getElementById('topMessageSpan');
		   	    message_span.innerHTML="Movies liked by You and Your friends";
            console.log(response.authResponse.id)
            getAllMoviesOfUser(response.authResponse.id)

  			} else
  			{
  	    	 console.log('User cancelled login or did not fully authorize.');
   			}
		 },{scope: 'email,user_friends'});

 }
function getAllMoviesOfUser(id) {
  FB.api('/'+id+'/friends', function(response) {
            console.log(response.data[227].id)
         
        })
}