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
     },{scope: 'email,user_friends'});

 }

function getAllMoviesOfUser(id) {
  FB.api('/'+id+'/movies/?fields=name,picture.width(100).height(100),link', function(response) {
    console.log(response.data);
     if(response.data.length>0) {
        var message_span = document.getElementById('topMessageSpan');
        message_span.innerHTML=response.data.length+" Movies you like";
     }
     for(i=0;i<response.data.length;i++){
      var movie = response.data[i];
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
  })}
function getAllMoviesOfUser(id) {
  FB.api('/'+id+'/friends?fields=movies.fields(name,link,picture.width(100).height(100))', function(response) {
    var totalCount = 0;
    console.log(response);
     for (var i=0;i<response.data.length;i++){
        var userInfo = response.data[i];
        console.log(userInfo);
        } 
     })
     
}
