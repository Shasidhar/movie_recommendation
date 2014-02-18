var movies = new Array();
var friendMovies = new Array();
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
  FB.api('/'+id+'/movies/?fields=name,picture.width(100).height(100),link', function(response) {
  for(i=0;i<response.data.length;i++){
         movies.push(response.data[i])
        }
      })
    /*FB.api('/'+id+'/friends', function(response) {
    for(i=0;i<response.data.length;i++){
         friends.push(response.data[i])
        }
      })
   getAllMovies(friends)*/
   FB.api('/'+id+'/friends?fields=movies.fields(name,link,picture.width(100).height(100))', function(response) {
   for(i=0;i<response.data.length;i++){
     if(response.data[i].movies!=undefined){
       friendMovies.push(response.data[i].movies)
        }  
       }
     })
     for(j=0;j<friendMovies.length;j++)
        {
          for(k=0;k<friendMovies[j].data.length;k++){
              console.log(friendMovies[j].data[k])
              movies.push(friendMovies[j].data[k])
              }
          }
        var name=movies[2].name;
     	 	var picture_url = movies[2].picture.data.url;
     	 	var link = movies[2].link
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

}
