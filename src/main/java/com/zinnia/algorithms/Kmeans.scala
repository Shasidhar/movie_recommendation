package com.zinnia.algorithms

import org.apache.spark.rdd.RDD
import org.apache.spark.mllib.clustering.KMeans
import org.apache.spark.mllib.util.MLUtils
import scala.Array

/**
 * Created with IntelliJ IDEA.
 * User: Shashi
 * Date: 14/2/14
 * Time: 1:42 PM
 * To change this template use File | Settings | File Templates.
 */
class Kmeans {
  /**
   *
   * @param inputRDD - Input data set which will be used to run K-means
   * @param noOfCluster - Number of clusters which will be set for the data set
   * @return - Returns the cost of the algorithm
   */
  def runKmeans(inputRDD :RDD[Array[Double]],noOfCluster:Int) :Double= {
    val customKmeans = new KMeans()
    customKmeans.setK(noOfCluster).setEpsilon(0.001)
    val model = customKmeans.run(inputRDD)
    val clusterCenters = model.clusterCenters.map(line=>{
      line.map(l=>l )})
    println("centroids are")
    clusterCenters.map(line=>{
      println(line.mkString("\t"))
    })
    println("cost is "+model.computeCost(inputRDD))
    model.computeCost(inputRDD)
  }

  /**
   *
   * @param centers - Centroids for that cluster
   * @param points - Input data set
   * @return - returns the RDD of tuples (ClusterId,productId,centriodForCluster,originalProductFeatures)
   */
  def mapCentroidForEachCluster(centers: Array[Array[Double]], points:RDD[(Int,Array[Double])]): RDD[(Int,Int,Array[Double],Array[Double])]= {
    var clusterNo = 0
    val regeneratedPixelRDD = points.map(point =>{
      var bestDistance = Double.PositiveInfinity
      for (i <- 0 until centers.length) {
        val distance = MLUtils.squaredDistance(point._2, centers(i))
        if (distance < bestDistance) {
          bestDistance = distance
          clusterNo = i
        }
      }
      (clusterNo,point._1,centers(clusterNo),point._2)
    } )
    regeneratedPixelRDD
  }

  /**
   * @param inputRDD - Input data set which will be used to run K-means
   * @param noOfCluster - Number of clusters which will be set for the data set
   * @return - returns all the centroids for data set
   */
  def getCentroids(inputRDD :RDD[Array[Double]],noOfCluster:Int) :Array[Array[Double]]= {
    val customKmeans = new KMeans()
    customKmeans.setK(noOfCluster).setEpsilon(0.001)
    val model = customKmeans.run(inputRDD)
    model.clusterCenters
  }
}
