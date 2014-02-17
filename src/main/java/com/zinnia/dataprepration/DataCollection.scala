package com.zinnia.dataprepration

import scalaj.http.{HttpOptions, Http}
import scala.xml.{InputSource, XML}
import com.sun.org.apache.xerces.internal.jaxp.SAXParserFactoryImpl
import java.io.StringReader
import org.apache.spark.SparkContext
import org.apache.spark.mllib.recommendation.Rating
import org.apache.spark.rdd.RDD
import java.util.Random


/**
 * Created with IntelliJ IDEA.
 * User: Shashi
 * Date: 12/2/14
 * Time: 7:04 PM
 * To change this template use File | Settings | File Templates.
 */
object DataCollection {
  def main(args: Array[String]) {
    val factory = new SAXParserFactoryImpl()
    val sc = new SparkContext("local","userratings")
    val data = sc.textFile("src/main/resources/atags.txt")
     val parsedData = data.map{ line =>
       val fields = line.split('>')
       val required = fields(6).split("<")
       required(0)
     }

    def split[T: Manifest](data: RDD[T], percentage: Double, seed: Long = System.currentTimeMillis()): (RDD[T], RDD[T]) = {
      val randomNumberGenForPartitions = new Random(seed)
      val partitionRandomNumber = data.partitions.map(each => randomNumberGenForPartitions.nextLong())
      val temp = data.mapPartitionsWithIndex((index, iterator) => {
        val randomNumberGenForRows = new Random(partitionRandomNumber(index))
        val intermediate = iterator.map(each => {
          (each, randomNumberGenForRows.nextDouble())
        })
        intermediate
      })
      (temp.filter(_._2 <= percentage).map(_._1), temp.filter(_._2 > percentage).map(_._1))
    }

    val fewData = split(parsedData,70.0,System.currentTimeMillis())
    val dataString = parsedData.map(ele=>{
      val href = "http://www.cs.utexas.edu/users/downing/netflix/training_set/"+ele
      val response = Http.get(href).option(HttpOptions.connTimeout(10000)).option(HttpOptions.readTimeout(10000)).asString
      response.split("\n")
    })
   val formattedData = dataString.map(elements=>{
     val id = elements(0).substring(0,elements(0).length-1)
     val returnTuple = elements.map(ele=>{
       List(id+","+ele+";")
     })
     returnTuple.flatten.toList
   })

 formattedData.saveAsTextFile("output")

  }
}
