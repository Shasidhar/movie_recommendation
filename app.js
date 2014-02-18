var movies = new Array(); 
function Login()
	{
		FB.login(function(response) {
		   if (response.authResponse)
		   {
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
  FB.api('/'+id+'/movies', function(response) {
  for(i=0;i<response.data.length;i++){
        console.log(response.data[i])
        movies.push(resp.data[i])
        }
      })

 FB.api('/1652537756/friends?fields=movies', function(response) {
  for(i=0;i<response.data.length;i++){
        console.log(response.data[i].movies)
        for(j=0;j<response.data[i].movies.length;j++){
        movies.push(response.data[i])}
        }
      })
}