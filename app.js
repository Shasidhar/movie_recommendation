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
    console.log(response.data.length);
     if(response.data.length>0) {
      	var message_span = document.getElementById('topMessageSpan');
      	message_span.innerHTML=response.data.length+" Movies you like";
     }
   
           for(k=0;k<response.data.length;k++){
             console.log("inside k"+response.data[k])
              var allMovies = response.data[k];
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
         

       })}
