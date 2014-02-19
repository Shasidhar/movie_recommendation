var allMovies = new Array();


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
       populateMovies();
})
}
unique = function( arr ){
	return _.uniq( _.collect( arr, function( x ){
		return JSON.stringify( x );
	}));
};

function populateMovies(){
  console.log(allMovies[10].name);
  var uniqueMovies = unique(allMovies);
  var uniqueMovieObjects = uniqueMovies.map(function(obj) { return JSON.pasre(obj)});
  getOnlyEnglishMovies(uniqueMovieObjects);
}

function getOnlyEnglishMovies(uniqueMovieObjects){
var apikey = "6nkt9qb3ggxbd3ejyzsjvq3x";
var baseUrl = "http://api.rottentomatoes.com/api/public/v1.0";
// construct the uri with our apikey
var valid = false;
var rating = 0.0;
var moviesSearchUrl = baseUrl + '/movies.json?apikey=' + apikey;
uniqueMovieObjects.map(function(movie){
		var query = movieName;	
		 // send off the query
  	$.ajax({
	url: moviesSearchUrl + '&q=' + encodeURI(query),
    	dataType: "jsonp",
	success: searchCallback
  	});
	})


// callback for when we get back the results
function searchCallback(data) {
 //console.log(data);
 var movies = data.movies;
 $.each(movies, function(index, movie) {
  if(movie.title.trim.toLowerCase===query.trim.toLowerCase){
	console.log(movie);
   }
 });}
}

