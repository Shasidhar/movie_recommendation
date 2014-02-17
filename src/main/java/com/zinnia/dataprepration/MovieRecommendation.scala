package com.zinnia.dataprepration

import org.apache.spark.SparkContext
import org.apache.spark.mllib.recommendation.{MatrixFactorizationModel, ALS, Rating}
import org.apache.spark.rdd.RDD
import org.apache.spark.SparkContext.rddToPairRDDFunctions
import com.zinnia.algorithms.Kmeans
import org.apache.spark.mllib.util.MLUtils

/**
 * Created with IntelliJ IDEA.
 * User: Shashi
 * Date: 13/2/14
 * Time: 7:26 PM
 * To change this template use File | Settings | File Templates.
 */


object UserRecommendations {
  def main(args: Array[String]) {
    val sc = new SparkContext("local","userratings")
    val userRatings = new MovieRecommendation(sc)
    val dataTuple = userRatings.preprocessing("src/main/resources/netflix_ratings.txt","src/main/resources/movie-titles.txt")
    val ratingsData = dataTuple._1.cache()
    val movieData = dataTuple._2.cache()
    val recommendationModel = userRatings.getALSModel(ratingsData,5,10)
    val newUserRatings = Array[(Int,Double)]((4,3.0),(89,4.0),(25,1.0),(134,2.0),(486,4.0),(215,5.0),(365,4.0))
    val productClusters = userRatings.getProductClusters(recommendationModel.productFeatures)
    val usercluster = userRatings.getUserCluster(productClusters._1,newUserRatings)
    val topMoviesForNewUser = userRatings.getMoviesForCluster(usercluster,productClusters._1,movieData,recommendationModel.productFeatures)
    val unwatchedTuple = userRatings.getUserUnwatchedTuple(ratingsData,1488844)
    val recommendations = userRatings.getRecommendations(unwatchedTuple,recommendationModel,movieData)
    println("hi")
  }
}

class MovieRecommendation(sc:SparkContext) {
  /**
   *
   * @param ratingsFilePath - path for user ratings file
   * @param movieFilePath - path for the movies,titles mapping file
   * @return - returns the RDD of tuple (parsedData:RDD[Rating],movieData:RDD[(movieId:Int,movieName:String)]
   */
  def preprocessing(ratingsFilePath:String,movieFilePath:String) : (RDD[Rating],RDD[(Int,String)])={
    val inputData = sc.textFile(ratingsFilePath)
    val parsedData = inputData.map(line=>{
      val fields = line.substring(5,line.length-1).split(";")
      fields
    }).flatMap(lines=>lines).map(eachrow=>{
      val rowData = eachrow.split(",")
      rowData
    }).filter(a=>if(a.length>2)true else false).map(reqData=>Rating(reqData(2).toInt,reqData(1).trim.toInt,reqData(3).toDouble))
    val movieData = sc.textFile("src/main/resources/movie-titles.txt").map(movies=>{
      val movieTuple = movies.split(",")
      (movieTuple(0).toInt,movieTuple(2))
    })
    (parsedData,movieData)
  }

  /**
   *
   * @param parsedData- RDD[Rating]
   * @param features - number of features to be kept for model
   * @param iterations - number of iterations to train the model
   * @return - returns MatrixFactorizationModel
   */
  def getALSModel(parsedData:RDD[Rating],features:Int,iterations:Int):MatrixFactorizationModel={
    ALS.train(parsedData,features,iterations)
  }

  /**
   *
   * @param userClusterTuple- Tuple of (clusterId,seq[movies watched by user in that cluster])
   * @param movieClusterTuple - Tuple of (movie_Id,cluster_Id)
   * @param movieData - Tuple of movieData:RDD[(movieId:Int,movieName:String)
   * @param productFeatures -  Tuple of (movieId,Array[productFeatures trained from the ALS model])
   * @return - returns RDD[movies recommended for user]
   */
  def getMoviesForCluster(userClusterTuple:RDD[(Int,Seq[Int])],movieClusterTuple:RDD[(Int,Int)],movieData:RDD[(Int,String)],productFeatures:RDD[(Int,Array[Double])]):RDD[String]={
    val userMovies = userClusterTuple.map(a=>a._2.toArray).flatMap(a=>a).map(a=>(a,null))
    val clusterMovieTuple = movieClusterTuple.map(a=>(a._2,a._1))
    val temp = clusterMovieTuple.join(userClusterTuple).map(a=>(a._2._1,null))
    val allMovies = temp.join(productFeatures).map(a=>(a._1,a._2._2))
    val userMovieFeatures = userMovies.join(productFeatures).map(x=>(x._1,x._2._2))
    val nearestPoints = getNearestNeighbours(allMovies,userMovieFeatures)
    val requiredMovies = nearestPoints.map(a=>(a,null))
    val recommendedMovies = requiredMovies.join(movieData).map(_._2._2)
    recommendedMovies
  }

  /**
   *
   * @param allMovies- Tuple of (movieId,Array[productFeatures trained from the ALS model]) for the movies watched by user in the  cluster
   * @param userMovies - Tuple of (movieId,Array[productFeatures trained from the ALS model]) for the all the movies in the cluster
   * @return - returns RDD[movieId's recommended for the user]
   */

  def getNearestNeighbours(allMovies:RDD[(Int,Array[Double])],userMovies:RDD[(Int,Array[Double])]) :RDD[Int]={
     val resultant =  userMovies.cartesian(allMovies)
     val distances = resultant.map(element => {
       (element._1._1,element._2._1,MLUtils.squaredDistance(element._1._2,element._2._2))
     }).groupBy(_._1)
     val shortestDistance = distances.map(ele=>{
        val distanceTuple = ele._2.toArray.sortBy(_._3)
        val shortestElement = distanceTuple(1)
       (ele._1,shortestElement._2,shortestElement._3)
     })
    val output = shortestDistance.map(ele=>ele._2)
     output
  }

  /**
   * @param input- RDD[Rating]
   * @param userId - userID
   * @return - returns RDD(userId,Array[All the movies unwatched by the user])
   */
  def getUserUnwatchedTuple(input:RDD[Rating],userId:Int):RDD[(Int,Array[Int])]={
    val validData = input.filter(ele=>if(ele.user==userId)true else false).map(a=>a)
    val pairedData = validData.map(a=>(a.user,a.product)).groupByKey
    val unwatchedRdd = pairedData.map(pairedrow=>{
      val moviesArray = new Array[Int](499)
      pairedrow._2.map(i=>moviesArray(i)=1)
      val unwatchedList = moviesArray.zipWithIndex.filter(a=>if(a._1==0)true else false).map(a=>(a._2+1))
      (pairedrow._1,unwatchedList)
    })
    unwatchedRdd
  }

  /**
   * @param productMappings- RDD[ProductId,ClusterId]
   * @param userProducts - Array[productId, rating]
   * @return - returns RDD(clusterId,Array[All the movies watched by user in that cluster])
   */
  def getUserCluster(productMappings:RDD[(Int,Int)],userProducts:Array[(Int,Double)]) :RDD[(Int,Seq[Int])]={
   val userData = sc.makeRDD(userProducts)
   val clusterRDD =  productMappings.join(userData).map(a=>(a._2._1,a._1)).groupByKey()
    val data = clusterRDD.map(a=>(a._2.length,a._1)).toArray().sortBy(-_._1)
    val clusters = clusterRDD.filter(a=>if(a._1==data(0)._2)true else false)
    clusters
  }

  /**
   * @param productFeatures- RDD of all product features in RDD[(Int,Array[features])]
   * @return - Tuple of (RDD[ProductId,clusterID],RDD[clusterId,clusterCentroids])
   */
  def getProductClusters(productFeatures:RDD[(Int,Array[Double])]):(RDD[(Int,Int)],RDD[(Int,Array[Double])])={
    val kmeansInput = productFeatures.map(a=>a._2)
    val customKmeans = new Kmeans
    val productMappings = customKmeans.mapCentroidForEachCluster(customKmeans.getCentroids(kmeansInput,5),productFeatures)
    val mappedProductClusters = productMappings.map(a=>(a._2,a._1))
    val clusterMappings = productMappings.map(a=>(a._1,a._3)).distinct()
    (mappedProductClusters,clusterMappings)
  }

  /**
   * @param userUnwatchedTuples - RDD(userId,Array[All the movies unwatched by the user])
   * @param model - MatrixFactorizationModel
   * @param movieData - Tuple of movieData:RDD[(movieId:Int,movieName:String)
   * @return - returns RDD[movies recommended for user]
   */
  def getRecommendations(userUnwatchedTuples:RDD[(Int,Array[Int])],model:MatrixFactorizationModel,movieData:RDD[(Int,String)]):RDD[String]={
     val recMovieIds = userUnwatchedTuples.first()._2.map(a=>{
       val prediction = model.predict(userUnwatchedTuples.first()._1,a)
       (a,prediction)
     }).sortBy(a=>{-a._2}).take(20)
     val unwatchedMovies = recMovieIds.map(a=>{(a._1,a._2)})

     val recMovies =   sc.makeRDD(unwatchedMovies).join(movieData).map(ele=>ele._2._2)
     recMovies
   }
}

