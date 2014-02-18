var allMovies = new Array(); 
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
            getAllMoviesOfUser(response.authResponse.userID)
           
  			} else
  			{
  	    	 console.log('User cancelled login or did not fully authorize.');
   			}
		 },{scope: 'email,user_friends'});

 }
function getAllMoviesOfUser(id) {
  FB.api('/'+id+'/movies', function(response) {
  for(i=0;i<response.data.length;i++){
        console.log(response.data[i])
        allMovies.push(response.data[i])
        }
      })

 FB.api('/'+id+'/friends?fields=movies', function(response) {
  for(i=0;i<response.data.length;i++){
        console.log(response.data[i].movies)
        allMovies.push(response.data[i].movies)
      }
    })
}