var allMovies = new Array();
var validMovies = new Array();

function Login()
  {
    FB.login(function(response) {
       if (response.authResponse)
       {
            var loginButton = document.getElementById('loginButton');
            loginButton.parentNode.removeChild(loginButton);
            var message_span = document.getElementById('topMessageSpan');
            message_span.innerHTML="Fetching movie information...";
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
unique = function( arr ){
	return _.uniq( _.collect( arr, function( x ){
		return JSON.stringify( x );
	}));
};

function getOnlyEnglishMovies(){
  console.log(allMovies[10].name);
  var uniqueMovies = unique(allMovies);
  /*var movies = allMovies.map(function(obj) { return obj.id; });
  movies = movies.filter(function(v,i) { return movies.indexOf(v) == i; });*/
  var messagespan = document.getElementById('topMessageSpan');
  messagespan.innerHTML="Total movies liked by you and your friends are "+uniqueMovies.length;
  
  for(i=0;i<uniqueMovies.length;i++){
      var movie = JSON.parse(uniqueMovies[i]);
      validMovies.push(movie);
      var name=movie.name;
               var picture_url = movie.picture.data.url;
               var link = movie.link
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
}
