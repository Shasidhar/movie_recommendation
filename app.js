var movies = new Array();
var friends = new Array();
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
   FB.api('/'+id+'/friends', function(response) {
    for(i=0;i<response.data.length;i++){
         friends.push(response.data[i])
        }
      })

for(k=0;k<friends.length;k++){
    FB.api('/'+friends[k].id+'/movies?fields=name,picture.width(100).height(100),link', function(response) {
     console.log(response.data) 
    if(response.data.length>0){
    for(i=0;i<response.data.length;i++){
      console.log(response.data[i])
         movies.push(response.data[i])
        }
      }
    }) 
  }
}
