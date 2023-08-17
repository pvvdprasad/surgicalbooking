-- MySQL dump 10.13  Distrib 8.0.33, for Linux (x86_64)
--
-- Host: localhost    Database: surgy_latest
-- ------------------------------------------------------
-- Server version	8.0.33-0ubuntu0.20.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `brands`
--

DROP TABLE IF EXISTS `brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brands` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bname` char(200) NOT NULL,
  `mid` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brands`
--

LOCK TABLES `brands` WRITE;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` VALUES (3,'brand 3',4),(4,'gdffgfgdfg',4);
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `facilities`
--

DROP TABLE IF EXISTS `facilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facilities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fname` char(200) NOT NULL,
  `fax` char(50) DEFAULT NULL,
  `cell` char(50) DEFAULT NULL,
  `website` char(150) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facilities`
--

LOCK TABLES `facilities` WRITE;
/*!40000 ALTER TABLE `facilities` DISABLE KEYS */;
INSERT INTO `facilities` VALUES (1,'Test facility','68778686778','7667876887','dfgdgdfgdgdgd.dgfd'),(2,'Mason Surgery Center','900980908888','099000880989','www.mason.com'),(4,'ttttttttttt','76565756','6657675','hgjhggh.com');
/*!40000 ALTER TABLE `facilities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fav_iols`
--

DROP TABLE IF EXISTS `fav_iols`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fav_iols` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fav_type` char(50) NOT NULL,
  `surgeon_id` int NOT NULL,
  `manufacture` char(50) DEFAULT NULL,
  `model` char(50) DEFAULT NULL,
  `brand` char(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fav_iols`
--

LOCK TABLES `fav_iols` WRITE;
/*!40000 ALTER TABLE `fav_iols` DISABLE KEYS */;
INSERT INTO `fav_iols` VALUES (1,'fav1',1,'2','1','1'),(2,'fav2',1,'2','5','2'),(3,'fav3',1,'2','3','2');
/*!40000 ALTER TABLE `fav_iols` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `manufacturers`
--

DROP TABLE IF EXISTS `manufacturers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `manufacturers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mname` char(200) NOT NULL,
  `cell` char(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `manufacturers`
--

LOCK TABLES `manufacturers` WRITE;
/*!40000 ALTER TABLE `manufacturers` DISABLE KEYS */;
INSERT INTO `manufacturers` VALUES (3,'test 3',''),(4,'test 4','');
/*!40000 ALTER TABLE `manufacturers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `models`
--

DROP TABLE IF EXISTS `models`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `models` (
  `id` int NOT NULL AUTO_INCREMENT,
  `model_name` char(200) NOT NULL,
  `bid` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `models`
--

LOCK TABLES `models` WRITE;
/*!40000 ALTER TABLE `models` DISABLE KEYS */;
INSERT INTO `models` VALUES (4,'model 654',3),(6,'WF',5);
/*!40000 ALTER TABLE `models` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `surgery_center_id` int NOT NULL,
  `surgery_date` char(10) NOT NULL,
  `first_name` char(50) DEFAULT NULL,
  `middle_name` char(50) DEFAULT NULL,
  `last_name` char(50) DEFAULT NULL,
  `patient_dob` char(20) DEFAULT NULL,
  `side` char(10) DEFAULT NULL,
  `manufacture_id` int DEFAULT NULL,
  `brand_id` int DEFAULT NULL,
  `model_id` int DEFAULT NULL,
  `power_id` char(5) DEFAULT NULL,
  `surgeon_id` int DEFAULT NULL,
  `practise_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (6,2,'07/07/2023','kuuuh','ihkkhohhkhkj','hkhkkkhk','07/28/2023','left',2,1,1,'8',0,0),(7,1,'07/11/2023','test','p','patient','04/03/2023','left',2,1,1,'20',0,0),(8,1,'08/11/2023','patient 1','middle name','last name','03/14/2023','left',4,3,4,'9',0,0);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `other_users`
--

DROP TABLE IF EXISTS `other_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `other_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `first_name` char(50) DEFAULT NULL,
  `middle_name` char(50) DEFAULT NULL,
  `last_name` char(50) DEFAULT NULL,
  `cell` char(50) DEFAULT NULL,
  `email` char(150) DEFAULT NULL,
  `npi` char(50) DEFAULT NULL,
  `passcode` char(50) DEFAULT NULL,
  `fact_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `other_users`
--

LOCK TABLES `other_users` WRITE;
/*!40000 ALTER TABLE `other_users` DISABLE KEYS */;
INSERT INTO `other_users` VALUES (3,1,'jjhjhkhk','khkhkjkhj','hkhkjhk','88878786','gjgjgj@kjjhdf.gfg','','6UJ67Q7c',NULL),(4,2,'Test','user','lklfkj','897978979','tuser@gmail.com','','9xsDRRtv',NULL),(5,0,'tr pra1','tr middle','tr last','76887788687','pvvdprasad@gmail.com','undefined','8LIc8K8d',2),(6,0,'tp fname','tp mname','tp lname','97989898778','pvvdprasad@gmail.com','undefined','MWXgvgmY',2),(7,0,'kjkjk','hjjyg','dgdffg','87886876','pvvdprasad@gmail.com','undefined','4ft5N1xy',2),(8,0,'klo','kjjnknnkj','kjnkjnnkjnkj','997798979','pvvdprasad@gmail.com','undefined','X9odzbxb',2),(9,0,'uhuiu','hiuhiihiu','igugyg','878787','pvvdprasad@gmail.com','undefined','gaNwPxjm',2),(10,9,'oihuuhuuuh','hkuhkhkjhj','hkhkjhkhkh','888878686','pvvdprasad@gmail.com','78787867','fzPbvnIw',2),(11,10,'d','prasad','pvvd','0808090','pvvdprasad@gmail.com','8787877','kKic6VXn',2),(15,13,'tttsss','ssss','kkjljklkj','86887867876','pvvdprasad@gmail.com','7867687678','9xN7Boiq',1);
/*!40000 ALTER TABLE `other_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `practises`
--

DROP TABLE IF EXISTS `practises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `practises` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pname` char(200) NOT NULL,
  `fax` char(50) DEFAULT NULL,
  `cell` char(50) DEFAULT NULL,
  `website` char(150) DEFAULT NULL,
  `npi` char(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `practises`
--

LOCK TABLES `practises` WRITE;
/*!40000 ALTER TABLE `practises` DISABLE KEYS */;
INSERT INTO `practises` VALUES (1,'rrrrrrrrr','78686687687','6787868687','ddddddddddd','878686767');
/*!40000 ALTER TABLE `practises` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` char(30) NOT NULL,
  `passcode` char(30) NOT NULL,
  `role` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'surgeon','surgeon',2),(2,'admin','admin',1),(3,'tr pra1','8LIc8K8d',2),(4,'tp fname','MWXgvgmY',2),(5,'kjkjk','4ft5N1xy',2),(6,'klo','X9odzbxb',2),(7,'uhuiu','gaNwPxjm',2),(8,'oiijjlklkj','4Os5sbGj',2),(9,'oihuuhuuuh','fzPbvnIw',2),(10,'d','kKic6VXn',2),(11,'uhkhhhkjkjk','3B0QZptK',2),(12,'slkjlksf','naA5kt4X',2),(13,'tttsss','9xN7Boiq',2);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-08-08  7:46:47
