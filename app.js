var allMovies = new Array();
var englishMovies = new Array();

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
  var uniqueMovies = unique(allMovies);
  var uniqueMovieObjects = uniqueMovies.map(function(obj) { return JSON.parse(obj)});
  //uniqueMovieObjects.map(function(obj){console.log(obj.name+","+obj.id)}); to print all unique movies
  getOnlyEnglishMovies(uniqueMovieObjects);
}

function getOnlyEnglishMovies(uniqueMovieObjects){
var apikey='&key=AIzaSyACjBHSkJ5s1PlmO_WWclZ2J6IrLLOQplM';
var service_url = 'https://www.googleapis.com/freebase/v1/mqlread?query=';
uniqueMovieObjects.map(function(movie){
	var query='[{"type":"/film/film","language":[],"initial_release_date": {"optional": false,"value": null},"sort": "-initial_release_date.value","name":"'+movie.name+'"}]';
	var url = service_url+query+apikey;
	$.getJSON(url, function(response) {
 	
 		if(response.result.length>0){
 		if(response.result[0].language[0]=="English Language"){
 			// console.log(movie.name); to print all english movies
 			englishMovies.push(movie)
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
 			};
 		}
 		});
})}
