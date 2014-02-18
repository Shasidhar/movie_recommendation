var movies = new Array();
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
         movies.push(response)
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
         movies.push(response.data[i].movies)
        }  
       }
     })
     console.log("movies length"+movies.length);
      for(j=0;j<movies.length;j++)
        {
          console.log(j);
          for(k=0;k<movies[j].data.length;k++){
              console.log(movies[j].data[k])
              allMovies.push(movies[j].data[k])
              }
          }
          
          for(i=0;i<allMovies.length;i++){
        var name=allMovies[i].name;
               var picture_url = allMovies[i].picture.data.url;
               var link = allMovies[i].link
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
