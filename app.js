var allMovies = new Array();
function Login()
  {
    FB.login(function(response) {
       if (response.authResponse)
       {
            var loginButton = document.getElementById('loginButton');
            loginButton.parentNode.removeChild(loginButton);
            var message_span = document.getElementById('topMessageSpan');
            message_span.innerHTML="Movies liked by You and Your friends";
            console.log(response.authResponse.userID);
            getAllMoviesOfUser(response.authResponse.userID);
            getAllMoviesOfUserFriends(response.authResponse.userID);
        } else
        {
           console.log('User cancelled login or did not fully authorize.');
        }
     },{scope: 'email,user_friends,friends_likes'});

 }

function getAllMoviesOfUser(id) {
  FB.api('/'+id+'/movies/?fields=name,picture.width(100).height(100),link',null,null, function(response) {
     for(i=0;i<response.data.length;i++){
      var movie = response.data[i];
            allMovies.push(movie);
     }
  })}

function getAllMoviesOfUserFriends(id) {
  FB.api('/'+id+'/friends?fields=movies.fields(name,link,picture.width(100).height(100))',null,null, function(response) {
    var totalCount = 0;
    for(i=0;i<response.data.length;i++){
     if(response.data[i].movies!=undefined){
         var userMovies = response.data[i].movies;
          for(j=0;j<userMovies.data.length;j++){
            allMovies.push(userMovies.data[j]);
          }
        }  
       }
       getOnlyEnglishMovies();
})
}

function getOnlyEnglishMovies(){
  console.log(allMovies[10].name);
}
