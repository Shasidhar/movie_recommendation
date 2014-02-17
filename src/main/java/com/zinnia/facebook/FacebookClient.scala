package com.zinnia.facebook

import java.lang.String
import scala.Predef.String
import com.google.code.facebookapi.{FacebookXmlRestClient, FacebookParam, FacebookJsonRestClient}
import javax.servlet.http.{HttpServlet, HttpServletResponse, HttpServletRequest}

/**
 * Created with IntelliJ IDEA.
 * User: Shashi
 * Date: 17/2/14
 * Time: 12:25 PM
 * To change this template use File | Settings | File Templates.
 */

class FacebookClient extends HttpServlet {
  val API_KEY : String = "351669804975495";
  val SECRET : String = "cecfbf80c958a31a532aa2c1809bf78e";

  override def doGet(request:HttpServletRequest,response:HttpServletResponse){
    response.setContentType("text/html")
    try
    {
      val out = response.getWriter

      //facebook login mechanism give you by http parameter the session key
      //needed for client api request.
      val sessionKey : String = request.getParameter(FacebookParam.SESSION_KEY.toString())

      //initialize a facebook xml client (you can choose different client version: xml, jaxb or json)
      //the init is done by apiKey, secretKey and session key previosly requested
      val client : FacebookXmlRestClient  = new FacebookXmlRestClient(API_KEY, SECRET, sessionKey)


      //This code line obtain the user logged id
      val uid : Long= client.users_getLoggedInUser()

      //print user info.
      response.getWriter.println("uid:"+uid.toString+"\n client:"+client.toString+"\nsessionKey:"+sessionKey)
    }

  }

}
