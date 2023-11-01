CREATE DATABASE  IF NOT EXISTS `surgy_latest` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `surgy_latest`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: surgy_latest
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bin_logs`
--

DROP TABLE IF EXISTS `bin_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bin_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mac_id` varchar(50) NOT NULL,
  `timestamp` datetime NOT NULL,
  `connection_status` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bin_logs`
--

LOCK TABLES `bin_logs` WRITE;
/*!40000 ALTER TABLE `bin_logs` DISABLE KEYS */;
INSERT INTO `bin_logs` VALUES (1,'CC:DB:A7:12:91:2C','2023-10-27 07:15:13',1),(2,'CC:DB:A7:12:91:2C','2023-10-27 07:17:18',1),(3,'CC:DB:A7:12:91:2C','2023-10-27 07:18:58',1),(4,'CC:DB:A7:12:91:2C','2023-10-30 00:40:15',1),(5,'CC:DB:A7:12:91:2C','2023-10-30 02:30:48',1),(7,'CC:DB:A7:12:91:2C','2023-10-30 03:00:47',1),(8,'CC:DB:A7:12:91:2C','2023-10-30 03:14:17',1),(9,'123456','2023-10-30 06:53:58',1),(10,'123456','2023-10-30 07:23:54',1),(11,'123456','2023-10-30 07:37:27',1),(12,'CC:DB:A7:12:91:2C','2023-10-30 07:37:56',1);
/*!40000 ALTER TABLE `bin_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bins`
--

DROP TABLE IF EXISTS `bins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bins` (
  `uid` int NOT NULL AUTO_INCREMENT,
  `binname` text,
  `uniquename` text,
  `binstatus` int DEFAULT NULL,
  `comments` text,
  `fact_id` int DEFAULT NULL,
  `firmware` text,
  `mac_id` text,
  `mandate` text,
  `model` text,
  `removed_bins` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bins`
--

LOCK TABLES `bins` WRITE;
/*!40000 ALTER TABLE `bins` DISABLE KEYS */;
INSERT INTO `bins` VALUES (2,NULL,NULL,1,'',3,'Your Firmware','CC:DB:A7:12:91:2C','Your Mandate','Your Model',0),(3,NULL,NULL,1,'Damaged',4,'firmware','123456','01/01/2023','model',0);
/*!40000 ALTER TABLE `bins` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brands`
--

LOCK TABLES `brands` WRITE;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` VALUES (1,'Brand Test 1',1);
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
  `surgeons` text,
  `email` varchar(150) DEFAULT NULL,
  `removed_users` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facilities`
--

LOCK TABLES `facilities` WRITE;
/*!40000 ALTER TABLE `facilities` DISABLE KEYS */;
INSERT INTO `facilities` VALUES (1,'Facility Test','(123) 456-7891','(123) 456-7891','www.testingfacility.com',NULL,'TestingFacility@gmail.com',0),(3,'User Testing Facility','1234567891','1234567891','www.usertestingfacility.com',NULL,'UserTestingFacility@gmail.com',0),(4,'abc','(123) 486-6121','(123) 456-7891','www.coodfd.com',NULL,'dsd@gmail.com',0),(5,'sdadas','1234567891','1234567891','www.a.com',NULL,'ss@gmail.com',0);
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fav_iols`
--

LOCK TABLES `fav_iols` WRITE;
/*!40000 ALTER TABLE `fav_iols` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `manufacturers`
--

LOCK TABLES `manufacturers` WRITE;
/*!40000 ALTER TABLE `manufacturers` DISABLE KEYS */;
INSERT INTO `manufacturers` VALUES (1,'Manu Test 1','');
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `models`
--

LOCK TABLES `models` WRITE;
/*!40000 ALTER TABLE `models` DISABLE KEYS */;
INSERT INTO `models` VALUES (1,'Model Test 1',1);
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
  `surgery_date` varchar(10) DEFAULT NULL,
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
  `first_sel_type` text,
  `second_sel_type` text,
  `b_manufacture_id` int DEFAULT NULL,
  `b_brand_id` int DEFAULT NULL,
  `b_model_id` int DEFAULT NULL,
  `b_power_id` text,
  `status` int DEFAULT NULL,
  `bin_mac_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,3,'10/24/2023','John','Doe','Henry','01/01/1995','right',1,1,1,'10',5,3,'','',1,1,1,'11.5',1,'CC:DB:A7:12:91:2C'),(2,3,'10/26/2023','aaa','aaa','aaa','01/08/1995','left',1,1,1,'13.5',5,3,'','fav1',1,1,1,'12.5',0,'CC:DB:A7:12:91:2C');
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
  `selected_sc` text NOT NULL,
  `used_sc` text NOT NULL,
  `removed_users` tinyint DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `other_users`
--

LOCK TABLES `other_users` WRITE;
/*!40000 ALTER TABLE `other_users` DISABLE KEYS */;
INSERT INTO `other_users` VALUES (1,1,'John','Doe','Henry','1234567891','JohnDoe@gmail.com','','Iolx7f84',NULL,'','',0),(2,5,'Dr','Sajjad','Akhter','1234567891','sajjadakhterDR@gmail.com','NPI12345','BVBZBgEZ',NULL,'','',0);
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `practises`
--

LOCK TABLES `practises` WRITE;
/*!40000 ALTER TABLE `practises` DISABLE KEYS */;
/*!40000 ALTER TABLE `practises` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `surgeon_facility`
--

DROP TABLE IF EXISTS `surgeon_facility`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `surgeon_facility` (
  `id` int NOT NULL AUTO_INCREMENT,
  `surgeon_id` int NOT NULL,
  `facility_id` int NOT NULL,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `surgeon_facility`
--

LOCK TABLES `surgeon_facility` WRITE;
/*!40000 ALTER TABLE `surgeon_facility` DISABLE KEYS */;
INSERT INTO `surgeon_facility` VALUES (1,5,3,0),(2,5,3,0);
/*!40000 ALTER TABLE `surgeon_facility` ENABLE KEYS */;
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
  `facility_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin',1,NULL),(2,'TestingFacility@gmail.com','3YzAiaCg',3,NULL),(4,'UserTestingFacility@gmail.com','GVel4Xel',3,NULL),(5,'Dr','BVBZBgEZ',2,NULL),(6,'dsd@gmail.com','YVpOBmJ0',3,NULL),(7,'sss@gmail.com','tttlC0LT',3,NULL);
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

-- Dump completed on 2023-10-31  1:59:12
